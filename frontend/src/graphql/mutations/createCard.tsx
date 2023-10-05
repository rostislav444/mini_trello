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