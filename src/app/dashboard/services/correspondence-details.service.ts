import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CorrResponse } from './correspondence-response.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FCTSDashBoard } from '../../../environments/environment';
import { DocumentPreview } from '../services/documentpreview.model';
import { DashboardFilterResponse, TransferAttributes } from '../models/DashboardFilter';
import { CorrespondenenceDetailsModel, OrgNameAutoFillModel, CorrespondenceFolderModel, CCUserSetModel } from '../models/CorrespondenenceDetails.model';
import { StatusRequest, SetStatusRow } from '../models/Shared.model';
import { CorrespondenceShareService } from '../services/correspondence-share.service';
import { map, catchError } from 'rxjs/operators'; /* added 24/06/2019 */
import { EMPTY } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class CorrespondenceDetailsService {
  private CSUrl: string = CSConfig.CSUrl;
  constructor(
    private httpServices: HttpClient,
    private _correspondenceShareService: CorrespondenceShareService
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
    );
  }

  getCorrespondenceSenderDetails(SubWorkID, CorrFlowType): Observable<CorrResponse[]> {
    const params = new HttpParams()
      .set('SubWorkID', SubWorkID)
      .set('CorrFlowType', CorrFlowType)
      .set('qLive', 'false')
      .set('prompting', 'done');


    return this.httpServices.get<CorrResponse[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.SenderInfo
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
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

  getTransferPurposeAndPriority(): Observable<TransferAttributes[]> {
    return this.httpServices.get<TransferAttributes[]>(
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
    let requestType;
    if (Type === 'EMP') {
      requestType = 'IntName';
    } else {
      requestType = 'IntDepartment';
    }
    const params = new HttpParams().set(requestType, 'true')
      .set('NameVal', name + '%');
    if (name.length >= 3) {
      return this.httpServices.get<DashboardFilterResponse[]>(this.CSUrl +
        `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.GetTransferFields}?Format=webreport`,
        {
          headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
        });
    }
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
  getCorrRecord(locationid, transid, onbehalfuserid): Observable<CorrespondenenceDetailsModel[]> {
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
  /* Changed PSM: 27/06/2019 */
  createTransferRequest(transferJson, correspondenceData: CorrespondenenceDetailsModel): Observable<any> {
    const transferVal = JSON.stringify({ transferJson });
    const params = new HttpParams()
      .set('transferJson', transferVal)
      .set('volumeid', correspondenceData.VolumeID)
      .set('taskid', '32') /* needed to change for diff. CoorFlowType */
      .set('CorrFlowType', 'Incoming')
      .set('locationid', correspondenceData.AttachCorrID)
      .set('rows_count', transferJson.length);

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
    statusRow.userid = CSConfig.globaluserid.toString();
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
    let searchResults: Observable<OrgNameAutoFillModel[]>;
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
    let searchResults: Observable<OrgNameAutoFillModel[]>;
    let params = new HttpParams()
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
      .set('CorrFlowType', CorrFlowType)
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
      .set('AttachID', '' + corrAttachID)
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

  getCCUserDetailsSet(OUIds: string, requestType: string, corrFlowType: string): Observable<CCUserSetModel[]> {
    const params = new HttpParams()
      .set('OUIDs', OUIds)
      .set('qLive', 'true')
      .set('CorrFlowType', corrFlowType)
      .set('UserIDs', '')
      .set('EIDs', '');
    type NewType = CCUserSetModel;

    return this.httpServices.get<NewType[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.GetCCUserSet
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

}   
