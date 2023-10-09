import uuid

import graphene

from app.models import CardCommentsModel
from app.schema.types import CardComments


class CreateCardCommentMutation(graphene.Mutation):
    class Arguments:
        card_id = graphene.String(required=True)
        comment = graphene.String(required=True)

    card_comments = graphene.Field(CardComments)

    def mutate(self, info, card_id, comment):
        creator_id = info.root_value.get('user')

        card_comment = CardCommentsModel(
            id=str(uuid.uuid4()),
            user_id=creator_id,
            card_id=card_id,
            comment=comment,
        )
        card_comment.save()

        return CreateCardCommentMutation(card_comments=card_comment)


class DeleteCardCommentMutation(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    card_comments = graphene.Field(CardComments)

    def mutate(self, info, id):
        user_id = info.root_value.get('user')
        card_comment_to_delete = CardCommentsModel.get(id)

        if card_comment_to_delete.user_id != user_id:
            raise Exception('You are not allowed to delete this comment')

        card_comment_to_delete.delete()

        return DeleteCardCommentMutation(card_comments=card_comment_to_delete)


class CardCommentsMutation:
    create_card_comment = CreateCardCommentMutation.Field()
    delete_card_comment = DeleteCardCommentMutation.Field()
