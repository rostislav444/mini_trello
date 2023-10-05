import uuid

import graphene
from graphql_relay import from_global_id

from app.models import ColumnsModel
from app.schema.types import Columns
from utils.valid_uuid import decode_id


class CreateColumn(graphene.Mutation):
    class Arguments:
        dashboard_id = graphene.String(required=True)
        title = graphene.String(required=True)
        description = graphene.String(required=False)

    column = graphene.Field(Columns)

    def mutate(self, info, dashboard_id, title, description=None):
        actual_dashboard_id = decode_id(dashboard_id)

        # Use the GSI to count the columns with the specific dashboard_id
        existing_columns_count = ColumnsModel.column_order_index.count(hash_key=actual_dashboard_id)

        # Create a new column instance and set its order
        column = ColumnsModel(
            id=str(uuid.uuid4()),
            dashboard_id=actual_dashboard_id,
            title=title,
            description=description,
            order=existing_columns_count + 1,
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
        column = ColumnsModel.get(from_global_id(id)[1])
        actions = []

        if title:
            actions.append(ColumnsModel.title.set(title))

        if description:
            actions.append(ColumnsModel.description.set(description))

        if order and order != column.order:
            current_order = column.order
            max_order = ColumnsModel.count(ColumnsModel.dashboard_id == column.dashboard_id)

            # Validate new order value
            if order < 1:
                raise Exception("Order cannot be less than 1.")
            elif order > max_order:
                raise Exception(f"Order cannot be greater than {max_order}.")

            # Check if another column with the target order exists
            try:
                neighbour = ColumnsModel.query(ColumnsModel.dashboard_id == column.dashboard_id,
                                               ColumnsModel.order == order).next()
                neighbour.update(actions=[ColumnsModel.order.set(current_order)])
            except StopIteration:
                pass  # No neighbour column with the target order

            actions.append(ColumnsModel.order.set(order))

        column.update(actions=actions)
        return UpdateColumn(column=column)


class DeleteColumn(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    column = graphene.Field(Columns)

    def mutate(self, info, id):
        column = ColumnsModel.get(from_global_id(id)[1])
        column.delete()
        return DeleteColumn(column=column)


class ColumnMutation:
    createColumn = CreateColumn.Field()
    updateColumn = UpdateColumn.Field()
    deleteColumn = DeleteColumn.Field()


__all__ = [
    'ColumnMutation'
]
