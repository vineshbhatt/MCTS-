import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { BaseDashboardFullComponent } from '../../base-classes/base-dashboard-full/base-dashboard-full.component';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { CorrespondenceShareService } from 'src/app/dashboard/services/correspondence-share.service';
import { AppLoadConstService } from 'src/app/app-load-const.service';

@Component({
  selector: 'app-external-dashboard',
  templateUrl: './external-dashboard.component.html',
  styleUrls: ['./external-dashboard.component.scss']
})

export class ExternalDashboardComponent extends BaseDashboardFullComponent  implements OnInit {
  public globalConstants = this.appLoadConstService.getConstants();

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
