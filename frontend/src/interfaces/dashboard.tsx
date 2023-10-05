import {CardState} from "interfaces/card";


export interface ColumnState {
    id: string;
    title: string;
    description?: string;
    cards?: CardState[];
}


export interface DashboardState {
    id: string;
    title: string;
    description?: string;
    columns?: ColumnState[];
    assignees?: {
        id: string;
        firstName: string;
        email?: string;
    }[]
}


export interface DashboardLite {
    id: string;
    title: string;
    selected?: boolean;
}