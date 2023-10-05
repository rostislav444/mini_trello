import graphene

from app.schema.mutation import Mutation
from app.schema.queries import Query

schema = graphene.Schema(query=Query, mutation=Mutation)

__all__ = ['schema']
