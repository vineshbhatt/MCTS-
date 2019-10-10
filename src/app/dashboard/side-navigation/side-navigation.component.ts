import { Component, OnInit, ViewChild } from '@angular/core';
import { FCTSDashBoard } from '../../../environments/environment';
import { AppLoadConstService } from 'src/app/app-load-const.service';
import { Router } from '@angular/router';
import { SidebarInfoService } from './sidebar-info.service';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { SidebarUsersInfo } from './sidebar-info.model';
import { CurrentUserPhotoComponent } from './current-user-photo/current-user-photo.component';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html'
})
export class SideNavigationComponent implements OnInit {
  private _globalConstants = this.appLoadConstService.getConstants();
  basehref: String = FCTSDashBoard.BaseHref;
  showMR = false;
  userData: SidebarUsersInfo;
  userPhoto: any;
  routerRoot = '/dashboard/external';

  constructor(
    private appLoadConstService: AppLoadConstService,
    private sidebarInfoService: SidebarInfoService,
    private _errorHandlerFctsService: ErrorHandlerFctsService,
    public router: Router
  ) { }
  @ViewChild('currentUserPhoto') private currentUserPhoto: CurrentUserPhotoComponent;

  ngOnInit() {
    this.showMR = this._globalConstants.general.showMR;
    this.sidebarInfoService.getUsersInfo().subscribe(
      response => {
        console.log(response);
        this.userData = response;
       /*  this.getUserImg(); */
      },
      responseError => {
        this._errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }

  changePhoto() {
    this.currentUserPhoto.ngOnInit();
    this.router.navigate([this.routerRoot]);
  }

}
