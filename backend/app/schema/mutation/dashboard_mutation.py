import uuid

import graphene
from graphql_relay import from_global_id

from app.models import DashboardModel, UsersModel, DashboardAssigneeModel, ColumnsModel
from app.schema.types import Dashboard
from utils.valid_uuid import is_valid_uuid, decode_ids


class CreateDashboard(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String(required=False)
        assignees = graphene.List(graphene.String, required=False)
        columns = graphene.List(graphene.String, required=False)

    dashboard = graphene.Field(Dashboard)

    def mutate(self, info, title, description=None, assignees=[], columns=[]):
        creator_id = info.root_value.get('user')
        assignee_ids = decode_ids(assignees)

        # Save the dashboard
        dashboard = DashboardModel(
            id=str(uuid.uuid4()),
            title=title,
            description=description,
        )
        dashboard.save()

        # Save the dashboard assignees
        for user_id in [creator_id, *assignee_ids]:
            dashboard_assignee = DashboardAssigneeModel(
                id=str(uuid.uuid4()),
                dashboard_id=dashboard.id,
                user_id=user_id
            )
            dashboard_assignee.save()

        # Save the columns
        for n, column in enumerate(columns):
            dashboard_column = ColumnsModel(
                id=str(uuid.uuid4()),
                title=column,
                order=n+1,
                dashboard_id=dashboard.id
            )
            dashboard_column.save()
        return CreateDashboard(dashboard=dashboard)


class UpdateDashboard(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        title = graphene.String(required=False)
        description = graphene.String(required=False)
        assignees = graphene.List(graphene.String, required=False)

    dashboard = graphene.Field(Dashboard)

    @staticmethod
    def get_assignees(assignees):
        actual_ids = [from_global_id(decoded_id)[1] for decoded_id in assignees]
        users = list(UsersModel.batch_get(actual_ids))
        return [user.id for user in users]  # return a list of user IDs

    def mutate(self, info, id, title=None, description=None, assignees=None):
        dashboard = DashboardModel.get(from_global_id(id)[1])
        actions = []

        if title:
            actions.append(DashboardModel.title.set(title))

        if description:
            actions.append(DashboardModel.description.set(description))

        if assignees:
            actual_ids = [from_global_id(decoded_id)[1] for decoded_id in assignees]
            users_ids = list(UsersModel.batch_get(actual_ids))
            actions.append(DashboardModel.assignees.set(users_ids))

        dashboard.update(actions=actions)

        return UpdateDashboard(dashboard=dashboard)


class DeleteDashboard(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    dashboard = graphene.Field(Dashboard)

    def mutate(self, info, id):
        dashboard = DashboardModel.get(id)

        dashboard.delete()

        return DeleteDashboard(dashboard=dashboard)


class DashboardMutation:
    createDashboard = CreateDashboard.Field()
    updateDashboard = UpdateDashboard.Field()
    deleteDashboard = DeleteDashboard.Field()


__all__ = [
    'DashboardMutation'
]
