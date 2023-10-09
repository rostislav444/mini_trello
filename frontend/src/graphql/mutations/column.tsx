import {gql} from "@apollo/client";


export const CREATE_COLUMN = gql`
    mutation CreateColumn(
        $dashboardId: String!,
        $title: String!,
        $description: String,
        $order: Int!
    ) {
        createColumn(
            dashboardId: $dashboardId,
            title: $title,
            description: $description,
            order: $order
        ) {
            column {
                id
            }
        }
    }
`


export const UPDATE_COLUMN = gql`
    mutation UpdateColumn(
        $id: String!,
        $title: String!,
        $description: String,
        $order: Int!
    ) {
        updateColumn(
            id: $id,
            title: $title,
            description: $description,
            order: $order
        ) {
            column {
                id
            }
        }
    }
`

export const REORDER_COLUMN = gql`
    mutation ReorderColumn(
        $id: String!,
        $order: Int!
    ) {
        reorderColumn(
            id: $id,
            order: $order
        ) {
            column {
                id
            }
        }
    }
`

export const DELETE_COLUMN = gql`
    mutation DeleteColumn(
        $id: String!
    ) {
        deleteColumn(
            id: $id
        ) {
            column {
                id
            }
        }
    }
`