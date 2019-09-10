export class CorrResponse {
    actualRows: string;
    filteredRows: string;
    myRows: any;
    sourceID: string;
    totalRows: string;
    totalSourceRows: string;
  }


export class CorrespondenceFormData {
  action: string;
  values: any;
}

export class SenderDetailsData {
  DepartmentName_AR: string;
  DepartmentName_EN: string;
  ExternalOrganization: number;
  Fax: string;
  Name_AR: string;
  Name_EN: string;
  OrganizationName_AR: string;
  OrganizationName_EN: string;
  PersonalNameReq: number;
  Role_AR: string;
  Role_EN: string;
  SenderDepartment: string;
  SenderID: number;
  SenderName: string;
  SenderRole: string;
  SenderSection: string;
  SenderUserID: number;
  SenderVersion: string;
}

export class RecipientDetailsData {
  DepartmentName_AR: string;
  DepartmentName_EN: string;
  Level: string;
  Name_AR: string;
  Name_EN: string;
  OrganizationName_AR: string;
  OrganizationName_EN: string;
  RecipientDepartment: number;
  RecipientID: number;
  RecipientRole: number;
  RecipientSection: number;
  RecipientType: string;
  RecipientUserID: number;
  RecipientVersion: number;
  Role_AR: string;
  Role_EN: string;
  SectionName_AR: string;
  SectionName_EN: string;
}
