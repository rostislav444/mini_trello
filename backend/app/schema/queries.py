import graphene
from graphene import relay

from app.models import (
    UsersModel,
    DashboardModel,
    ColumnsModel,
    CardsModel,
    CardAssigneeModel,
    CardCommentsModel,
    DashboardAssigneeModel
)
from app.schema.types import (
    Users,
    Dashboard,
    Columns,
    Cards,
    CardAssignee,
    CardComments,
)


class Query(graphene.ObjectType):
    node = relay.Node.Field()
    users = graphene.List(Users)
    dashboard = graphene.List(Dashboard, dashboard_id=graphene.String())
    columns = graphene.List(Columns, dashboard_id=graphene.String(required=True))
    card = graphene.Field(Cards, card_id=graphene.String(required=True))
    cards = graphene.List(Cards, column_id=graphene.String(required=True))
    card_assignee = graphene.List(CardAssignee)
    card_comments = graphene.List(CardComments)

    def resolve_users(self, info):
        return UsersModel.scan()

    def resolve_dashboard(self, info, dashboard_id=None):
        user_id = info.root_value.get('user')

        # Use GSI to get all the assignments for this user_id
        assignments = list(DashboardAssigneeModel.dashboard_assignee_index.query(user_id))

        # Extract dashboard_ids from assignments
        dashboard_ids = [assignment.dashboard_id for assignment in assignments]

        # If a specific dashboard id is provided
        if dashboard_id:
            # Check if the user is assigned to the provided dashboard_id
            if dashboard_id in dashboard_ids:
                return [DashboardModel.get(dashboard_id)]
            else:
                # The provided id is not in the list of user's dashboards.
                return []

        # If no specific dashboard_id is provided, fetch all assigned dashboards
        user_dashboards = DashboardModel.batch_get(dashboard_ids)

        return user_dashboards

    def resolve_columns(self, info, dashboard_id):
        return ColumnsModel.column_order_index.query(
            dashboard_id,
            scan_index_forward=True
        )

    def resolve_card(self, info, card_id):
        return CardsModel.get(card_id)

    def resolve_cards(self, info,  column_id=None):
        if column_id:
            return CardsModel.card_order_index.query(
                column_id,
                scan_index_forward=True
            )

    def resolve_card_assignee(self, info):
        return CardAssigneeModel.scan()

    def resolve_card_comments(self, info):
        return CardCommentsModel.scan()


__all__ = [
    'Query'
]
