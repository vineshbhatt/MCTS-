import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { FCTSDashBoard } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {
  private CSUrl: string = CSConfig.CSUrl;


  constructor(
    private httpServices: HttpClient
  ) { }

  getAdminPageStructure(): Observable<any> {
    const params = new HttpParams();
    return this.httpServices.get<any>(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.AdminPageStructure}?Format=webreport`,
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
}
