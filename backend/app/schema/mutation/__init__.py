import graphene

from .columns_mutation import ColumnMutation
from .dashboard_mutation import DashboardMutation
from .user_muatation import UserMutation
from .cards_mutation import CardMutation


class Mutation(graphene.ObjectType, UserMutation, DashboardMutation, ColumnMutation, CardMutation):
    pass


__all__ = [
    'Mutation'
]
