import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { CorrespondenceShareService } from '../../services/correspondence-share.service';
import { BaseDashboardComponent } from 'src/app/dashboard/base-classes/base-dashboard/base-dashboard.component';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { AppLoadConstService } from 'src/app/app-load-const.service';


@Component({
  selector: 'app-achieved-outbound',
  templateUrl: './achieved-outbound.component.html',
  styleUrls: ['../../base-classes/base-dashboard/base-dashboard.component.scss']
})
export class AchievedOutboundComponent extends BaseDashboardComponent implements OnInit {

  constructor(
    public router: Router,
    public dialogU: MatDialog,
    public correspondenceService: CorrespondenceService,
    public correspondenceShareService: CorrespondenceShareService,
    public errorHandlerFctsService: ErrorHandlerFctsService,
    public appLoadConstService: AppLoadConstService
  ) {
      super(router, dialogU, correspondenceService, correspondenceShareService, errorHandlerFctsService, appLoadConstService);
      this.reportType = 'ExtOutArc';
      this.routerFormStep = '/dashboard/external/correspondence-form-step-out';
  }

  ngOnInit() {
    super.ngOnInit();
    this.searchExtOrgFieldShow = true;
    this.searchRecipientDeptFieldShow = false;
    this.searchSenderDeptFieldShow = true;
  }
}
