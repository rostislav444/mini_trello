import {User} from "interfaces/user";

export interface CardCommentState {
    id: string;
    comment: string;
    user: User
    createdAt: string;
}

export interface CreateCardCommentInput {
    comment: string;
    cardId: string;
}

export interface CreateCardCommentResponse {
    createCardComment: {
        id: string;
    }
}

export interface DeleteCardCommentInput {
    id: string;
}

export interface DeleteCardCommentResponse {
    deleteCardComment: {
        id: string;
    }
}