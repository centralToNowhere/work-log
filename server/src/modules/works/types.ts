export type GetWorksSortOrder = {
    byDate: 'asc' | 'desc',
}
export type GetWorksFilter = {
    byDate?: string
}

export type WorkDTO = {
    id?: number;
    title: string;
    description?: string | null;
    amount: number;
    measureUnit: string;
    workerId: number;
    workerFullName: string;
    created_at?: Date;
};

export type DeleteWorkResponse = {

}

export type GetWorksQuery = {
    dateSort?: GetWorksSortOrder['byDate'];
    date?: string;
}

export type CreateWorkRequestParams = {
    title: string;
    description?: string | null;
    amount: number;
    measureUnit: string;
    workerId: number;
    createdAt?: string;
}

export type DeleteWorkRequestParams = {
    id: string
}
