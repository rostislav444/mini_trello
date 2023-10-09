import {CardCommentState} from "interfaces/cardCommets";

export interface CardState {
    id: string;
    columnId: string;
    title: string;
    description?: string;
    order?: number;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: string;
    assignees?: {
        id: string;
        firstName: string;
    }[];
    comments?: CardCommentState[];
}

export interface CardCreateInput {
    columnId: string;
    title: string;
    description?: string;
    priority: string;
    assignees?: string[];
}

export interface CardUpdateInput {
    cardId: string;
    title?: string;
    description?: string;
    priority?: string;
    assignees?: string[];
}

export interface CardReorderInput {
    cardId: string;
    columnId: string
    order: number;
}

export type CardCreateMutationResponse = {
    createCard: {
        card: {
            id: string;
        }
    }
}

export type CardUpdateMutationResponse = {
    updateCard: {
        card: {
            id: string;
        }
    }
}

export type CardReorderMutationResponse = {
    reorderCard: {
        card: {
            id: string;
        }
    }
}

export interface CardDeleteInput {
    id: string;
}

export type CardDeleteMutationResponse = {
    deleteCard: {
        card: {
            id: string;
        }
    }
}