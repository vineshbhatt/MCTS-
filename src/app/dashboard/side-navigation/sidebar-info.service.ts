import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { FCTSDashBoard } from '../../../environments/environment';
import { SidebarUsersInfo } from './sidebar-info.model';

@Injectable({
  providedIn: 'root'
})
export class SidebarInfoService {
  private CSUrl: string = CSConfig.CSUrl;
  constructor(private httpServices: HttpClient) { }


  getUsersInfo(): Observable<any> {
    const params = new HttpParams();
    return this.httpServices
      .get(
        this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ProxyInfo}?Format=webreport`,
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

  getUserInfo(id: number): Observable<any> {
    const params = new HttpParams();
    return this.httpServices
      .get(
        this.CSUrl + `${FCTSDashBoard.WFApiV2}members/${id}`,
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

  getUserGroups(ID: number, SpecGroupType: string): Observable<any> {
    const params = new HttpParams()
    .set('KuafID', ID.toString())
    .set('SpecGroupType', SpecGroupType);
    return this.httpServices
      .get(
        this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.UserGroups}?Format=webreport`,
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

  getUserImg(id: number): Observable<any> {
    const params = new HttpParams();
    return this.httpServices
      .get(
        this.CSUrl + `${FCTSDashBoard.WFApiV1}members/${id}/photo`,
        { headers:
          { OTCSTICKET: CSConfig.AuthToken },
          params: params,
          responseType: 'blob'
        },
      ).pipe (
        map (data => {
          return data;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
}
