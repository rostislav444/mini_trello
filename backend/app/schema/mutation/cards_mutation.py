import uuid

import graphene

from app.models import CardsModel, CardAssigneeModel, PriorityEnum
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
        actual_column_id = decode_id(column_id)

        # Use the GSI to count the cards with the specific column_id
        existing_cards_count = CardsModel.card_order_index.count(hash_key=actual_column_id)

        # Create a new card instance and set its order
        card = CardsModel(
            id=str(uuid.uuid4()),
            column_id=actual_column_id,
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
        actual_card_id = decode_id(card_id)

        # Fetch the card from the database
        card = CardsModel.get(actual_card_id)

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
            existing_assignees = CardAssigneeModel.scan(CardAssigneeModel.card_id == actual_card_id)
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


class CardMutation:
    create_card = CreateCard.Field()
    update_card = UpdateCard.Field()


__all__ = [
    'CardMutation'
]
