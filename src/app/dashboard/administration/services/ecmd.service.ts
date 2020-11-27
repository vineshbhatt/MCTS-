import { Injectable } from '@angular/core';
import { Observable, throwError, EMPTY, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FCTSDashBoard } from 'src/environments/environment';
import { AppLoadConstService } from 'src/app/app-load-const.service';
import {
  ECDMChartNode, ECDMChartCounterpart, ECDMChartDepartment, ECDMChartContact, CountriesModel, StatesModel, NodeListModel
} from '../ecmd/ecmd-classes.model';

@Injectable({
  providedIn: 'root'
})
export class EcmdService {
  private CSUrl: string = CSConfig.CSUrl;
  private _globalConstants = this.appLoadConstService.getConstants();

  public nodesList = new BehaviorSubject(new Array());
  currentNodesList = this.nodesList.asObservable();

  constructor(private httpServices: HttpClient,
    public appLoadConstService: AppLoadConstService) { }

  changeNodeList(nl: any[]) {
    this.nodesList.next(nl);
  }

  canChange(obj): Observable<any> {
    const params = new HttpParams()
      .set('ObjectID', obj.objectID)
      .set('FIELD1', obj.field1)
      .set('FIELD2', obj.field2)
      .set('FIELD3', obj.field3)
      .set('FIELD4', obj.field4)
      .set('csvIDS', obj.csvIDS)
      .set(obj.templateName, 'true');
    return this.httpServices.get<any>(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ObjectInUse}?Format=webreport`,
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

  getECMDNode(parentID: number = null): Observable<any[]> {
    const params = new HttpParams()
      .set('parentID', parentID ? parentID.toString() : '')
      .set(parentID ? 'NODES' : 'ROOTNODE', 'true');
    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ECMDChartNodes}?Format=webreport`,
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

  getECMDCounterpart(parentID: number, startRow?: number, endRow?: number): Observable<any[]> {
    let params = new HttpParams()
      .set('parentID', parentID.toString())
      .set('StartRow', startRow ? startRow.toString() : '')
      .set('EndRow', endRow ? endRow.toString() : '')
      .set('COUNTERPARTS', 'true');
    if (startRow) {
      params = params.append('CtrpPagination', 'true');
    }
    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ECMDChartCounterparts}?Format=webreport`,
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

  getECMDChartDepartments(parentID: number): Observable<any[]> {
    const params = new HttpParams()
      .set('parentID', parentID.toString())
      .set('DEPARTMENTS', 'true');
    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ECDMChartDepartments}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getECMDChartContacts(parentID: number): Observable<any[]> {
    const params = new HttpParams()
      .set('parentID', parentID.toString())
      .set('CONTACTS', 'true');
    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ECDMChartContacts}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  ECMDSearchNodes(searchType: string, value: string): Observable<any> {
    const params = new HttpParams()
      .set('CounterpartName', value)
      .set(searchType, 'true');
    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ECMDNodesSearch}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  ECMDSearchCounterparts(searchType: string, value: string): Observable<any> {
    const params = new HttpParams()
      .set('CounterpartName', value)
      .set(searchType, 'true');
    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ECMDSearchCounterparts}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getNodeList(): Observable<NodeListModel[]> {
    const params = new HttpParams()
      .set('NODELIST', 'true');
    return this.httpServices.get<NodeListModel[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ECMDNodesList}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  saveNode(action: string, element: ECDMChartNode) {
    const params = new HttpParams()
      .set('NodeID', element.NODEID ? element.NODEID.toString() : '')
      .set('CreatorID', this._globalConstants.general.UserID)
      .set('lvl1Name', element.Name_EN)
      .set('lvl1NameArabic', element.Name_AR)
      .set('lvl1ShortName', element.ShortName_EN)
      .set('lvl1ShortNameArabic', element.ShortName_AR)
      .set('ParentID', element.ParentID ? element.ParentID.toString() : '')
      .set(action, 'true');
    const options = {
      headers: new HttpHeaders()
        .set('OTCSTICKET', CSConfig.AuthToken)
    };
    return this.httpServices.post(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ECMDEditChart}?Format=webreport`,
      params, options);
  }

  saveCounterpart(action: string, element: ECDMChartCounterpart) {
    const params = new HttpParams()
      .set('CreatorID', this._globalConstants.general.UserID)
      .set('lvl2CPID', element.CPID ? element.CPID.toString() : '')
      .set('lvl2Name', element.Name_EN)
      .set('lvl2NameArabic', element.Name_AR)
      .set('lvl2ShortName', element.ShortName_EN)
      .set('lvl2ShortNameArabic', element.ShortName_AR)
      .set('lvl2Parent', element.NODEID ? element.NODEID.toString() : '')
      .set('lvl2FirstName', '')
      .set('lvl2FirstNameArabic', '')
      .set('lvl2LastName', '')
      .set('lvl2LastNameArabic', '')
      .set('lvl2VatCode', element.VatCode)
      .set('lvl2Address', element.Address)
      .set('lvl2AddressArabic', element.Address_AR)
      .set('lvl2City', element.City)
      .set('lvl2CityArabic', element.City_AR)
      .set('lvl2PostalCode', element.PostalCode)
      .set('lvl2Phone', element.Phone)
      .set('lvl2Fax', element.Fax)
      .set('lvl2Email', element.Email)
      .set('lvl2SPID', element.SPID ? element.SPID.toString() : '')
      .set('lvl2CID', element.CountryID ? element.CountryID.toString() : '')
      .set(action, 'true');
    const options = {
      headers: new HttpHeaders()
        .set('OTCSTICKET', CSConfig.AuthToken)
    };
    return this.httpServices.post(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ECMDEditChart}?Format=webreport`,
      params, options);
  }

  saveDepartment(action: string, element: ECDMChartDepartment) {
    const params = new HttpParams()
      .set('CreatorID', this._globalConstants.general.UserID)
      .set('lvl3DEPID', element.DEPID ? element.DEPID.toString() : '')
      .set('lvl3Name', element.Name_EN)
      .set('lvl3NameArabic', element.Name_AR)
      .set('lvl3ShortName', element.ShortName_EN)
      .set('lvl3ShortNameArabic', element.ShortName_AR)
      .set('lvl3ParentID', element.ParentID ? element.ParentID.toString() : '')
      .set('lvl2CPID', element.CPID ? element.CPID.toString() : '')
      .set(action, 'true');
    const options = {
      headers: new HttpHeaders()
        .set('OTCSTICKET', CSConfig.AuthToken)
    };
    return this.httpServices.post(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ECMDEditChart}?Format=webreport`,
      params, options);
  }

  saveContact(action: string, element: ECDMChartContact) {
    const params = new HttpParams()
      .set('CreatorID', this._globalConstants.general.UserID)
      .set('lvl3DEPID', element.DEPID ? element.DEPID.toString() : '')
      .set('lvl2CPID', element.CPID ? element.CPID.toString() : '')
      .set('lvl4CID', element.CID ? element.CID.toString() : '')
      .set('lvl4Name', element.FirstName_EN)
      .set('lvl4NameArabic', element.FirstName_AR)
      .set('lvl4LastName', element.LastName_EN)
      .set('lvl4LastNameArabic', element.LastName_AR)
      .set('lvl4Phone', element.Phone1 ? element.Phone1 : '')
      .set('lvl4Phone2', element.Phone2 ? element.Phone2 : '')
      .set('lvl4Fax', element.Fax ? element.Fax : '')
      .set('lvl4Email', element.Email ? element.Email : '')
      .set(action, 'true');
    const options = {
      headers: new HttpHeaders()
        .set('OTCSTICKET', CSConfig.AuthToken)
    };
    return this.httpServices.post(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ECMDEditChart}?Format=webreport`,
      params, options);
  }

  getChartCoutries(): Observable<CountriesModel[]> {
    const params = new HttpParams()
      .set('COUNTRIES', 'true');
    return this.httpServices.get<CountriesModel[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ECMDChartCountries}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getChartStates(): Observable<StatesModel[]> {
    const params = new HttpParams()
      .set('STATES', 'true');
    return this.httpServices.get<StatesModel[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ECMDChartStates}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }
}


