import React, {createContext, ReactNode, useContext} from 'react';
import {MutationFunction, QueryResult, useMutation, useQuery} from '@apollo/client';
import {USERS_LIST} from 'graphql/queries/getUsers';
import {DASHBOARD_LIST} from 'graphql/queries/getDashboardList';
import {CREATE_DASHBOARD} from 'graphql/mutations/createDashboard';
import {DashboardLite} from "interfaces/dashboard";
import {User} from "interfaces/user";
import {CREATE_CARD, UPDATE_CARD, REORDER_CARD, DELETE_CARD} from "graphql/mutations/card";
import {
    CardCreateInput,
    CardCreateMutationResponse,
    CardUpdateMutationResponse,
    CardUpdateInput,
    CardReorderMutationResponse,
    CardReorderInput,
    CardDeleteInput, CardDeleteMutationResponse
} from "interfaces/card";
import {
    ColumnCreateInput,
    ColumnCreateMutationResponse, ColumnDeleteInput, ColumnDeleteMutationResponse,
    ColumnReorderInput,
    ColumnReorderMutationResponse,
    ColumnUpdateInput,
    ColumnUpdateMutationResponse
} from "interfaces/column";
import {CREATE_COLUMN, DELETE_COLUMN, REORDER_COLUMN, UPDATE_COLUMN} from "graphql/mutations/column";
import {CreateCardCommentInput, CreateCardCommentResponse, DeleteCardCommentInput, DeleteCardCommentResponse} from "interfaces/cardCommets";
import {CREATE_CARD_COMMENT, DELETE_CARD_COMMENT} from "graphql/mutations/cardComment";

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

// DeleteCardCommentInput
// DeleteCardCommentResponse
// DELETE_CARD_COMMENT

interface GraphQLContextType {
    // User
    usersListQuery: QueryResult<UsersListData>;
    // Dashboard
    dashboardListQuery: QueryResult<DashboardListData>;
    dashboardCreateMutation: MutationFunction<CreateDashboardResponse, CreateDashboardInput>;
    // Column
    createColumnMutation: MutationFunction<ColumnCreateMutationResponse, ColumnCreateInput>;
    updateColumnMutation: MutationFunction<ColumnUpdateMutationResponse, ColumnUpdateInput>;
    reorderColumnMutation: MutationFunction<ColumnReorderMutationResponse, ColumnReorderInput>;
    deleteColumnMutation: MutationFunction<ColumnDeleteMutationResponse, ColumnDeleteInput>;
    // Card
    createCardMutation: MutationFunction<CardCreateMutationResponse, CardCreateInput>;
    updateCardMutation: MutationFunction<CardUpdateMutationResponse, CardUpdateInput>;
    reorderCardMutation: MutationFunction<CardReorderMutationResponse, CardReorderInput>;
    deleteCardMutation: MutationFunction<CardDeleteMutationResponse, CardDeleteInput>;
    // CardComment
    createCardCommentMutation: MutationFunction<CreateCardCommentResponse, CreateCardCommentInput>;
    deleteCardCommentMutation: MutationFunction<DeleteCardCommentResponse, DeleteCardCommentInput>;
}

const GraphQLContext = createContext<GraphQLContextType | undefined>(undefined);

interface GraphQLProviderProps {
    children: ReactNode;
}

export const GraphQLProvider: React.FC<GraphQLProviderProps> = ({children}) => {
    // User
    const usersListQuery = useQuery(USERS_LIST);
    // Dashboard
    const dashboardListQuery = useQuery(DASHBOARD_LIST);
    const [dashboardCreateMutation] = useMutation<CreateDashboardResponse, CreateDashboardInput>(CREATE_DASHBOARD);
    // Column
    const [createColumnMutation] = useMutation<ColumnCreateMutationResponse, ColumnCreateInput>(CREATE_COLUMN);
    const [updateColumnMutation] = useMutation<ColumnUpdateMutationResponse, ColumnUpdateInput>(UPDATE_COLUMN);
    const [reorderColumnMutation] = useMutation<ColumnReorderMutationResponse, ColumnReorderInput>(REORDER_COLUMN);
    const [deleteColumnMutation] = useMutation<ColumnDeleteMutationResponse, ColumnDeleteInput>(DELETE_COLUMN);
    // Card
    const [createCardMutation] = useMutation<CardCreateMutationResponse, CardCreateInput>(CREATE_CARD);
    const [updateCardMutation] = useMutation<CardUpdateMutationResponse, CardUpdateInput>(UPDATE_CARD);
    const [reorderCardMutation] = useMutation<CardReorderMutationResponse, CardReorderInput>(REORDER_CARD);
    const [deleteCardMutation] = useMutation<CardDeleteMutationResponse, CardDeleteInput>(DELETE_CARD);
    // CardComment
    const [createCardCommentMutation] = useMutation<CreateCardCommentResponse, CreateCardCommentInput>(CREATE_CARD_COMMENT);
    const [deleteCardCommentMutation] = useMutation<DeleteCardCommentResponse, DeleteCardCommentInput>(DELETE_CARD_COMMENT);



    return (
        <GraphQLContext.Provider value={{
            // User
            usersListQuery,
            // Dashboard
            dashboardListQuery,
            dashboardCreateMutation,
            // Column
            createColumnMutation,
            updateColumnMutation,
            reorderColumnMutation,
            deleteColumnMutation,
            // Card
            createCardMutation,
            updateCardMutation,
            reorderCardMutation,
            deleteCardMutation,
            // CardComment
            createCardCommentMutation,
            deleteCardCommentMutation
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
