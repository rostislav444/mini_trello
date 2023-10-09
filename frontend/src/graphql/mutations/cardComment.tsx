import {gql} from "@apollo/client";


export const CREATE_CARD_COMMENT = gql`
    mutation CreateCardComment(
        $cardId: String!,
        $comment: String!
    ) {
        createCardComment(
            cardId: $cardId,
            comment: $comment
        ) {
            cardComments {
                id
            }
        }
    }
`


export const DELETE_CARD_COMMENT = gql`
    mutation DeleteCardComment(
        $id: String!
    ) {
        deleteCardComment(
            id: $id
        ) {
            cardComments {
                id
            }
        }
    }
`