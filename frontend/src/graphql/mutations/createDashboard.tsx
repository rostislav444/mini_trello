import {gql} from "@apollo/client";


export const CREATE_DASHBOARD = gql`
    mutation CreateDashboard(
        $title: String!, 
        $description: String,
        $assignees: [String!], 
        $columns: [String!]
    ) {
        createDashboard(
            title: $title, 
            description: $description,
            assignees: $assignees, 
            columns: $columns
        ) {
            dashboard {
                id
            }
        }
    }
`;
