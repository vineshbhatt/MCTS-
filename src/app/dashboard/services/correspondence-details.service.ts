import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CorrResponse } from './correspondence-response.model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { FCTSDashBoard } from '../../../environments/environment';
import { DocumentPreview } from '../services/documentpreview.model';
import { DashboardFilterResponse, TransferAttributes } from '../models/DashboardFilter';
import {
  CorrespondenenceDetailsModel, OrgNameAutoFillModel, CorrespondenceFolderModel, CCUserSetModel,
  ColUserSetModel, SyncDocumentMetadataModel
} from '../models/CorrespondenenceDetails.model';
import { StatusRequest, SetStatusRow } from '../models/Shared.model';
import { CorrespondenceShareService } from '../services/correspondence-share.service';
import { map, catchError } from 'rxjs/operators'; /* added 24/06/2019 */
import { EMPTY } from 'rxjs';
import { CorrespondenceWFFormModel } from '../models/CorrepondenceWFFormModel';
import { AppLoadConstService } from 'src/app/app-load-const.service';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})

export class CorrespondenceDetailsService {
  private _globalConstants = this.appLoadConstService.getConstants();
  private CSUrl: string = CSConfig.CSUrl;

  constructor(
    private httpServices: HttpClient,
    private _correspondenceShareService: CorrespondenceShareService,
    public appLoadConstService: AppLoadConstService
  ) { }

  getCorrespondenceRecipientDetails(SubWorkID, CorrFlowType): Observable<CorrResponse[]> {
    const params = new HttpParams()
      .set('SubWorkID', SubWorkID)
      .set('CorrFlowType', CorrFlowType)
      .set('qLive', 'false')
      .set('prompting', 'done');
    return this.httpServices.get<CorrResponse[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.RecipientInfo
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    ).pipe(
      map(data => {
        return data;
      }),
      catchError(error => {
        console.log('correspondence ERROR => ' + error.message || 'some error with correspondence');
        return throwError(error);
      })
    );
  }

  getCorrespondenceSenderDetails(SubWorkID, CorrFlowType, qLive, UserID = ''): Observable<CorrResponse[]> {
    const params = new HttpParams()
      .set('SubWorkID', SubWorkID)
      .set('CorrFlowType', CorrFlowType)
      .set('qLive', qLive)
      .set('prompting', 'done')
      .set('UserID', UserID);
    return this.httpServices.get<CorrResponse[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.SenderInfo
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    ).pipe(
      map(data => {
        return data;
      }),
      catchError(error => {
        console.log('correspondence ERROR => ' + error.message || 'some error with correspondence');
        return throwError(error);
      })
    );
  }

  getCorrespondenceCCDetail(SubWorkID, CorrFlowType): Observable<CorrResponse[]> {
    const params = new HttpParams()
      .set('SubWorkID', SubWorkID)
      .set('CorrFlowType', CorrFlowType)
      .set('qLive', 'false')
      .set('prompting', 'done');
    return this.httpServices.get<CorrResponse[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.CCInfo
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getCorrespondenceCoverDetail(SubWorkID): Observable<CorrResponse[]> {
    const params = new HttpParams()
      .set('SubWorkID', SubWorkID)
      .set('qLive', 'false')
      .set('prompting', 'done');
    return this.httpServices.get<CorrResponse[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.CoverSectionInfo
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getDocumentURL(coverdocumentid): Observable<DocumentPreview[]> {
    const params = new HttpParams().set('coverdocumentid', coverdocumentid);
    return this.httpServices.get<DocumentPreview[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.BravaURL}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken },
        params: params
      }
    );
  }

  getCorrespondenceAttachmentsDetail(SubWorkID, CorrFlowType): Observable<CorrResponse[]> {
    const params = new HttpParams()
      .set('SubWorkID', SubWorkID)
      .set('CorrFlowType', CorrFlowType)
      .set('qLive', 'false')
      .set('prompting', 'done');
    return this.httpServices.get<CorrResponse[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.AttachmentSectionInfo
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getTransferPurposeAndPriority(): Observable<TransferAttributes> {
    return this.httpServices.get<TransferAttributes>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.TransferAttributes
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }
      }
    );
  }

  searchTransferFieldName(name, Type) {
    if (name.length >= 3) {
      let requestType;
      if (Type === 'EMP') {
        requestType = 'IntName';
      } else {
        requestType = 'IntDepartment';
      }
      const params = new HttpParams().set(requestType, 'true')
        .set('NameVal', name + '%');
      /*       if (name.length >= 3) { */
      return this.httpServices.get<DashboardFilterResponse[]>(this.CSUrl +
        `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.GetTransferFields}?Format=webreport`,
        {
          headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
        });
      /*       } */
    } return EMPTY;
  }

  getCorrespondenceMetadataDetail(SubWorkID, CorrFlowType): Observable<CorrResponse[]> {
    const params = new HttpParams()
      .set('volumeId', SubWorkID)
      .set('CorrFlowType', CorrFlowType);
    return this.httpServices.get<CorrResponse[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.getcorrespondenceinfoRO
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getTransferHistoryTab(volumeID): Observable<CorrResponse[]> {
    const params = new HttpParams()
      .set('volumeID', volumeID);
    return this.httpServices.get<CorrResponse[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.TransferHistoryTab
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getCorrRecord(locationid, transid, onbehalfuserid): Observable<any> {
    const params = new HttpParams()
      .set('FolderID', locationid)
      .set('transID', transid)
      .set('onBehalfUserID', onbehalfuserid);
    return this.httpServices.get<CorrespondenenceDetailsModel[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.GetCorrRecordData
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    )
      .pipe(
        map(data => {
          let corrFlowType: string;
          switch (data[0].CorrespondenceFlowType) {
            case '1':
              corrFlowType = 'Incoming';
              break;
            case '5':
              corrFlowType = 'Outgoing';
              break;
            case '7':
              corrFlowType = 'Internal';
              break;
          }
          data[0].CorrFlowType = corrFlowType;
          return data;
        }),
        catchError(error => {
          return error;
        })
      );

  }

  getCorrespondenceFolderName(volumeID): Observable<any> {
    const params = new HttpParams()
      .set('volumeID', volumeID);
    return this.httpServices.get(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.GetCorrFolderName
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getCorrespondenceCollaborationInfoRO(SubWorkID, CorrFlowType): Observable<CorrResponse[]> {

    const params = new HttpParams()
      .set('SubWorkID', SubWorkID)
      .set('CorrFlowType', CorrFlowType)
      .set('ReadOnly', 'Yes')
      .set('qLive', 'false');
    return this.httpServices.get<CorrResponse[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.UserCollaborationRO
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getCommentsData(volumeID): Observable<CorrResponse[]> {
    const params = new HttpParams()
      .set('ReferenceID', volumeID);
    return this.httpServices.get<CorrResponse[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.WorkflowCommentsList
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getCorrConnectionsData(locationid): Observable<CorrResponse[]> {
    const params = new HttpParams()
      .set('ReferenceID', locationid);
    return this.httpServices.get<CorrResponse[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.CorrConnectionsList
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getDocumentPropertiesURL(docid): Observable<DocumentPreview[]> {
    const params = new HttpParams().set('docid', docid);
    return this.httpServices.get<DocumentPreview[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.PropertiesURL}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken },
        params: params
      }
    );
  }

  /* Changed PSM: 04/10/2019 */
  createTransferRequest(transferJson, correspondenceData: CorrespondenenceDetailsModel): Observable<any> {
    let taskID: string;
    correspondenceData.CorrespondenceFlowType === '1' ? taskID = '32' : taskID = '3'; // for permission purpose
    const transferVal = JSON.stringify({ transferJson });
    const params = new HttpParams()
      .set('transferJson', transferVal)
      .set('volumeid', correspondenceData.VolumeID)
      .set('taskid', taskID)
      .set('CorrFlowType', correspondenceData.CorrFlowType)
      .set('locationid', correspondenceData.AttachCorrID)
      .set('parentID', correspondenceData.ID)
      .set('rows_count', transferJson.length)
      .set('onBehalfUserID', this._globalConstants.general.ProxyUserID);

    return this.httpServices
      .get<any>(this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.createTransfer}?Format=webreport`,
        { headers: { OTCSTICKET: CSConfig.AuthToken }, params: params }
      )

      .pipe(
        map(data => {
          this.prepSetTransferStatus(data, correspondenceData, 1, '');
          return data;
        }),
        catchError(error => {
          console.log('transfer ERROR => ' + error.message || 'some error with transfer');
          return error;
        })
      );
  }

  prepSetTransferStatus(transfered: any, correspondenceData: CorrespondenenceDetailsModel, status: Number, NotesComplete: string): void {
    /* build object to set Status
    taskstatus -> status
      dataid -> correspondenceData.AttachCorrID
      transid -> correspondenceData.ID
      currentStatus -> correspondenceData.Status
      dataid -> correspondenceData.AttachCorrID
      subworkid -> AttachCorrID.SubWorkID
      isCC -> AttachCorrID.isCC
      NotesComplete -> ''
    */
    const rowsArray: SetStatusRow[] = [];
    const statusRow: SetStatusRow = new SetStatusRow;
    const setStatusRequest: StatusRequest = new StatusRequest;
    setStatusRequest.status = status.toString();
    statusRow.subworkid = correspondenceData.SubWorkID.toString();
    statusRow.dataid = correspondenceData.AttachCorrID.toString();
    statusRow.isCC = correspondenceData.isCC.toString();
    statusRow.transID = correspondenceData.ID.toString();
    statusRow.NotesComplete = NotesComplete;
    statusRow.currentStatus = correspondenceData.Status.toString();
    statusRow.userid = this._globalConstants.general.ProxyUserID.toString();
    rowsArray.push(statusRow);
    setStatusRequest.SetStatusRow = rowsArray;
    this._correspondenceShareService.setTransferToStatus(setStatusRequest).subscribe();
  }

  GetUserInformation(): Observable<CorrResponse[]> {
    return this.httpServices.get<CorrResponse[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.UserInfo}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }
      }
    );
  }

  searchFieldForAutoFill(searchText: string, searchField: string, ParentVal: any): Observable<OrgNameAutoFillModel[]> {
    // let searchResults: Observable<OrgNameAutoFillModel[]>;
    if (searchText.length >= 3) {
      const params = new HttpParams()
        .set('NameVal', '%' + searchText + '%')
        .set(searchField, 'true');
      return this.httpServices.get<OrgNameAutoFillModel[]>(
        this.CSUrl +
        `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.searchFieldautoFill}?Format=webreport`,
        {
          headers: { OTCSTICKET: CSConfig.AuthToken },
          params: params
        }
      );

    }
    return EMPTY;
  }

  searchFieldForAutoFillOUID(orgID: string, searchField: string, parentOUID: string): Observable<OrgNameAutoFillModel[]> {
    // let searchResults: Observable<OrgNameAutoFillModel[]>;
    const params = new HttpParams()
      .set('OrgID', orgID)
      .set(searchField, 'true');
    return this.httpServices.get<OrgNameAutoFillModel[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.searchFieldautoFill}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken },
        params: params
      }
    );
  }

  getCoverFolderDetails(FolderID: number): Observable<CorrResponse[]> {
    const params = new HttpParams()
      .set('FolderID', '' + FolderID)
      .set('prompting', 'done');
    return this.httpServices.get<CorrResponse[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.CoverFolderContents
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getAttachmentFolderDetails(FolderID: number): Observable<CorrResponse[]> {
    const params = new HttpParams()
      .set('FolderID', '' + FolderID)
      .set('prompting', 'done');
    return this.httpServices.get<CorrResponse[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.AttachmentFolderContents
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  createTempAttachments(CorrFlowType: string): Observable<CorrespondenceFolderModel> {
    const params = new HttpParams()
      .set('CorrFlowType', CorrFlowType);
    return this.httpServices.get<CorrespondenceFolderModel>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.createTempAttachments
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getCorredpondenceBarcode(corrAttachID: number, CorrFlowType: string, CorrespondenceYear: number): Observable<any> {
    const params = new HttpParams()
      .set('CorrFlowType', CorrFlowType)
      .set('CorrespondenceYear', '' + CorrespondenceYear)
      .set('AttachID', '' + corrAttachID);
    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.GenerateBarcode
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getCCUserDetailsSet(OUIds: string, EmpIDs: string, corrFlowType: string): Observable<CCUserSetModel[]> {
    const params = new HttpParams()
      .set('OUIDs', OUIds)
      .set('qLive', 'true')
      .set('CorrFlowType', corrFlowType)
      .set('UserIDs', '')
      .set('EIDs', EmpIDs);

    return this.httpServices.get<CCUserSetModel[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.GetCCUserSet
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  /*****************************correspondence form-step-functions**************************************** */

  getFormStepInfo(WorkID: string, SubWorkID: string, TaskID: string): Observable<any> {
    const params = new HttpParams()
      .set('process_id', WorkID)
      .set('subprocess_id', SubWorkID)
      .set('task_id', TaskID);
    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WFApiV1}forms/processes/tasks/update?`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    ).pipe(
      map(data => {
        return data;
      }),
      catchError(error => {
        console.log('correspondence ERROR => ' + error.message || 'some error with correspondence');
        return throwError(error);
      })
    );
  }

  submitCorrespondenceInfo(WorkID: string, TaskID: string, data: any): Observable<any> {
    const url = this.CSUrl + `${FCTSDashBoard.WFApiV2}processes/${WorkID}/subprocesses/${WorkID}/tasks/${TaskID}`;
    const body = new HttpParams()
      .set('body', JSON.stringify(data));
    return this.httpServices.put<any>(url, body, {
      headers: new HttpHeaders()
        .set('OTCSTICKET', CSConfig.AuthToken)
        .set('Content-Type', 'application/x-www-form-urlencoded')
    }).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        console.log('correspondence ERROR => ' + error.message || 'some error with correspondence');
        return throwError(error);
      })
    );
  }

  sendOnCorrespondence(WorkID: string, TaskID: string) {
    const url = this.CSUrl + `${FCTSDashBoard.WFApiV2}processes/${WorkID}/subprocesses/${WorkID}/tasks/${TaskID}?action=SendOn`;
    const body = new HttpParams();
    return this.httpServices.put<any>(url, body, {
      headers: new HttpHeaders()
        .set('OTCSTICKET', CSConfig.AuthToken)
    }).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        console.log('correspondence ERROR => ' + error.message || 'some error with correspondence');
        return throwError(error);
      })
    );
  }

  getCurrentUserMailroomPrivelage(): Observable<any> {
    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.GetUserMailroomPrivelage
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }
      }
    );
  }

  getApproverList(ApproverType: string): Observable<any[]> {
    const params = new HttpParams()
      .set(ApproverType, 'true')
      .set('mainLanguage', 'EN')
      // TODO: check what should be used - ProxyUserID or UserID
      .set('filterField1', CSConfig.globaluserid);
    return this.httpServices.get<any[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.GetApproverList
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getApproverListRunningWF(ApproverType: string, volumeID: string): Observable<any[]> {
    const params = new HttpParams()
      .set(ApproverType, 'true')
      .set('mainLanguage', 'EN')
      .set('filterField1', volumeID);
    return this.httpServices.get<any[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.GetApproverList
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getTemplatesList(corrFlowType: string, templateType: string = 'Default', onBehalfOf: string = 'false') {
    const params = new HttpParams()
      .set('correspondence_type', corrFlowType)
      .set('template_type', templateType)
      .set('onBehalfOf', onBehalfOf)
      .set('active', '1')
      .set('catid', '261305') //TODO
      .set('language', '')
      .set('locationid', '261309');//TODO
    return this.httpServices.get<any[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.GetCoverLettertemplates
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getCollUserDetailsSet(EmpIDs: string, corrFlowType: string): Observable<ColUserSetModel[]> {
    const params = new HttpParams()
      .set('qLive', 'true')
      .set('CorrFlowType', corrFlowType)
      .set('UserIDs', '')
      .set('EIDs', EmpIDs)
      .set('SubWorkID', '')
      .set('UserIDs', '');

    return this.httpServices.get<ColUserSetModel[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.GetColUserSet
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }
  syncDocumentMetadata(documentMetadataSync: SyncDocumentMetadataModel): Observable<any> {
    const formData = new FormData();
    formData.append('docFolderID', documentMetadataSync.docFolderID);
    formData.append('srcDocID', documentMetadataSync.srcDocID);
    formData.append('SenderOrganization', documentMetadataSync.SenderOrganization);
    formData.append('SenderDepartment', documentMetadataSync.SenderDepartment);
    formData.append('RecipientOrganization', documentMetadataSync.RecipientOrganization);
    formData.append('RecipientDepartment', documentMetadataSync.RecipientDepartment);
    formData.append('RecipientName', documentMetadataSync.RecipientName);
    formData.append('DATE', documentMetadataSync.DATE);
    formData.append('DocumentNumber', documentMetadataSync.DocumentNumber);
    formData.append('SUBJECT', documentMetadataSync.SUBJECT);
    formData.append('CorrespondencePurpose', documentMetadataSync.CorrespondencePurpose);
    formData.append('BaseType', documentMetadataSync.BaseType);
    formData.append('ProjectCode', documentMetadataSync.ProjectCode);
    formData.append('BudgetNumber', documentMetadataSync.BudgetNumber);
    formData.append('ContractNumber', documentMetadataSync.ContractNumber);
    formData.append('CommitmentNumber', documentMetadataSync.CommitmentNumber);
    formData.append('TenderNumber', documentMetadataSync.TenderNumber);

    return this.httpServices.post(this.CSUrl + `${FCTSDashBoard.WFApiV1}${
      FCTSDashBoard.syncDoc
      }`,
      formData, { headers: { OTCSTICKET: CSConfig.AuthToken } });
  }

  insertCorrNotes(notes: string): Observable<any> {

    const params = new HttpParams()
      .set('NoteText', notes)
      .set('prompting', 'done');

    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.insertNotes
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getCorrWFTaskInfo(subworkId: string, taskId: string): Observable<any> {

    const params = new HttpParams()
      .set('subworkId', subworkId)
      .set('taskId', taskId);

    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.getWFTaskInfo
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getNotesText(notesID: string, volumeID: string): Observable<any> {
    const params = new HttpParams()
      .set('NotesID', notesID)
      .set('SubWorkID', volumeID);

    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.getNotes
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }
  getRejectReasons(Condition: string): Observable<any> {
    const params = new HttpParams()
      .set('Condition', Condition)
      .set('fRejctReson', 'true');

    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.SelectAttributes
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    ).pipe(
      map(data => {
        return data;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  setConnectionn(ConnectedID: string, ConnectionType: string, ReferenceType: string, ConnectedType: string, creatorID: string, Deleted: string) {
    const params = new HttpParams()
      .set('ConnectedID', ConnectedID)
      .set('ConnectionType', ConnectionType)
      .set('ReferenceType', ReferenceType)
      .set('ConnectedType', ConnectedType)
      .set('creatorID', creatorID)
      .set('Deleted', Deleted);
    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.setConnection
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    ).pipe(
      map(data => {
        return data;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  getCorrespondenceMetadataDetails(VolumeID: string): Observable<CorrespondenceWFFormModel> {
    const params = new HttpParams()
      .set('VolumeID', VolumeID);
    return this.httpServices.get<CorrespondenceWFFormModel>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.getCorrespondenceFormValues
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    ).pipe(
      map(data => {
        return data;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  setSubfolderPermission(corrDataDetail): Observable<any> {
    const params = new HttpParams()
      .set('locationid', corrDataDetail.locationid)
      .set('corrDataID', corrDataDetail.corrDataID)
      .set('CorrFlowType', corrDataDetail.CorrFlowType)
      .set('TaskID', corrDataDetail.TaskID)
      .set('UserID', CSConfig.globaluserid);

    return this.httpServices
      .get(
        this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.setSubfolderPerm}?Format=webreport`,
        {
          headers:
            { OTCSTICKET: CSConfig.AuthToken },
          params: params
        }
      )
      .pipe(
        map(data => {
          console.log('performer permission is set');
          return data;
        }),
        catchError(error => {
          return error;
        })
      );
  }
  //For Demo
  getDocumentTranslateURL(docid): Observable<DocumentPreview[]> {
    const params = new HttpParams().set('coverdocumentid', docid);
    return this.httpServices.get<DocumentPreview[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.documentTranlsation}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken },
        params: params
      }
    );
  }

}
