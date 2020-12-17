// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

export const FCTSDashBoard = {
  WRApiV1: '/api/v1/webreports/',
  WFApiV2: '/api/v2/',
  WFApiV1: '/api/v1/',

  WRApiV2: '/output',
  getMenuCountExt: 'CTA_SidebarExtCount',

  getUserOverallData: 'CTA_UserDataDashboard',
  ExternalInbNew: 'CTA_Dash_ExtInbNew',
  ExternalFullSearch: 'CTA_ExtFullSearch',
  DashboardReportMain: 'CTA_DashboardWR',
  BravaURL: 'CTA_DocPreview',
  SearchFilters: 'CTA_SearchFilters',
  SenderInfo: 'CTA_SenderInfoRO',
  RecipientInfo: 'CTA_RecipientInfoRO',
  CCInfo: 'CTA_CCInfoRO',
  CoverSectionInfo: 'CTA_CoverSectionInfoRO',
  AttachmentSectionInfo: 'CTA_AttachSectionInfoRO',
  ExtOrgNameFilter: 'CTA_ExtOrgNameFilter',
  TransferAttributes: 'CTA_TransferAttributes',
  GetTransferFields: 'CTA_GetParticipantInfoByName',
  getcorrespondenceinfoRO: 'CTA_GetCorrInfoRO',
  WfAuditReport: 'CTA_AuditReportWF',
  TransferAuditReport: 'CTA_AuditReportTransfer',
  TransferHistoryTab: 'CTA_TransferTab',
  getMenuCountInt: 'CTA_SidebarIntCount',
  createTransfer: 'CTA_SetTranferUsers',
  GetCorrRecordData: 'CTA_GetCorrRecordData',
  GetCorrFolderName: 'CTA_GetCorrFolderName',
  UserCollaborationRO: 'CTA_UserCollaborationRO',
  WorkflowCommentsList: 'CTA_WFCommentsList',
  CorrConnectionsList: 'CTA_CorrConnectionsList',
  PropertiesURL: 'PropertiesWidget',
  DefaultPageSize: 15,
  SetPerformerPermission: 'CTA_SetPerformPerm',
  SetStatuses: 'CTA_SetStatus',
  OrgChart: '5051964',
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
  UserInfo: '5053143',
  searchFieldautoFill: '5053145',
  CoverFolderContents: '4927936',
  AttachmentFolderContents: '4927940',
  createTempAttachments: '5051962',
  initiateIncomingWF: '5053440',
  GenerateBarcode: '5051519',
  GetCCUserSet: '5076871',
  getMenuCountMR: 'CTA_SidebarMRCount',
  CCRecallReturnToAS: 'FCTS_CCRecall',
  GetUserMailroomPrivelage: '5137421',
  GetApproverList: '5137715',
  GetCoverLettertemplates: '5137613',
  GetColUserSet: '5137516',
  initiateOutgoingWF: '5137609',

  syncDoc: 'syncdoc',
  insertNotes: '528075',
  getNotes: '5422989',
  getWFTaskInfo: '5424038',
  SelectAttributes: '5414023',
  InsertNewComment: '5058946',
  DeleteComment: '5059399',

  setConnection: '5447238',
  getCorrespondenceFormValues: '5447123',
  setSubfolderPerm: 'CTA_SetSubfolderPerm',
  documentTranlsation: '572180',
  copyfromcsurl: '5475815',
  folderbrowserurl: '5475817',

  initiateInternalWF: '5475167',
  ProxyInfo: 'CTA_ProxyUserInfo',
  PerformerInfo: '5469407',
  UserGroups: '5471192',
  AddDelegation: '5475154',
  DelegationsActivator: '5478108',
  CurrentDelegations: '5478128',
  DelegationsInactivator: '5480583',
  DelegationsReport: '5480157',

  CorrespondenceRelated: 'CTA_CorrespondenceRelated',
  DeleteConnection: 'CTA_DeleteConnection',
  DocumentsRelated: 'CTA_DocumentsRelated',
  ConnectionsParentChild: 'CTA_ConnectionsParentChild',
  FilesSerch: 'CTA_FilesSerch',
  InsertConnection: '		CTA_InsertConnection',
  ConnectionsSearch: 'CTA_ConnectionsSearch',
  InsertMultipleConnections: 'CTA_InsertMultipleConnections',
  GetParentData: 'CTA_GetParentData',
  FolderFiles: 'CTA_FolderFiles',
  CorrespondenceRelatedShort: 'CTA_CorrespondenceRelatedShort',
  DownloadAttachmentsBox: 'CTA_DownloadAttachments',
  CopySelectedFiles: 'ExtractAllAttachments',
  SetAttDownloadPermissions: 'CTA_SetAttDownloadPermissions',
  ECMDChart: 'CTA_ECMDChart',
  ECMDSearch: 'CTA_ECDM_Search',
  ExportCorrespondence: 'CTA_ExportCorrespondence',
  FilterValuesSearch: 'CTA_FilterValuesSearch',
  ApproveData: 'CTA_ApproveData',
  MultiAppAutoFill: 'CTA_MultiAppAutoFill',
  SetMultiApprovers: 'CTA_SetMultiApprovers',
  DistributionSection: 'CTA_DistributionSection',
  DistributionsChart: 'CTA_DistributionsChart',
  DistributionsChartEmployees: 'CTA_DistributionsChartEmployees',
  GetDistributionUsers: 'CTA_GetDistributionUsers',
  CloseMe: '%2Fimg%2Fcsui%2Fpages%2Fclose.html',
  GetTeams: 'CTA_GetTeams',

  // Admin page reports

  AdminPageStructure: 'CTA_AdminPageStructure',
  ORGMasterDataRoles: 'CTA_ORGMasterDataRoles',
  ORGMDRoleUsers: 'CTA_ORGMDRoleUsers',
  ORGMDRoleUsersAction: 'CTA_ORGMDRoleUsersAction',
  ORGMDRoleAllUsers: 'CTA_ORGMDRoleAllUsers',
  DepartmentsList: 'CTA_DepartmentsList',
  // GetAllUsers: 'CTA_GetAllUsers',
  ORGMDOrgChart: 'CTA_ORGMDOrgChart',
  ORGMDOrgChartUsers: 'CTA_ORGMDOrgChartUsers',
  ORGMDOrgChartSearch: 'CTA_OrgChartSearch',
  ORGMDUnitDef: 'CTA_ORGMDOrgUnitDefinition',
  ORGMDEntityRelations: 'CTA_ORGMDStrEntityRelations',
  ORGMDEditOrganizationalChart: 'CTA_ORGMDEditOrganizationalChart',
  ObjectInUse: 'CTA_ObjectInUse',
  ORGMDOrgUnitUsers: 'CTA_ORGMDOrgUnitUsers',
  ORGMDOrgUnitUsersActions: 'CTA_ORGMDOrgUnitUsersActions',
  ORGMDOrgUnitAllUsers: 'CTA_ORGMDOrgUnitAllUsers',
  ORGMDOrgChartRoles: 'CTA_ORGMDOrgChartRoles',
  ORGMDOrgChartUserRoles: 'CTA_ORGMDOrgChartUserRoles',
  ORGMDOrgChartRolesAutocmpl: 'CTA_ORGMDOrgChartRolesAutocmpl',
  FCTSSpecificRole: 'CTA_FCTSSpecificRole',
  FCTSSpecificRoleTreeUsers: 'CTA_FCTSSpecificRoleTreeUsers',
  FCTSSpecificRoleUsers: 'CTA_FCTSSpecificRoleUsers',
  FCTSRolesOperations: 'CTA_FCTSRolesOperations',
  FCTSSpecificRoleAllUsers: 'CTA_FCTSSpecificRoleAllUsers',
  FCTSCommonRoles: 'CTA_FCTSCommonRoles',
  FCTSCommonRolesUsers: 'CTA_FCTSCommonRolesUsers',
  FCTSCommonRoleAllUsers: 'CTA_FCTSCommonRoleAllUsers',
  ECMDChartNodes: 'CTA_ECMDChartNodes',
  ECMDChartCounterparts: 'CTA_ECMDChartCounterparts',
  ECDMChartDepartments: 'CTA_ECDMChartDepartments',
  ECDMChartContacts: 'CTA_ECDMChartContacts',
  ECMDNodesSearch: 'CTA_ECMDNodesSearch',
  ECMDSearchCounterparts: 'CTA_ECMDSearchCounterparts',
  ECMDNodesList: 'CTA_ECMDNodesList',
  ECMDEditChart: 'CTA_ECMDEditChart',
  ECMDChartCountries: 'CTA_ECMDChartCountries',
  ECMDChartStates: 'CTA_ECMDChartStates',
  ChartPagination: 200,
  ORGMDOrgUnits: 'CTA_ORGMDOrgUnits',
  ORGMDTeams: 'CTA_ORGMDTeams',
  ORGMDTeamUser: 'CTA_ORGMDTeamUser',
  ORGMDTeamsUserRoles: 'CTA_ORGMDTeamsUserRoles',
  ORGMDTeamActions: 'CTA_ORGMDTeamActions',
  ORGMDCreateGroup: 'CTA_ORGMDCreateGroup',
  ORGMDTeamUsers: 'CTA_ORGMDTeamUsers',
  ORGMDTeamAllUsers: 'CTA_ORGMDTeamAllUsers',
  ORGMDManageTeamUsers: 'CTA_ORGMDManageTeamUsers',
  ORGMDTeamProjects: 'CTA_ORGMDTeamProjects',
  ORGMDTeamEmployeeRoles: 'CTA_ORGMDTeamEmployeeRoles',
  ORGMDDeleteGroup: 'CTA_ORGMDDeleteGroup',
  AdminDelegationUsers: 'CTA_AdminDelegationUsers',
  AdminAddDelegationGroup: 'CTA_AdminAddDelegationGroup',
  AdminSectDelegationsActivator: 'CTA_AdminDelegationsActivator',
  AdminCurrentDelegations: 'CTA_AdminCurrentDelegations',
  AdminSingleDelegationsInactivator: 'CTA_AdminSingleDelegationsInactivator',
  AdminDelegationsReport: 'CTA_AdminDelegationsReport',


  // BaseHref: '/img/fctsangular/fctsapp/',
  BaseHref: '/',
  CSUrlShort: 'mv2cdmsadp02',
  CSUrl: 'http://mv2cdmsadp02/otcs/cs.exe'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
