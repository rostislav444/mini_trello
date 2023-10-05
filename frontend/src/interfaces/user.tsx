

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'USER';
}

export interface UserState {
    user?: User | null;
    token: string | null;
}