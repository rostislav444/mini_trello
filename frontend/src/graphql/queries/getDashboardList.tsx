import {gql} from "@apollo/client";

export const DASHBOARD_LIST = gql`
    query Dashboard {
        dashboard {
            id
            title
        }
    }
`
