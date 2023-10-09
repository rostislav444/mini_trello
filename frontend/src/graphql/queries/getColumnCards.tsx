import {gql} from '@apollo/client';


export const COLUMN_CARDS_LIST = gql`
    query Cards($columnId: String!) {
        cards(columnId: $columnId) {
            id
            columnId
            description
            order
            priority
            status
            title
        }
    }
`

export const COLUMN_CARD = gql`
    query Card($cardId: String!) {
        card(cardId: $cardId) {
            id
            columnId
            description
            order
            priority
            status
            title
            assignees {
                id
                firstName
                lastName
            },
            comments {
                id
                cardId
                comment
                createdAt
                user {
                    id
                    firstName
                    lastName
                }
            }
        }
    }
`
