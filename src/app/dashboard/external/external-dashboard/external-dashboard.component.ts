import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { BaseDashboardFullComponent } from '../../base-classes/base-dashboard-full/base-dashboard-full.component';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { CorrespondenceShareService } from 'src/app/dashboard/services/correspondence-share.service';
import { AppLoadConstService } from 'src/app/app-load-const.service';
import { animate, style, transition, trigger, state } from '@angular/animations';

@Component({
  selector: 'app-external-dashboard',
  templateUrl: './external-dashboard.component.html',
  styleUrls: ['./external-dashboard.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ overflow: 'hidden', height: '*' })),
      state('out', style({ opacity: '0', overflow: 'hidden', height: '0px', minHeight: '0', margin: 0, padding: 0 })),
      transition('in <=> out', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})

export class ExternalDashboardComponent extends BaseDashboardFullComponent implements OnInit {
  public globalConstants = this.appLoadConstService.getConstants();
  /*   public chartsOpen: string;
    public searchopen: string; */
  constructor(
    public router: Router,
    public dialogU: MatDialog,
    public correspondenceService: CorrespondenceService,
    public correspondenceShareService: CorrespondenceShareService,
    public errorHandlerFctsService: ErrorHandlerFctsService,
    public appLoadConstService: AppLoadConstService,
  ) {
    super(router, dialogU, correspondenceService, correspondenceShareService, errorHandlerFctsService, appLoadConstService);
    this.reportType = 'ExtFullSearch';
    this.routerProxyRedirect = '/dashboard/external/new-outbounds';
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.globalConstants.general.ProxyUserID === this.globalConstants.general.UserID) {
      this.correspondenceService
        .getUserData()
        .subscribe(response => (this.userData = response));
    }
  }
}
