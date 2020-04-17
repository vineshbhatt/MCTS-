import { Component, OnInit, ViewChild } from '@angular/core';
import { FCTSDashBoard } from '../../../environments/environment';
import { AppLoadConstService } from 'src/app/app-load-const.service';
import { multiLanguageTranslator } from 'src/assets/translator/index';
import { Router } from '@angular/router';
import { SidebarInfoService } from './sidebar-info.service';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { SidebarUsersInfo } from './sidebar-info.model';
import { CurrentUserPhotoComponent } from './current-user-photo/current-user-photo.component';
import { CorrespondenceShareService } from 'src/app/dashboard/services/correspondence-share.service';
import { NewDelegationComponent } from '../side-navigation/new-delegation/new-delegation.component';
import { MatDialog } from '@angular/material';
import { MatMenuTrigger } from '@angular/material/menu';
import { CurrentDelegationsComponent } from '../side-navigation/current-delegations/current-delegations.component';
import { DelegationReportComponent } from '../side-navigation/delegation-report/delegation-report.component';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html'
})
export class SideNavigationComponent implements OnInit {
  public globalConstants = this.appLoadConstService.getConstants();
  basehref: String = FCTSDashBoard.BaseHref;
  showMR = false;
  userData: SidebarUsersInfo;
  userPhoto: any;
  routerRoot = '/dashboard/external';
  panelOpenState = false;
  hideToggle = false;
  CSUrl: String = FCTSDashBoard.CSUrl;

  constructor(
    private appLoadConstService: AppLoadConstService,
    private sidebarInfoService: SidebarInfoService,
    private _errorHandlerFctsService: ErrorHandlerFctsService,
    public router: Router, public translator: multiLanguageTranslator,
    public correspondenceShareService: CorrespondenceShareService,
    public dialogU: MatDialog
  ) { }
  @ViewChild('currentUserPhoto') private currentUserPhoto: CurrentUserPhotoComponent;
  @ViewChild('clickMenuTrigger') clickMenuTrigger: MatMenuTrigger;

  ngOnInit() {
    this.showMR = this.globalConstants.general.showMR;
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
    this.onProxyChange();
  }


  onProxyChange() {
    this.router.navigate([this.globalConstants.general.routerRoot]);
    this.correspondenceShareService.onProxyChange();
  }

  openDialogNewDelegation(): void {
    this.clickMenuTrigger.closeMenu();
    const dialogRef = this.dialogU.open(NewDelegationComponent, {
      width: '800px',
      panelClass: 'delegationDialogBoxClass',
      maxWidth: '85vw',
      data: {
        section: 'userSection'
      }
    });
  }

  openDialogCurrentDelegations(): void {
    this.clickMenuTrigger.closeMenu();
    const dialogRef = this.dialogU.open(CurrentDelegationsComponent, {
      width: '1024px',
      panelClass: 'currentDelegationDialogBoxClass',
      maxWidth: '85vw',
      data: {
        section: 'userSection'
      }
    });
  }

  openDialogDelegationReport(): void {
    this.clickMenuTrigger.closeMenu();
    const dialogRef = this.dialogU.open(DelegationReportComponent, {
      width: '90vw',
      panelClass: 'delegationReportDialogBoxClass',
      maxWidth: '90vw',
      data: { section: 'userSection' }
    });
  }
}
