import {ColumnState} from "interfaces/column";


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