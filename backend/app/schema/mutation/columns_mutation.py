import uuid

import graphene

from app.models import ColumnsModel, CardCommentsModel, CardsModel, CardAssigneeModel
from app.schema.types import Columns
from utils.valid_uuid import decode_id


class CreateColumn(graphene.Mutation):
    class Arguments:
        dashboard_id = graphene.String(required=True)
        title = graphene.String(required=True)
        description = graphene.String(required=False)
        order = graphene.Int(required=False)

    column = graphene.Field(Columns)

    def mutate(self, info, dashboard_id, title, description=None, order=None):
        actual_dashboard_id = decode_id(dashboard_id)

        # Use the GSI to count the columns with the specific dashboard_id
        existing_columns_count = ColumnsModel.column_order_index.count(hash_key=actual_dashboard_id)

        # Validate the provided order
        if order is None or order < 1 or order > existing_columns_count + 1:
            order = existing_columns_count + 1

        # If the provided order is less than existing_columns_count+1, shift the orders of subsequent columns
        if order <= existing_columns_count:
            # Query existing columns starting from the given order
            columns_to_update = ColumnsModel.column_order_index.query(
                hash_key=actual_dashboard_id,
                range_key_condition=ColumnsModel.order >= order
            )

            # Update the order for each column
            for col in columns_to_update:
                col.update(actions=[
                    ColumnsModel.order.set(col.order + 1)
                ])

        # Create a new column instance with the given/provided order
        column = ColumnsModel(
            id=str(uuid.uuid4()),
            dashboard_id=actual_dashboard_id,
            title=title,
            description=description,
            order=order,
        )
        column.save()
        return CreateColumn(column=column)


class UpdateColumn(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        title = graphene.String(required=False)
        description = graphene.String(required=False)
        order = graphene.Int(required=False)

    column = graphene.Field(Columns)

    def mutate(self, info, id, title=None, description=None, order=None):
        column = ColumnsModel.get(id)
        actions = []

        if title:
            actions.append(ColumnsModel.title.set(title))

        if description:
            actions.append(ColumnsModel.description.set(description))

        if order and order != column.order:
            current_order = column.order
            existing_columns_count = ColumnsModel.column_order_index.count(hash_key=column.dashboard_id)

            # Validate new order value
            if order < 1:
                raise Exception("Order cannot be less than 1.")
            elif order > existing_columns_count:
                raise Exception(f"Order cannot be greater than {existing_columns_count}.")

            # Check if another column with the target order exists
            existing_order_columns = list(ColumnsModel.column_order_index.query(
                hash_key=column.dashboard_id,
                range_key_condition=ColumnsModel.order == order
            ))

            if existing_order_columns:
                # There should be exactly one column with the target order.
                # Swap the order of this column with the current_order
                neighbour = existing_order_columns[0]
                neighbour.update(actions=[ColumnsModel.order.set(current_order)])

            # Set the desired order for the updating column
            actions.append(ColumnsModel.order.set(order))

        # Apply all the actions to update the column
        column.update(actions=actions)

        return UpdateColumn(column=column)


class ReorderColumn(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        order = graphene.Int(required=True)

    column = graphene.Field(Columns)

    def mutate(self, info, id, order):
        # Retrieve the column specified by the provided ID
        target_column = ColumnsModel.get(id)

        # Validate the order
        existing_columns_count = ColumnsModel.column_order_index.count(hash_key=target_column.dashboard_id)
        if order < 1 or order > existing_columns_count:
            raise Exception("Invalid order provided")

        # If the desired order is the same as the current order, simply return the target column
        if order == target_column.order:
            return ReorderColumn(column=target_column)

        # Retrieve the column that currently occupies the desired order (neighbor column)
        neighbor_columns = list(ColumnsModel.column_order_index.query(
            hash_key=target_column.dashboard_id,
            range_key_condition=ColumnsModel.order == order
        ))

        # There should be exactly one neighbor column in the result. If not, an error has occurred
        if len(neighbor_columns) != 1:
            raise Exception("Unexpected error occurred while reordering")

        neighbor_column = neighbor_columns[0]

        # Update the order of the neighbor column to the current order of the target column
        neighbor_column.update(actions=[
            ColumnsModel.order.set(target_column.order)
        ])

        # Update the order of the target column to the desired order
        target_column.update(actions=[
            ColumnsModel.order.set(order)
        ])

        return ReorderColumn(column=target_column, neighbor_column=neighbor_column)


class DeleteColumn(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    column = graphene.Field(Columns)

    def mutate(self, info, id):
        column_to_delete = ColumnsModel.get(id)

        # Fetch and delete all the cards in the column
        cards_in_column = list(CardsModel.card_order_index.query(column_to_delete.id))
        for card in cards_in_column:

            # Fetch and delete all the comments associated with the card
            comments_in_card = list(CardCommentsModel.card_comments_index.query(card.id))
            for comment in comments_in_card:
                comment.delete()

            # Fetch and delete all the assignees associated with the card
            assignees_in_card = list(CardAssigneeModel.scan(CardAssigneeModel.card_id == card.id))
            for assignee in assignees_in_card:
                assignee.delete()

            # Delete the card itself
            card.delete()

        # Fetch all columns in the same dashboard as the column being deleted
        columns_in_dashboard = list(ColumnsModel.column_order_index.query(column_to_delete.dashboard_id))

        # Adjust the order of the columns that come after the column being deleted
        for column in columns_in_dashboard:
            if column.order > column_to_delete.order:
                column.order -= 1
                column.save()

        # Delete the column itself
        column_to_delete.delete()

        return DeleteColumn(column=column_to_delete)


class ColumnMutation:
    createColumn = CreateColumn.Field()
    updateColumn = UpdateColumn.Field()
    deleteColumn = DeleteColumn.Field()
    reorderColumn = ReorderColumn.Field()


__all__ = [
    'ColumnMutation'
]
