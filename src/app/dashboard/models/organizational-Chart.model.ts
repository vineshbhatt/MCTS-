export class organizationalChartModel {
  Name: string;
  OUID: number;
  Parent: number;
  Name_AR: string;
  LTID: number;
  OUTID: number;
  Code: number;
  employees_status: string;
  children?: organizationalChartModel[];
  static OUID: any;
}

export class organizationalChartEmployeeModel {
  OUID: number;
  EID: number;
  Coev_Code: string;
  EName: string;
  Coev_LastName: string;
  Coev_Firstname: string;
  EName_AR: string;
  Coev_LastName_AR: string;
  Coev_FirstName_AR: string;
  RoleName: string;
  RoleName_AR: string;
  KuafID: number;
}