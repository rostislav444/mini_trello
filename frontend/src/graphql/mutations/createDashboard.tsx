import {gql} from "@apollo/client";


export const CREATE_DASHBOARD = gql`
    mutation CreateDashboard($title: String!, $assignees: [String!], $columns: [String!]) {
        createDashboard(title: $title, assignees: $assignees, columns: $columns) {
            dashboard {
                id
            }
        }
    }
`;
