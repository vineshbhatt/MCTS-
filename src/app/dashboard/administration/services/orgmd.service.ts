import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FCTSDashBoard } from 'src/environments/environment';
import { UsersData, PaginationParameters, OrgChartEmployeeModel, UserRolesModel } from '../administration.model';
import { ORGMDTeamProjects } from 'src/app/dashboard/administration/models/orgmd.model';
import { AppLoadConstService } from 'src/app/app-load-const.service';
import { OrgStructureModel, ORGMDTeamsModel } from 'src/app/dashboard/administration/models/orgmd.model';
import { ORGMDTeamChartNode } from '../models/orgmd-teams-classes.model';

@Injectable({
  providedIn: 'root'
})
export class OrgmdService {
  private CSUrl: string = CSConfig.CSUrl;
  private _globalConstants = this.appLoadConstService.getConstants();

  constructor(
    private httpServices: HttpClient,
    public appLoadConstService: AppLoadConstService
  ) { }

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

  orgTeamsChartNodes(): Observable<OrgStructureModel[]> {
    const params = new HttpParams()
      .set('UNITS_SHORT', 'true');
    return this.httpServices.get<OrgStructureModel[]>(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ORGMDOrgUnits}?Format=webreport`,
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

  orgTeamsChartTeams(): Observable<ORGMDTeamsModel[]> {
    const params = new HttpParams()
      .set('TEAMS', 'true');
    return this.httpServices.get<ORGMDTeamsModel[]>(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ORGMDTeams}?Format=webreport`,
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

  orgTeamChartEmplDetail(teamID: number): Observable<OrgChartEmployeeModel[]> {   // make a model
    const params = new HttpParams()
      .set('teamID', teamID.toString())
      .set('TeamUsersPerID', 'true');
    return this.httpServices.get<OrgChartEmployeeModel[]>(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ORGMDTeamUser}?Format=webreport`,
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

  createGroup(TeamName: string, ProjectID: string): Observable<any> {
    const params = new HttpParams()
      .set('TeamName', TeamName)
      .set('ProjectID', ProjectID);
    return this.httpServices.get<any>(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ORGMDCreateGroup}?Format=webreport`,
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

  saveTeamDetails(element, action: string, GroupKuafID: number) {
    const params = new HttpParams()
      .set('CreatorID', this._globalConstants.general.UserID)
      .set('teamRecName', element.Name_EN)
      .set('teamDescription', element.Description_EN)
      .set('teamDescriptionAR', element.Description_AR)
      .set('teamPurposeShort', element.TeamPurposeShort_EN)
      .set('ParentID', element.ParentID)
      .set('TID', element.TID ? element.TID : '')
      .set('teamRecNameArabic', element.Name_AR)
      .set('teamPurposeShortAR', element.TeamPurposeShort_AR)
      .set('teamPurposeLong', element.TeamPurpose_EN)
      .set('teamPurposeLongAR', element.TeamPurpose_AR)
      .set('GroupKuafID', GroupKuafID ? GroupKuafID.toString() : '')
      .set('ProjectID', element.ProjectID)
      .set('teamShortName', element.ShortName_EN)
      .set('teamShortName_AR', element.ShortName_AR)
      .set('teamEmail', element.Email)
      .set(action, 'true');
    const options = {
      headers: new HttpHeaders()
        .set('OTCSTICKET', CSConfig.AuthToken)
    };
    return this.httpServices.post(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ORGMDTeamActions}?Format=webreport`,
      params, options);
  }

  orgmdTeamUsers(itemID: string, actionParameters: any, pageParameters: PaginationParameters): Observable<UsersData[]> {
    let params = new HttpParams()
      .set('StartRow', pageParameters.startRow.toString())
      .set('EndRow', pageParameters.endRow.toString())
      .set('GRID', itemID)
      .set('rowCount', pageParameters.startRow === 1 ? 'true' : 'false');
    if (actionParameters.action) {
      params = params.append('FullSearchStr', actionParameters.fullSearchStr ? actionParameters.fullSearchStr : '');
      params = params.append('FirstName', actionParameters.name ? actionParameters.name : '');
      params = params.append('LastName', actionParameters.surname ? actionParameters.surname : '');
      params = params.append('Login', actionParameters.login ? actionParameters.login : '');
      params = params.append('DepID', actionParameters.department);
      params = params.append(actionParameters.action, 'true');
    }
    return this.httpServices.get<UsersData[]>(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ORGMDTeamUsers}?Format=webreport`,
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

  orgmdTeamUsersActions(itemID: string, action: string, usersList: string[]): Observable<any> {
    const params = new HttpParams()
      .set('TeamKuafID', itemID)
      .set(action, usersList.toString());
    const options = {
      headers: new HttpHeaders()
        .set('OTCSTICKET', CSConfig.AuthToken)
    };
    return this.httpServices.post(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ORGMDManageTeamUsers}?Format=webreport`,
      params, options);
  }

  getTeamProgects(): Observable<ORGMDTeamProjects[]> {
    const params = new HttpParams()
      .set('PROJECTS', 'true');
    return this.httpServices.get<ORGMDTeamProjects[]>(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ORGMDTeamProjects}?Format=webreport`,
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

  getUserRoles(EID: number): Observable<UserRolesModel[]> {
    const params = new HttpParams()
      .set('ObjectID', EID.toString())
      .set('EmployeeRoles', 'true');
    return this.httpServices.get<UserRolesModel[]>(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ORGMDTeamEmployeeRoles}?Format=webreport`,
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

  orgmdDeleteGroup(tID: number): Observable<any> {
    const params = new HttpParams()
      .set('TeamID', tID.toString());
    const options = {
      headers: new HttpHeaders()
        .set('OTCSTICKET', CSConfig.AuthToken)
    };
    return this.httpServices.post(
      this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ORGMDDeleteGroup}?Format=webreport`,
      params, options);
  }
}
