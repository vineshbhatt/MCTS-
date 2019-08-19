import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { BaseDashboardActiveComponent } from 'src/app/dashboard/base-classes/base-dashboard-active/base-dashboard-active.component';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { CorrespondenceShareService } from 'src/app/dashboard/services/correspondence-share.service';
import { AppLoadConstService } from 'src/app/app-load-const.service';

@Component({
  selector: 'app-new-intoutbound',
  templateUrl: './new-intoutbound.component.html',
  styleUrls: ['./new-intoutbound.component.scss']
})

export class NewIntOutboundComponent extends BaseDashboardActiveComponent implements OnInit {

    constructor(
      public router: Router,
      public dialogU: MatDialog,
      public correspondenceService: CorrespondenceService,
      public correspondenceShareService: CorrespondenceShareService,
      public errorHandlerFctsService: ErrorHandlerFctsService,
      public appLoadConstService: AppLoadConstService,
    ) {
      super(router, dialogU, correspondenceService, correspondenceShareService, errorHandlerFctsService, appLoadConstService);
      this.reportType = 'IntOutWIP';
    }

  ngOnInit() {
    super.ngOnInit();
    this.searchExtOrgFieldShow = false;
    this.searchRecipientDeptFieldShow = true;
    this.searchSenderDeptFieldShow = true;
  }

}

