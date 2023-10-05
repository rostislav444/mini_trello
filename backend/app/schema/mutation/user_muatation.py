import uuid

import graphene
from graphql_relay import from_global_id

from app.models import RoleEnum, UsersModel
from app.schema.types import Users


class CreateUser(graphene.Mutation):
    class Arguments:
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        role = RoleEnum(required=True)

    user = graphene.Field(Users)

    def mutate(self, info, first_name, last_name, email, password, role):
        user = UsersModel(
            id=str(uuid.uuid4()),
            first_name=first_name,
            last_name=last_name,
            email=email,
            role=role.value
        )
        user.set_password(password)
        user.save()

        return CreateUser(user=user)



class UpdateUser(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        email = graphene.String(required=True)
        role = RoleEnum(required=True)

    user = graphene.Field(Users)

    def mutate(self, info, id, first_name, last_name, email, role):
        user = UsersModel.get(from_global_id(id)[1])

        user.update(
            actions=[
                UsersModel.first_name.set(first_name),
                UsersModel.last_name.set(last_name),
                UsersModel.email.set(email),
                UsersModel.role.set(role)
            ]
        )

        return UpdateUser(user=user)


class DeleteAllUsers(graphene.Mutation):
    class Arguments:
        pass

    success = graphene.Boolean()
    deleted_count = graphene.Int()

    def mutate(self, info):
        count = 0
        for user in UsersModel.scan():
            user.delete()
            count += 1

        return DeleteAllUsers(success=True, deleted_count=count)


class UserMutation:
    createUser = CreateUser.Field()
    updateUser = UpdateUser.Field()
    deleteUser = DeleteAllUsers.Field()


__all__ = [
    'UserMutation'
]