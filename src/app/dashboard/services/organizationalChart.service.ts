import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { organizationalChartModel, organizationalChartEmployeeModel, ECMDChartDepartmentModel } from '../models/organizational-Chart.model';
import { FCTSDashBoard } from '../../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CorrResponse } from './correspondence-response.model';
import { ECMDChartModel } from 'src/app/dashboard/models/organizational-Chart.model';
@Injectable({
  providedIn: 'root'
})
export class OrganizationalChartService {
  private CSUrl: string = CSConfig.CSUrl;
  constructor(private httpServices: HttpClient) { }
  getOrgChartInternal(): Observable<organizationalChartModel[]> {
    let params = new HttpParams().set("UNITS_SHORT", "true")
      .set("SearchUnits", "")
      .set("SearchUsers", "")
    return this.httpServices.get<organizationalChartModel[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.OrgChart}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getEmployeeListFromOUID(OUID): Observable<organizationalChartEmployeeModel[]> {
    let params = new HttpParams().set("EMP_SHORT", "true")
      .set("SearchUnits", "")
      .set("SearchUsers", "")
      .set("ObjectIDList", OUID);
    return this.httpServices.get<organizationalChartEmployeeModel[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.OrgChart}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  fullSearchOUID(searchParameter: string): Observable<any> {
    let params = new HttpParams()
      .set("ALL_EMPLSEARCH_SHORT", "true")
      .set("SearchUnits", "")
      .set("SearchUsers", searchParameter);
    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.OrgChart}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getECMDChart(parentID: number): Observable<ECMDChartModel[]> {
    let params = new HttpParams()
      .set('parentID', parentID.toString())
      .set(parentID === 0 ? 'ROOTNODE' : 'CHILDREN', 'true');
    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ECMDChart}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  getECMDChartDepartments(parentID: number): Observable<ECMDChartDepartmentModel[]> {
    let params = new HttpParams()
      .set('parentID', parentID.toString())
      .set('DEPARTMENTS', 'true');
    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ECMDChart}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  ECMDSearch(searchType: string, value: string): Observable<any> {
    let params = new HttpParams()
      .set('CounterpartName', value)
      .set(searchType, 'true');
    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ECMDSearch}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
      }
    );
  }

  /*   ECMDDepartmentsSearch(searchType: string, value: string): Observable<any> {
      let params = new HttpParams()
        .set('CounterpartName', value)
        .set(searchType, 'true');
      return this.httpServices.get<any>(
        this.CSUrl +
        `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ECMDepartmentsSearch}?Format=webreport`,
        {
          headers: { OTCSTICKET: CSConfig.AuthToken }, params: params
        }
      );
    } */


}
