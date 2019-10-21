import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { BaseDashboardFullComponent } from '../../base-classes/base-dashboard-full/base-dashboard-full.component';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { CorrespondenceShareService } from 'src/app/dashboard/services/correspondence-share.service';
import { AppLoadConstService } from 'src/app/app-load-const.service';

@Component({
  selector: 'app-internal-dashboard',
  templateUrl: './internal-dashboard.component.html',
  styleUrls: ['./internal-dashboard.component.scss']
})

export class InternalDashboardComponent extends BaseDashboardFullComponent  implements OnInit {

  constructor(
    public router: Router,
    public dialogU: MatDialog,
    public correspondenceService: CorrespondenceService,
    public correspondenceShareService: CorrespondenceShareService,
    public errorHandlerFctsService: ErrorHandlerFctsService,
    public appLoadConstService: AppLoadConstService
    ) {
      super(router, dialogU, correspondenceService, correspondenceShareService, errorHandlerFctsService, appLoadConstService);
      this.reportType = 'IntFullSearch';
      this.routerFormStep = '/dashboard/internal/correspondence-form-step-intout';
      this.routerProxyRedirect = '/dashboard/internal/new-intoutbounds';
  }

}
