import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { CorrespondenceShareService } from '../../services/correspondence-share.service';
import { BaseDashboardComponent } from 'src/app/dashboard/base-classes/base-dashboard/base-dashboard.component';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { AppLoadConstService } from 'src/app/app-load-const.service';
import { multiLanguageTranslator } from 'src/assets/translator/index';

@Component({
  selector: 'app-mr-acknowledged-outbounds',
  templateUrl: './mr-acknowledged-outbounds.component.html',
  styleUrls: ['../../base-classes/base-dashboard/base-dashboard.component.scss']
})

export class MrAcknowledgedOutboundsComponent extends BaseDashboardComponent implements OnInit {

  constructor(
    public router: Router,
    public dialogU: MatDialog,
    public correspondenceService: CorrespondenceService,
    public сorrespondenceShareService: CorrespondenceShareService,
    public errorHandlerFctsService: ErrorHandlerFctsService,
    public appLoadConstService: AppLoadConstService,
    public translator: multiLanguageTranslator
  ) {
    super(router, dialogU, correspondenceService, сorrespondenceShareService, errorHandlerFctsService, appLoadConstService, translator);
    this.reportType = 'MRExtOutAck';
    this.routerFormStep = '/dashboard/mailroom/correspondence-form-step-out';
  }

  ngOnInit() {
    super.ngOnInit();
    this.searchExtOrgFieldShow = true;
    this.searchRecipientDeptFieldShow = false;
    this.searchSenderDeptFieldShow = true;
  }

}
