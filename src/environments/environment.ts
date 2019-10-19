// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

export const FCTSDashBoard = {
  WRApiV1: "/api/v1/webreports/",
  WFApiV2: '/api/v2/',
  WFApiV1: '/api/v1/',
  //WRApiV1: "/api/v1/nodes/",
  WRApiV2: "/output",
  getMenuCountExt: "CTASidebarExtCount",
  getDashboardInbox: "35872",
  getUserOverallData: "CTAUserDataDashboard",
  ExternalInbNew: "CTA_Dash_ExtInbNew",
  ExternalFullSearch: "CTA_ExtFullSearch",
  DashboardReportMain: "CTA_DashboardWR",
  BravaURL: '376807',
  SearchFilters: '383838',
  SenderInfo: '391722',
  RecipientInfo: '390954',
  CCInfo: '391933',
  CoverSectionInfo: '393473',
  AttachmentSectionInfo: '397754',
  ExtOrgNameFilter: '405784',
  TransferAttributes: '427889',
  GetTransferFields: '428450',
  getcorrespondenceinfoRO: '433598',
  WfAuditReport: '433600',
  TransferAuditReport: '433725',
  TransferHistoryTab: '435369',
  getMenuCountInt: 'CTASidebarIntCount',
  createTransfer: '446170',
  GetCorrRecordData: '456633',
  GetCorrFolderName: '456186',
  UserCollaborationRO: '452121',
  WorkflowCommentsList: '456415',
  CorrConnectionsList: '456666',
  PropertiesURL: 'PropertiesWidget',
  DefaultPageSize: 10,
  SetPerformerPermission: 'CTA_SetPerformPerm', /* added PSM: 22/06/2019 */
  SetStatuses: 'CTA_SetStatus', //added 01/07/2019,
  OrgChart: '485970',
  /* added last time*/
  CheckWFRecall: 'FCTS_CheckWFRecall',
  GetTransferUsers: 'CTA_GetTransferUsers',
  GetTransRecallData: 'FCTS_GetTransRecallData',
  RunTransferRecall: 'FCTS_RunTransRecall',
  RunWFRecall: 'FCTS_RunWFRecall',
  SendRecallEmail: 'FCTS_SendRecallEmail',
  SetDipsAudit: 'FCTS_SetDipsAudit',
  SetStatusMultiApprove: 'FCTS_SetStatusMultiApprove',
  SetTransStatus: 'FCTS_UpdTransStatus',
  GetGlobalConst: 'CTA_ConstantsObject',
  UserInfo: '491405',
  searchFieldautoFill: '492166',
  CoverFolderContents: '393480',
  AttachmentFolderContents: '398964',
  createTempAttachments: '492171',
  initiateIncomingWF: '496142',

  GenerateBarcode: '496732',
  GetCCUserSet: '497454',

  getMenuCountMR: 'CTA_SidebarMRCount',
  CCRecallReturnToAS: 'FCTS_CCRecall',

  GetUserMailroomPrivelage: '503438',
  GetApproverList: '508354',
  GetCoverLettertemplates: '510471',
  GetColUserSet: '511783',
  initiateOutgoingWF: '512156',
  syncDoc: 'syncdoc',
  insertNotes: '528075',
  getNotes: '532017',
  getWFTaskInfo: '529976',
  //BaseHref: '/img/fctsangular/fctsapp/',
  SelectAttributes: '531053',
  InsertNewComment: '532040',
  DeleteComment: '543890',
  setConnection: '544339',
  getCorrespondenceFormValues: '543928',
  setSubfolderPerm: 'CTA_SetSubfolderPerm',
  documentTranlsation: '572180',
  
  initiateInternalWF: '560064',
  ProxyInfo: 'CTA_ProxyUserInfo',
  // BaseHref: '/img/fctsangular/fctsapp/',
  BaseHref: '/',
  CSUrl: 'http://manotcst02.mannaicorp.com.qa/otcs/cs.exe'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
