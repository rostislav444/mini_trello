import {CardState} from "interfaces/card";


export interface ColumnState {
    id: string;
    title: string;
    description?: string;
    cards?: CardState[];
    order: number;
}

export interface ColumnCreateInput {
    dashboardId: string;
    title: string;
    description?: string;
    order: number;
}

export type ColumnCreateMutationResponse = {
    createColumn: {
        column: {
            id: string;
        }
    }
}

export interface ColumnUpdateInput {
    id: string;
    title: string;
    description?: string;
    order: number;
}

export type ColumnUpdateMutationResponse = {
    updateColumn: {
        column: {
            id: string;
        }
    }
}

export interface ColumnReorderInput {
    columnId: string;
    order: number;
}

export type ColumnReorderMutationResponse = {
    reorderColumn: {
        column: {
            id: string;
        }
    }
}

export interface ColumnDeleteInput {
    id: string;
}


export type ColumnDeleteMutationResponse = {
    deleteColumn: {
        column: {
            id: string;
        }
    }
}

