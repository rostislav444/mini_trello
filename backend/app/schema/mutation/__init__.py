import graphene

from .card_comments_mutation import CardCommentsMutation
from .cards_mutation import CardMutation
from .columns_mutation import ColumnMutation
from .dashboard_mutation import DashboardMutation
from .user_muatation import UserMutation


class Mutation(
    graphene.ObjectType,
    CardCommentsMutation,
    CardMutation,
    ColumnMutation,
    DashboardMutation,
    UserMutation,
):
    pass


__all__ = [
    'Mutation'
]
