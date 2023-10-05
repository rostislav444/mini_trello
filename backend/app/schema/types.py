import graphene

from app.models import (
    UsersModel,
    DashboardModel,
    DashboardAssigneeModel,
    ColumnsModel,
    CardsModel,
    CardAssigneeModel,
    CardCommentsModel,
    CardAttachmentsModel
)
from utils.pynamo_model_boject_type import PynamoObjectType


class Users(PynamoObjectType):
    class Meta:
        model = UsersModel
        interfaces = (graphene.Node,)


class CardAssignee(PynamoObjectType):
    class Meta:
        model = CardAssigneeModel
        interfaces = (graphene.Node,)


class CardComments(PynamoObjectType):
    class Meta:
        model = CardCommentsModel
        interfaces = (graphene.Node,)


class CardAttachments(PynamoObjectType):
    class Meta:
        model = CardAttachmentsModel
        interfaces = (graphene.Node,)


class Cards(PynamoObjectType):
    assignees = graphene.List(Users)

    class Meta:
        model = CardsModel
        interfaces = (graphene.Node,)

    def resolve_assignees(self, info):
        assignee_relations = CardAssigneeModel.scan(CardAssigneeModel.card_id == self.id)
        user_ids = [relation.user_id for relation in assignee_relations]
        users = list(UsersModel.batch_get(user_ids))
        return users


class Columns(PynamoObjectType):
    cards = graphene.List(Cards)

    class Meta:
        model = ColumnsModel
        interfaces = (graphene.Node,)

    def resolve_cards(self, info):
        return CardsModel.card_order_index.query(
            self.id,
            scan_index_forward=True
        )


class Dashboard(PynamoObjectType):
    assignees = graphene.List(Users)
    columns = graphene.List('app.schema.types.Columns')

    class Meta:
        model = DashboardModel
        interfaces = (graphene.Node,)

    def resolve_assignees(self, info):
        assignee_relations = DashboardAssigneeModel.scan(DashboardAssigneeModel.dashboard_id == self.id)
        user_ids = [relation.user_id for relation in assignee_relations]
        users = list(UsersModel.batch_get(user_ids))
        return users

    def resolve_columns(self, info):
        return ColumnsModel.column_order_index.query(
            self.id,
            scan_index_forward=True
        )


class DashboardAssignee(PynamoObjectType):
    class Meta:
        model = DashboardAssigneeModel
        interfaces = (graphene.Node,)


__all__ = [
    'Users',
    'Dashboard',
    'Columns',
    'Cards',
    'CardAssignee',
    'CardComments',
    'CardAttachments'
]
