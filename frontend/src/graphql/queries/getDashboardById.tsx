import {gql} from "@apollo/client";

export const DASHBOARD_BY_ID = gql`
    query Dashboard($dashboardId: String!) {
        dashboard(dashboardId: $dashboardId) {
            description
            title
            assignees {
                id
                firstName
                email
            }
            columns {
                id
                title
                order
                cards {
                    id
                    title
                    order
                    priority
                }
            }
            id
        }
    }
`