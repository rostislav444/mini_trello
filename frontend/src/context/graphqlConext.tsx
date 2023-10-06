import React, {createContext, ReactNode, useContext} from 'react';
import {MutationFunction, QueryResult, useMutation, useQuery} from '@apollo/client';
import {USERS_LIST} from 'graphql/queries/getUsers';
import {DASHBOARD_LIST} from 'graphql/queries/getDashboardList';
import {CREATE_DASHBOARD} from 'graphql/mutations/createDashboard';
import {DashboardLite} from "interfaces/dashboard";
import {User} from "interfaces/user";
import {CREATE_CARD, UPDATE_CARD, REORDER_CARD} from "graphql/mutations/card";
import {CardCreateInput, CardCreateMutationResponse, CardUpdateMutationResponse, CardUpdateInput, CardReorderMutationResponse, CardReorderInput} from "interfaces/card";

type UsersListData = {
    users: User[];
}
type DashboardListData = {
    dashboard: DashboardLite[];
}
type CreateDashboardInput = {
    title: string;
    description?: string;
    assignees?: string[];
    columns?: string[];
}
type CreateDashboardResponse = {
    createDashboard: {
        dashboard: {
            id: string;
        };
    };
};



interface GraphQLContextType {
    usersListQuery: QueryResult<UsersListData>;
    dashboardListQuery: QueryResult<DashboardListData>;
    dashboardCreateMutation: MutationFunction<CreateDashboardResponse, CreateDashboardInput>;
    createCardMutation: MutationFunction<CardCreateMutationResponse, CardCreateInput>;
    updateCardMutation: MutationFunction<CardUpdateMutationResponse, CardUpdateInput>;
    reorderCardMutation: MutationFunction<CardReorderMutationResponse, CardReorderInput>;
}

const GraphQLContext = createContext<GraphQLContextType | undefined>(undefined);

interface GraphQLProviderProps {
    children: ReactNode;
}


export const GraphQLProvider: React.FC<GraphQLProviderProps> = ({children}) => {
    const usersListQuery = useQuery(USERS_LIST);
    const dashboardListQuery = useQuery(DASHBOARD_LIST);
    const [dashboardCreateMutation] = useMutation<CreateDashboardResponse, CreateDashboardInput>(CREATE_DASHBOARD);
    const [createCardMutation] = useMutation<CardCreateMutationResponse, CardCreateInput>(CREATE_CARD);
    const [updateCardMutation] = useMutation<CardUpdateMutationResponse, CardUpdateInput>(UPDATE_CARD);
    const [reorderCardMutation] = useMutation<CardReorderMutationResponse, CardReorderInput>(REORDER_CARD);

    return (
        <GraphQLContext.Provider value={{
            usersListQuery,
            dashboardListQuery,
            dashboardCreateMutation,
            createCardMutation,
            updateCardMutation,
            reorderCardMutation
        }}>
            {children}
        </GraphQLContext.Provider>
    );
};

export const useGraphQL = (): GraphQLContextType => {
    const context = useContext(GraphQLContext);
    if (!context) {
        throw new Error("useGraphQL must be used within a GraphQLProvider");
    }
    return context;
};
