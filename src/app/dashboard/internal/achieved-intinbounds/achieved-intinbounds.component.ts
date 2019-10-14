import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { CorrespondenceShareService } from '../../services/correspondence-share.service';
import { BaseDashboardArchiveComponent } from '../../base-classes/base-dashboard-archive/base-dashboard-archive.component';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { AppLoadConstService } from 'src/app/app-load-const.service';

@Component({
  selector: 'app-achieved-intinbounds',
  templateUrl: './achieved-intinbounds.component.html',
  styleUrls: ['../../base-classes/base-dashboard/base-dashboard.component.scss']
})
export class AchievedIntInboundComponent extends BaseDashboardArchiveComponent implements OnInit {

  constructor(
    public router: Router,
    public dialogU: MatDialog,
    public correspondenceService: CorrespondenceService,
    public correspondenceShareService: CorrespondenceShareService,
    public errorHandlerFctsService: ErrorHandlerFctsService,
    public appLoadConstService: AppLoadConstService
  ) {
      super(router, dialogU, correspondenceService, correspondenceShareService , errorHandlerFctsService, appLoadConstService) ;
      this.reportType = 'IntInbArc';
      this.routerFormStep = '/dashboard/internal/correspondence-form-step-intout';
  }

  ngOnInit() {
    super.ngOnInit();
    this.searchExtOrgFieldShow = false;
    this.searchRecipientDeptFieldShow = true;
    this.searchSenderDeptFieldShow = true;
  }

}
