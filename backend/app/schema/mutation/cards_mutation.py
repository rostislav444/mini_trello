import uuid

import graphene

from app.models import CardsModel, CardAssigneeModel, PriorityEnum, CardCommentsModel
from app.schema.types import Cards
from utils.valid_uuid import decode_id


class CreateCard(graphene.Mutation):
    class Arguments:
        column_id = graphene.String(required=True)
        title = graphene.String(required=True)
        description = graphene.String(required=False)
        priority = PriorityEnum(required=True)
        assignees = graphene.List(graphene.String, required=False)

    card = graphene.Field(Cards)

    def mutate(self, info, column_id, title, priority, description=None, assignees=[]):
        # Use the GSI to count the cards with the specific column_id
        existing_cards_count = CardsModel.card_order_index.count(hash_key=column_id)

        # Create a new card instance and set its order
        card = CardsModel(
            id=str(uuid.uuid4()),
            column_id=column_id,
            title=title,
            description=description,
            order=existing_cards_count + 1,
            priority=priority
        )
        card.save()

        # Save the card assignees
        for user_id in assignees:
            card_assignee = CardAssigneeModel(
                id=str(uuid.uuid4()),
                card_id=card.id,
                user_id=user_id
            )
            card_assignee.save()

        return CreateCard(card=card)


class UpdateCard(graphene.Mutation):
    class Arguments:
        card_id = graphene.String(required=True)
        column_id = graphene.String(required=False)
        title = graphene.String(required=False)
        description = graphene.String(required=False)
        priority = PriorityEnum(required=False)
        assignees = graphene.List(graphene.String, required=False)

    card = graphene.Field(Cards)

    def mutate(self, info, card_id, **kwargs):
        card_id = decode_id(card_id)

        # Fetch the card from the database
        card = CardsModel.get(card_id)

        # Update the card's fields if provided
        if "column_id" in kwargs:
            card.column_id = decode_id(kwargs["column_id"])
        if "title" in kwargs:
            card.title = kwargs["title"]
        if "description" in kwargs:
            card.description = kwargs["description"]
        if "priority" in kwargs:
            card.priority = kwargs["priority"]

        # Save the card updates
        card.save()

        # Update card assignees if provided
        if "assignees" in kwargs:
            # First, remove the existing assignees
            existing_assignees = CardAssigneeModel.scan(CardAssigneeModel.card_id == card_id)
            for assignee in existing_assignees:
                assignee.delete()

            # Add the new assignees
            for user_id in kwargs["assignees"]:
                card_assignee = CardAssigneeModel(
                    id=str(uuid.uuid4()),
                    card_id=card.id,
                    user_id=user_id
                )
                card_assignee.save()

        return UpdateCard(card=card)


class ReorderCard(graphene.Mutation):
    class Arguments:
        card_id = graphene.String(required=True)
        column_id = graphene.String(required=True)
        order = graphene.Int(required=True)

    card = graphene.Field(Cards)

    def mutate(self, info, card_id, column_id, order):
        # Retrieve the card to be moved
        moving_card = CardsModel.get(card_id)

        # Check if the card is being moved within the same column or to a different one
        if moving_card.column_id == column_id:
            # Reorder cards inside the same column

            # Get all cards in the current column
            cards_in_column = list(CardsModel.card_order_index.query(column_id))

            # Adjust the order of the cards affected by the move
            for card in cards_in_column:
                if card.order > moving_card.order:
                    card.order -= 1
                    card.save()

                if card.order >= order:
                    card.order += 1
                    card.save()

        else:
            # Move card to another column

            # Decrease the order of cards in the original column that are after the moving card
            original_cards = list(CardsModel.card_order_index.query(moving_card.column_id))
            for card in original_cards:
                if card.order > moving_card.order:
                    card.order -= 1
                    card.save()

            # Increase the order of cards in the target column that are after the specified order
            target_cards = list(CardsModel.card_order_index.query(column_id))
            for card in target_cards:
                if card.order >= order:
                    card.order += 1
                    card.save()

            # Update the column_id of the moving card
            moving_card.column_id = column_id

        # Update the order of the moving card and save it
        moving_card.order = order
        moving_card.save()

        return ReorderCard(card=moving_card)


class DeleteCard(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    card = graphene.Field(Cards)

    def mutate(self, info, id):
        card_to_delete = CardsModel.get(id)

        # Delete the card assignees
        existing_assignees = CardAssigneeModel.scan(CardAssigneeModel.card_id == card_to_delete.id)

        for assignee in existing_assignees:
            assignee.delete()

        # Delete all card comments
        existing_comments = CardCommentsModel.scan(CardCommentsModel.card_id == card_to_delete.id)

        for comment in existing_comments:
            comment.delete()

        # Get all cards in the current column
        cards_in_column = list(CardsModel.card_order_index.query(card_to_delete.column_id))

        # Adjust the order of the cards that come after the card being deleted
        for card in cards_in_column:
            if card.order > card_to_delete.order:
                card.order -= 1
                card.save()

        # Delete the specified card
        card_to_delete.delete()

        return DeleteCard(card=card_to_delete)


class CardMutation:
    create_card = CreateCard.Field()
    update_card = UpdateCard.Field()
    reorder_card = ReorderCard.Field()
    delete_card = DeleteCard.Field()


__all__ = [
    'CardMutation'
]
