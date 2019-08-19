import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { organizationalChartModel, organizationalChartEmployeeModel } from '../models/organizational-Chart.model';
import { FCTSDashBoard } from '../../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CorrResponse } from './correspondence-response.model';
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
}
