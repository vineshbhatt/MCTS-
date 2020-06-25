import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { CorrespondenceShareService } from 'src/app/dashboard/services/correspondence-share.service';
import { ExternalDashboardComponent } from 'src/app/dashboard/external/external-dashboard/external-dashboard.component';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { AppLoadConstService } from 'src/app/app-load-const.service';
import { BaseDashboardFullComponent } from '../../base-classes/base-dashboard-full/base-dashboard-full.component';
import { animate, style, transition, trigger, state } from '@angular/animations';

@Component({
  selector: 'app-mailroom-dasnboard',
  templateUrl: '../../mailroom/mailroom-dasnboard/mailroom-dasnboard.component.html',
  animations: [
    trigger('slideInOut', [
      state('in', style({ overflow: 'hidden', height: '*' })),
      state('out', style({ opacity: '0', overflow: 'hidden', height: '0px', minHeight: '0', margin: 0, padding: 0 })),
      transition('in <=> out', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})

export class MailroomDasnboardComponent extends BaseDashboardFullComponent implements OnInit {

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
  }

  ngOnInit() {
    super.ngOnInit();
    this.correspondenceShareService.mrCountReady.subscribe(response => {
      this.userData = response;
      console.log(this.userData);
    });
  }

}
