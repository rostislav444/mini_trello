import {gql} from "@apollo/client";

export const USERS_LIST = gql`
    query Users {
        users {
            id
            email
            firstName
            lastName
            role
        }
    }
`