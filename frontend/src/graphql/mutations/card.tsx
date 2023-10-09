import {gql} from "@apollo/client";


export const CREATE_CARD = gql`
    mutation CreateCard(
        $columnId: String!, 
        $title: String!, 
        $description: String, 
        $priority: PriorityEnum!,
        $assignees: [String]
    ) {
        createCard(
            columnId: $columnId, 
            title: $title, 
            description: $description, 
            priority: $priority,
            assignees: $assignees
        ) {
            card {
                id
                columnId
                description
                order
                priority
                status
                title
            }
        }
    }
`

export const UPDATE_CARD = gql`
    mutation UpdateCard(
        $cardId: String!,
        $title: String!,
        $description: String,
        $priority: PriorityEnum!,
        $assignees: [String]
    ) {
        updateCard(
            cardId: $cardId,
            title: $title,
            description: $description,
            priority: $priority,
            assignees: $assignees
        ) {
          card {
                id
                columnId
                description
                order
                priority
                status
                title
            }
        }
    }
`

export const REORDER_CARD = gql`
    mutation ReorderCard(
        $cardId: String!,
        $columnId: String!,
        $order: Int!
    ) {
        reorderCard(
            cardId: $cardId,
            columnId: $columnId,
            order: $order
        ) {
            card {
                id
            }
        }
    }
`

export const DELETE_CARD = gql`
    mutation DeleteCard(
        $id: String!
    ) {
        deleteCard(
            id: $id
        ) {
            card {
                id
            }
        }
    }
`
