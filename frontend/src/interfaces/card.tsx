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

export type CardMutationResponse = {
    createCard: {
        card: {
            id: string;
        }
    }
}