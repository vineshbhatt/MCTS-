import { Injectable } from '@angular/core';
import { Observable, throwError, EMPTY, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FCTSDashBoard } from 'src/environments/environment';
import { RolesData, UsersData, PaginationParameters, DepFilterData } from '../administration.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {
  private CSUrl: string = CSConfig.CSUrl;

  public breadcrumbList = new BehaviorSubject([]);
  currentBreadcrumbList = this.breadcrumbList.asObservable();

  private secExp = new BehaviorSubject('');
  currentSecExp = this.secExp.asObservable();


  constructor(
    private httpServices: HttpClient
  ) { }

  changebreadcrumbList(br: any[]) {
    this.breadcrumbList.next(br);
  }

  changeSecExp(sec: string) {
    this.secExp.next(sec);
  }

  getAdminPageStructure(): Observable<any> {
    const params = new HttpParams();
    return this.httpServices.get<any>(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.AdminPageStructure}?Format=webreport`,
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

  getOrgmdRoles(): Observable<RolesData[]> {
    const params = new HttpParams();
    return this.httpServices.get<any>(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ORGMasterDataRoles}?Format=webreport`,
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

  orgmdRoleUsersActions(itemID: string, actionParameters: any, pageParameters: PaginationParameters, selectedUsers?: any[]): Observable<UsersData[]> {
    let params = new HttpParams()
      .set('StartRow', pageParameters.startRow.toString())
      .set('EndRow', pageParameters.endRow.toString())
      .set('GRID', itemID)
      .set('rowCount', pageParameters.startRow === 1 ? 'true' : 'false');
    if (actionParameters.action && actionParameters.action === 'fullsearch') {
      params = params.append('FullSearchStr', '%' + actionParameters.fullSearchStr + '%');
      params = params.append(actionParameters.action, 'true');
    } else if (actionParameters.action && actionParameters.action === 'filtersearch') {
      params = params.append('FirstName', actionParameters.name);
      params = params.append('LastName', actionParameters.surname);
      params = params.append('Login', actionParameters.login);
      params = params.append('DepID', actionParameters.department);
      params = params.append(actionParameters.action, 'true');
    } else if (actionParameters.action && actionParameters.action === 'removeusers') {
      params = params.append('UserIDs', selectedUsers.toString());
      params = params.append(actionParameters.action, 'true');
    } else if (actionParameters.action && actionParameters.action === 'addusers') {
      params = params.append('UserIDs', selectedUsers.toString());
      params = params.append(actionParameters.action, 'true');
    }
    return this.httpServices.get<any>(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ORGMDRoleUsers}?Format=webreport`,
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

  getDepartmentsList(searchText: string): Observable<DepFilterData[]> {
    if (searchText && searchText.length >= 3) {
      const params = new HttpParams()
        .set('NameVal', '%' + searchText + '%');
      return this.httpServices.get<any>(
        this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.DepartmentsList}?Format=webreport`,
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
    return EMPTY;
  }

  getAllUsers(searchParameters: any, startRow: number, endRow: number): Observable<UsersData[]> {
    let params = new HttpParams()
      .set('StartRow', startRow.toString())
      .set('EndRow', endRow.toString())
      .set('ItemID', searchParameters.itemID)
      .set(searchParameters.section, 'true');
    if (searchParameters.action && searchParameters.action === 'search') {
      params = params.append('SearchStr', searchParameters.searchString);
      params = params.append('DepID', searchParameters.department);
      params = params.append(searchParameters.action, 'true');
    }
    return this.httpServices.get<any>(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.GetAllUsers}?Format=webreport`,
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
