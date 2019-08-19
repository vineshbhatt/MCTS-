import { Injectable } from '@angular/core';
import { StatusRequest, SetStatusRow } from '../models/Shared.model';
import { Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FCTSDashBoard } from '../../../environments/environment';
import { Correspondence } from './correspondence.model';
import { CorrResponse } from './correspondence-response.model';

@Injectable({
  providedIn: 'root'
})

export class CorrespondenceShareService {
  private CSUrl: string = CSConfig.CSUrl;
  constructor(private httpServices: HttpClient) { }

  setTransferToStatus(setStatusRequest: StatusRequest): Observable<any> {
    const rowsJSON = JSON.stringify({ setStatusRequest });
    const params = new HttpParams()
      .set('statusJson', rowsJSON)
      .set('rowsLength', setStatusRequest.SetStatusRow.length.toString());

    return this.httpServices
      .get<any>(
        this.CSUrl +
        `${FCTSDashBoard.WRApiV1}${
        FCTSDashBoard.SetStatuses
        }?Format=webreport`,
        {
          headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
        }
      )
      .pipe (
          map (responseData => {
            return responseData;
          }),
          catchError(error => {
            console.log('set Status ERROR => ' + error.message || 'some error with transfer');
            return error;
          })
      );
  }

  ToggleTransStatus(transID, status): Observable<any> {
    const params = new HttpParams()
      .set( 'transID', transID.toString() )
      .set( status, 'true' )
      .set( 'prompting', 'done' );

    return this.httpServices
      .get(
        this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.SetTransStatus}?Format=webreport`,
        { headers:
          { OTCSTICKET: CSConfig.AuthToken },
          params: params
        }
      )
      .pipe (
        map (data => {
          return data;
        }),
        catchError(error => {
          console.log('set status ERROR => ' + error.message || 'some error with set status');
          return error;
        })
      );
  }

  getTransferUser(user_id: string): Observable<any> {
    const params = new HttpParams()
      .set( 'EIDs', '')
      .set( 'OUIDs', '')
      .set( 'UserIDs', user_id)
      .set( 'prompting', 'done' );
    return this.httpServices
    .get<CorrResponse >(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.GetTransferUsers}?Format=webreport`,
      { headers:
        { OTCSTICKET: CSConfig.AuthToken },
        params: params
      }
    )
    .pipe (
      map (data => {
        return data;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

   createTransferReply(transferJson,  commonData: StatusRequest ): Observable<any> {
    const transferVal = JSON.stringify({ transferJson });
     const params = new HttpParams()
    .set('transferJson', transferVal)
    .set('volumeid', commonData.SetStatusRow[0].subworkid.toString())
    .set('taskid', '32')
    .set('isReplay', '1')
    .set('CorrFlowType', 'Incoming')
    .set('locationid', commonData.SetStatusRow[0].dataid.toString())
    .set('rows_count', transferJson.length)
    .set('parentID', commonData.SetStatusRow[0].transID.toString())
    .set('onBehalfUserID', CSConfig.globaluserid);

  return this.httpServices
  .get<any>(
    this.CSUrl +
    `${FCTSDashBoard.WRApiV1}${
    FCTSDashBoard.createTransfer
    }?Format=webreport`,
    {
      headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
    }
  )
  .pipe (
      map (data => {
        this.prepSetTransferStatus(data, commonData, 1, '');
        return data;
      }),
      catchError(error => {
        return throwError(error);
      })
  );
  }

  createTransferRequestDash(transferJson, correspondData: Correspondence, callplace: string): Observable<any> {
    const transferVal = JSON.stringify({ transferJson });
    const url = this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.createTransfer}?Format=webreport`;
    const params = new HttpParams()
      .set('transferJson', transferVal)
      .set('volumeid', correspondData.VolumeID.toString())
      .set('taskid', '32') /* needed to change for diff. CoorFlowType */
      .set('CorrFlowType', correspondData.CorrFlowType)
      .set('locationid', correspondData.DataID.toString())
      .set('rows_count', transferJson.length);

    return this.httpServices.get<any>( url, { headers: { OTCSTICKET: CSConfig.AuthToken }, params: params } )
    .pipe (
      map (data => {
        return data;
      }),
      catchError(error => {
        return error;
      })
    );
  }

  prepSetTransferStatus(transfered: any, commonData: StatusRequest, status: Number, NotesComplete: string): void {

    const rowsArray: SetStatusRow[] = [];
    const statusRow: SetStatusRow = new SetStatusRow;
    const setStatusRequest: StatusRequest = new StatusRequest;
      setStatusRequest.status = status.toString();
        statusRow.subworkid = commonData.SetStatusRow[0].subworkid.toString();
        statusRow.dataid = commonData.SetStatusRow[0].dataid.toString();
        statusRow.isCC = commonData.SetStatusRow[0].isCC.toString();
        statusRow.transID = commonData.SetStatusRow[0].transID.toString();
        statusRow.NotesComplete = NotesComplete;
        statusRow.currentStatus = commonData.SetStatusRow[0].currentStatus.toString();
        statusRow.userid = CSConfig.globaluserid;
        rowsArray.push(statusRow);
      setStatusRequest.SetStatusRow = rowsArray;
      this.setTransferToStatus(setStatusRequest).subscribe();
  }

  // set status i.e. Archived/Complete etc.
  buildObject(element: any, status: string, callplace: string, comment?: string ): StatusRequest {
      const setStatusObj: StatusRequest = new StatusRequest;
      const statusRowsArray: SetStatusRow[] = [];
      setStatusObj.status = status;
      const CList: SetStatusRow = new SetStatusRow;
      switch (callplace) {
        case 'Multiselect':
          for (let i = 0; i < element.length; i++) {
            const mCList: SetStatusRow = new SetStatusRow;
            mCList.subworkid = element[i].SubWork_SubWorkID.toString();
            mCList.dataid = element[i].DataID.toString();
            mCList.transID = element[i].transID.toString();
            mCList.isCC = element[i].transIsCC.toString();
            mCList.userid = CSConfig.globaluserid;
            mCList.currentStatus = element[i].Status.toString();
            mCList.NotesComplete = '';
            statusRowsArray.push(mCList);
          }
          break;
        case 'SingleDashboard':
          CList.subworkid = element.SubWork_SubWorkID.toString();
          CList.dataid = element.DataID.toString();
          CList.transID = element.transID.toString();
          CList.isCC = element.transIsCC.toString();
          CList.userid = CSConfig.globaluserid;
          CList.currentStatus = element.Status.toString();
          CList.NotesComplete = comment;
          statusRowsArray.push(CList);
          break;
        case 'CorrDetails':
          CList.subworkid = element.SubWorkID;
          CList.dataid = element.AttachCorrID;
          CList.transID = element.ID;
          CList.isCC = element.isCC;
          CList.userid = CSConfig.globaluserid;
          CList.currentStatus = element.Status;
          CList.NotesComplete = comment;
          statusRowsArray.push(CList);
          break;
        case 'ReturnToAS':
          let currStatus = '0';
          switch (element.Status.toString()) {
            case 'Acknowledged':
              currStatus = '1';
              break;
            case 'Archived':
              currStatus = '2';
              break;
          }
          CList.subworkid = element.VolumeID.toString();
          CList.dataid = element.DataID.toString();
          CList.transID = element.transID.toString();
          CList.isCC = element.transIsCC.toString();
          CList.userid = CSConfig.globaluserid;
          CList.currentStatus = currStatus;
          CList.NotesComplete = comment;
          statusRowsArray.push(CList);
      }
      setStatusObj.SetStatusRow = statusRowsArray;
      return setStatusObj;
  }

}
