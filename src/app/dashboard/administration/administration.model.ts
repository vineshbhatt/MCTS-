export interface RolesData {
    Description_AR: string;
    Description_EN: string;
    Grid: string;
    Name_AR: string;
    Name_EN: string;
}

/* export interface ServiceMethods {
    userActions: string;
} */

export interface DepFilterData {
    Name_AR: string;
    Name_EN: string;
    OUID: string;
}

export interface UsersData {
    DepartmentID: string;
    DepartmentName_AR: string;
    DepartmentName_EN: string;
    EID: string;
    FirstName_AR: string;
    FirstName_EN: string;
    ID: string;
    LastName_AR: string;
    LastName_EN: string;
    NameLogin: string;
    RowNum?: string;
    totalRowCount?: number;
    Email?: string;
}

export interface PaginationParameters {
    perPage: number;
    startRow: number;
    endRow: number;
    page: number;
}

export interface BreadCrumbsModel {
    name: string;
    path: string;
    section: string;
}

export interface СontentModel {
    description: NameModel;
    level: number;
    name: NameModel;
    route?: string;
    children?: СontentModel[];
}

export interface NameModel {
    en: string;
    ar: string;
}

export enum DialogDirection {
    rtl = 'rtl',
    ltr = 'ltr'
}

