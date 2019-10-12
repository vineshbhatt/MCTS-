import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import inboxMail from 'src/assets/Data/mailsData.json';

import { Correspondence } from 'src/app/dashboard/services/correspondence.model';
import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { FCTSDashBoard } from 'src/environments/environment';
import { BaseDashboardComponent } from 'src/app/dashboard/base-classes/base-dashboard/base-dashboard.component';

import { CorrespondenceShareService } from '../../services/correspondence-share.service';
import { ErrorHandlerFctsService } from '../../services/error-handler-fcts.service';
import { AppLoadConstService } from 'src/app/app-load-const.service';

@Component({
  selector: 'app-base-dashboard-full',
  templateUrl: './base-dashboard-full.component.html'
})

export class BaseDashboardFullComponent extends BaseDashboardComponent implements OnInit {
  constructor(
    public router: Router,
    public dialogU: MatDialog,
    public correspondenceService: CorrespondenceService,
    public correspondenceShareService: CorrespondenceShareService,
    public errorHandlerFctsService: ErrorHandlerFctsService,
    public appLoadConstService: AppLoadConstService,
  ) {
    super(router, dialogU, correspondenceService, correspondenceShareService, errorHandlerFctsService, appLoadConstService);
  }


  internalInboundRequestsWidth: number;
  internalOutboundRequestsWidth: number;
  externalInboundRequestsWidth: number;
  externalOutboundRequestsWidth: number;
  assignedAction: boolean;
  selectedMail: boolean;
  userData: string[];
  userDetails: string[];
  mailData: string[];
  id: number;
  // heroes = overviewitem;
  loading = true;
  animal: string;
  name: string;
  openedSubCorrespond: Correspondence;

  // selectedHero: PeriodicElement;
  // displayedColumns: string[] = [
  //   "select",
  //   "CorrespondenceCode",
  //   "Subject",
  //   "SubWorkTask_Title",
  //   "FromDept",
  //   "ToDept",
  //   "Assigned",
  //   "Received",
  //   "Priority",
  //   "Purpose",
  //   "DueDate",
  //   "options"
  // ];
  dataSource = new MatTableDataSource<PeriodicElement>(overviewitem);
  // selection = new SelectionModel<PeriodicElement>(true, []);
  @ViewChild(MatPaginator) overviewitem: MatPaginator;
  // Types of requests
  // Internal Inbound
  public totalInternalInboundRequests = 8900;
  public internalInboundRequests = 7120;
  // Internal Outbound
  public totalInternalOutboundRequests = 8900;
  public internalOutboundRequests = 3120;
  // External Inbound
  public totalExternalInboundRequests = 900;
  public externalInboundRequests = 220;
  // External Outbound
  public totalExternalOutboundRequests = 900;
  public externalOutboundRequests = 880;
  // Doughnut
  public doughnutChartLabels: string[] = [
    'Urgent',
    'Top Urgent',
    'Normal'
  ];
  public doughnutChartData: number[] = [350, 450, 100];
  public doughnutChartType = 'doughnut';
  public doughnutChartOptions: any = {
    responsive: true,
  };
  public doughnutChartColor: Array<any> = [{ backgroundColor: ['#8cc34b', '#36c2cf', '#a768dd'] }];

  ngOnInit() {
    super.ngOnInit();
    this.internalInboundRequestsWidth = Math.floor(this.internalInboundRequests / this.totalInternalInboundRequests * 100);
    this.internalOutboundRequestsWidth = Math.floor(this.internalOutboundRequests / this.totalInternalOutboundRequests * 100);
    this.externalInboundRequestsWidth = Math.floor(this.externalInboundRequests / this.totalExternalInboundRequests * 100);
    this.externalOutboundRequestsWidth = Math.floor(this.externalOutboundRequests / this.totalExternalOutboundRequests * 100);
    // this.dataSource.paginator = this.overviewitem;

    this.correspondenceService
      .getUserData()
      .subscribe(response => (this.userData = response));
  }

  getPage(page: number): void {
    const perPage = FCTSDashBoard.DefaultPageSize;
    const start = ((page - 1) * perPage) + 1;
    const end = (start + perPage) - 1;
    this.getCorrespondence(this.reportType, start, end, page, this.SearchFilterData);
  }

  getCorrespondence(pageType: string, start: number, end: number, page: number, SearchFilterData: any): void {
    this.progbar = true;
    this.correspondenceService
      .getDashboardMain(pageType, start, end, SearchFilterData)
      .subscribe(correspondenceData => {
        const myMap = new Map();
        for (const obj of correspondenceData) {

          if (myMap.has(obj.RowNum)) {
            // myMap.get(obj.RowNum).children.push(obj);
            myMap.get(obj.RowNum).subCorrespondenceDetail.push(obj);
            myMap.get(obj.RowNum).subCorrespondenceNumber = obj.counttasks - 1;
            myMap.get(obj.RowNum).subCorrespondence = true;
          } else {
            myMap.set(obj.RowNum, obj);
          }
        }

        const resultArray: Correspondence[] = [];
        // Iterate over map values
        for (const value of myMap.values()) {
          resultArray.push(value);                // 37 35 40
        }
        this.correspondenceData = resultArray;
        this.progbar = false;
        if (this.correspondenceData.length === 0) {
          this.totalCount = 0;
        } else if (start === 1) {
          this.totalCount = correspondenceData[0].totalRowCount;
        }
        this.pagenumber = page;
      });

  }

  openSubCorrespond(correspondData: Correspondence): void {
    this.openedSubCorrespond = correspondData;
  }

  assignedActionButton() {
    this.assignedAction = !this.assignedAction;
  }

  fullDetails() {
    this.selectedMail = !this.selectedMail;
  }

  setItemCount() {
    // overiding parent function to avoid error
  } 

  selectWFStepRoute(correspondData: Correspondence) {
    debugger;    
    switch (correspondData.CorrespondenceFlowType) {
      case '1':
        this.routerFormStep = '/dashboard/external/correspondence-form-step-inc'; //'/dashboard/external/correspondence-form-step-inc';
        break;
      case '5':
        this.routerFormStep = '/dashboard/external/correspondence-form-step-out'; // '/dashboard/external/correspondence-form-step-out';
        break;
      case '7':
        this.routerFormStep = '/dashboard/internal/correspondence-form-step-intout';; // '/dashboard/internal/correspondence-form-step-int';
        break;
    }
  }

}

export interface PeriodicElement {
  ID: string;
  Subject: string;
  Requester: string;
  Type: string;
  Assigned: any;
  Received: string;
  Status: string;
  Due_Customer: string;
  inbox_icons: any;
}

const overviewitem: PeriodicElement[] = inboxMail.mails;

/// \full data showing
@Component({
  selector: 'app-mail-detail-view',
  templateUrl: 'mail-detail-view.html',
})

export class MailDetailView {
  constructor(@Inject(MAT_DIALOG_DATA) public data: PeriodicElement) { }
}
