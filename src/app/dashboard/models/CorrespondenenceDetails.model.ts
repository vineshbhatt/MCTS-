export class CorrespondenenceDetailsModel {
  CorrFolderName: string;
  AttachID: string;
  AttachCorrID: string;
  AttachCorrCoverID: string;
  AttachCorrAttachmentsID: string;
  VolumeID: string;
  SubWorkID: string;
  AttachCorrMiscID: string;
  countconnections: string;
  SubWork_Status: string;
  ID: string;
  UserID: string;
  TransferUserID: string;
  Status: string;
  CCstatus: string;
  holdSecretaryID: string;
  TransferType: string;
  isCC: string;
  perform07: string;
  WasOpened: string;
  AttachementsDocCount: string;

}

export class OrgNameAutoFillModel {


  OrgID: string;
  OrgName_En: string;
  OrgName_Ar: string;
  Val_En: string;
  Val_Ar: string;
  DepID: number;
  DepName_En: string;
  DepName_AR: string;
  SecID: number;
  SecName_En: string;
  SecName_Ar: string;
  RoleID: number;
  RoleName_En: string;
  RoleName_Ar: string;
  NameID: number;
  NameLogin: string;
  Name_En: string;
  Name_Ar: string;
  Type: number;
  RecipientUserID: number;
  RecipientVersion: number;
  FaxNumber: string;
  _SOURCEROWNUM: number;
  _ORIGROWNUM: number;


}

export class CorrespondenceFolderModel {
  AttachCorrID: number;
  AttachCorrCoverID: number;
  AttachCorrAttachmentsID: number;
  AttachCorrMiscID: number;
}

export class CCUserSetModel {
  OrderNum: string;
  SubSeq: string;
  CCUserID: string;
  CCVersion: string;
  CCPurpose: string;
  CCNotes: string;
  OrganizationName_EN: string;
  OrganizationName_AR: string;
  DepartmentName_EN: string;
  DepartmentName_AR: string;
  Role_EN: string;
  Role_AR: string;
  Name_EN: string;
  Name_AR: string;
}


export class ColUserSetModel {
  VolumeID: string;
  OrderNum: string;
  SubSeq: string;
  UserColl_User: string;
  UserColl_Type: string;
  UserColl_Purpose: string;
  UserColl_Priority: string;
  UserColl_DueDate: string;
  UserColl_Notes: string;
  UserColl_FurtherAction: string;
  UserColl_Status: string;
  UserColl_Disposition: string;
  Name_EN: string;
  Name_AR: string;
  DepartmentName_EN: string;
  DepartmentName_AR: string;
  FurtherActions_EN: string;
  FurtherActions_AR: string;
  Purpose_EN: string;
  Purpose_AR: string;
  AttrSuffix: string;
  SubWorkTask_SubWorkID: string;
  SubWorkTask_TaskID: string;
  SubWorkTask_Title: string;
  SubWorkTask_Type: string;
  SubWorkTask_Status: string;
  SubWorkTask_Active: string;
  Status_EN: string;
  Status_AR: string;
}
