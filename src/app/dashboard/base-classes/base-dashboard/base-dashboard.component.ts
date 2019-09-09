import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { FCTSDashBoard } from 'src/environments/environment';
import { Correspondence, RecallStepsInfo } from 'src/app/dashboard/services/correspondence.model';
import { CorrAttachDocuments } from 'src/app/dashboard/services/corrattachdocuments.model';
import { DocumentPreview } from 'src/app/dashboard/services/documentpreview.model';
import { StatusRequest } from 'src/app/dashboard/models/Shared.model';

import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { CorrespondenceShareService } from 'src/app/dashboard/services/correspondence-share.service';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { AppLoadConstService } from 'src/app/app-load-const.service';

import { WorkflowHistoryDialogBox } from 'src/app/dashboard/workflow-history/workflow-history.component';
import { ConfirmationDialogComponent } from 'src/app/dashboard/dialog-boxes/confirmation-dialog/confirmation-dialog.component';
import { TransferRecallDialogComponent } from '../../dialog-boxes/transfer-recall-dialog/transfer-recall-dialog.component';
import { MessageDialogComponent } from '../../dialog-boxes/message-dialog/message-dialog.component';

@Component({
  selector: 'app-base-dashboard',
  templateUrl: './base-dashboard.component.html'
})

export class BaseDashboardComponent implements OnInit {
  // SearchFilterData: SearchFilters;
  SearchFilterData = {
    ReferenceCode: '',
    DocumentNumber: '',
    MyAssignments: false,
    DispatchDateFrom: '',
    DispatchDateTo: '',
    Subject: '',
    CorrespondencType: { ID: '', EN: '', AR: '' },
    ExternalOrganization: '',
    ExternalDepartment: '',
    RecipientDepartment: { ID: '', EN: '', AR: '' },
    SenderDepartment: { ID: '', EN: '', AR: '' },
    Priority: { ID: '', EN: '', AR: '' },
    BaseType: { ID: '', EN: '', AR: '' },
    IDNumber: '',
    Personalname: '',
    Transferpurpose: '',
    Contract: '',
    Tender: '',
    Mailroom: '',
    Budget: '',
    Project: '',
    Staffnumber: ''
  };

  reportType = '';
  routerCorrDetail = '/dashboard/external/correspondence-detail';
  routerFormStep = '/dashboard/external/correspondence-form-step';
  basehref: String = FCTSDashBoard.BaseHref;
  CorrAttach: CorrAttachDocuments;
  frameurl: string;
  returnedURl: string;
  AdvancedSearch = false;
  selectedCorrespondence: Correspondence;
  previewViewCorrespondence: Correspondence;
  quickViewCorrespondence: Correspondence;
  correspondenceData: Correspondence[];
  selection = new SelectionModel<Correspondence>(true, []);
  // currentPageNumber = 1;
  correspondData: Correspondence;
  DocumentPreview: boolean;
  progbar = true;
  documentPreviewURL: DocumentPreview[];
  // Pagination Variiables
  itemsPerPage: number = FCTSDashBoard.DefaultPageSize;
  pagenumber = 1;
  totalCount: number;

  searchExtOrgFieldShow: boolean;
  searchSenderDeptFieldShow: boolean;
  searchRecipientDeptFieldShow: boolean;
  // Items Count Variables
  fullPageNumber: string;

  constructor(
    public router: Router,
    public dialogU: MatDialog,
    public correspondenceService: CorrespondenceService,
    public correspondenceShareService: CorrespondenceShareService,
    public errorHandlerFctsService: ErrorHandlerFctsService,
    public appLoadConstService: AppLoadConstService
  ) { }

  public globalConstants = this.appLoadConstService.getConstants();

  ngOnInit() {
    this.getPage(this.pagenumber);
  }

  AdvancedSearchButton() {
    this.AdvancedSearch = !this.AdvancedSearch;
  }

  onSelect(correspondData: Correspondence): void {
    this.selectedCorrespondence = correspondData;
  }

  previewViewWrapper(correspondData: Correspondence): void {
    if (correspondData) { this.setPerformerPermission(correspondData); }
    this.getCoverDocumentURL('' + correspondData.CoverID);
    this.previewViewCorrespondence = correspondData;
  }

  quickViewWrapper(correspondData: Correspondence): void {
    this.quickViewCorrespondence = correspondData;
  }

  getPage(page: number): void {
    const perPage = FCTSDashBoard.DefaultPageSize;
    const start = ((page - 1) * perPage) + 1;
    const end = (start + perPage) - 1;
    this.getCorrespondence(this.reportType, start, end, page, this.SearchFilterData);
  }

  getCorrespondence(pageType: string, startrow: number, endrow: number, page: number, SearchFilterData: any): void {
    this.progbar = true;
    this.correspondenceService
      .getDashboardMain(pageType, startrow, endrow, SearchFilterData)
      .subscribe(
        correspondenceData => {
          this.correspondenceData = correspondenceData;
          this.progbar = false;
          if (this.correspondenceData.length === 0) {
            this.totalCount = 0;
          } else if (startrow === 1) {
            this.totalCount = correspondenceData[0].totalRowCount;
          }
          this.pagenumber = page;

          this.itemsCountShare();
        },
        responseError => {
          this.errorHandlerFctsService.handleError(responseError).subscribe();
        }
      );
  }

  SearchDashboard(): void {
    this.getPage(1);
  }

  routeToDetailsPage(correspondData: Correspondence) {
    this.setPerformerPermission(correspondData);
    if (correspondData.SubWorkTask_TaskID > 0 && correspondData.SubWorkTask_PerformerID_Groups.split(',').indexOf(correspondData.SubWorkTask_PerformerID) > 0 ) {
      this.userConfirmation( 'assignWF', correspondData );
    } else if (correspondData.transID > 0 && correspondData.transHoldSecretaryID !== CSConfig.globaluserid ) {
      this.userConfirmation( 'assignTransfer', correspondData );
    } else if (correspondData.SubWorkTask_TaskID > 0 && correspondData.SubWorkTask_PerformerID.toString() === CSConfig.globaluserid ) {
      this.routeToFormStepPage(correspondData);
    /*} else if (correspondenceData.transID > 0 && correspondenceData.transHoldSecretaryID != CSConfig.globaluserid ) {
      console.log("transfer assigned to USER"); */
    } else {
      this.router.navigate([this.routerCorrDetail],
                            { queryParams:
                              {
                                VolumeID: correspondData.VolumeID,
                                CorrType: correspondData.CorrFlowType,
                                CoverID: correspondData.CoverID,
                                locationid: correspondData.DataID,
                                TaskID: correspondData.SubWorkTask_TaskID,
                                TransID: correspondData.transID,
                                TransIsCC: correspondData.transIsCC
                                }
                              }
                          );
    }
  }

  routeToFormStepPage(correspondData: Correspondence) {
    this.setPerformerPermission(correspondData);
      this.router.navigate([this.routerFormStep],
                            { queryParams:
                              {
                                VolumeID: correspondData.VolumeID,
                                TaskID: correspondData.SubWorkTask_TaskID,
                                CorrType: correspondData.CorrFlowType,
                                locationid: correspondData.DataID
                              }
                            }
                          );
  }

  getCoverDocumentURL(CoverID: String): void {
    this.correspondenceService.getDocumentURL(CoverID)
      .subscribe(
        documentPreviewURL => {
          this.documentPreviewURL = documentPreviewURL;
        },
        responseError => {
          this.errorHandlerFctsService.handleError(responseError).subscribe();
        }
        );
  }

  onSearchDashboardButtonClick(selecetedValues: any): void {
    this.SearchFilterData = selecetedValues;
    this.SearchDashboard();
  }
/* ************************************* Correspondence History window *************************************** */
  openDialog(correspondData: Correspondence): void {
    const dialogRef = this.dialogU.open(WorkflowHistoryDialogBox, {
      width: '100%',
      panelClass: 'transferDialogBoxClass',
      maxWidth: '85vw',
      data: {
        data: correspondData
      }
    });
  }

  setPerformerPermission(correspondData: Correspondence): void {
    this.correspondenceService.setPerformerPermission(correspondData).subscribe(
      response => {},
      responseError => {
        this.errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }

  sendStatus(status: string): void {
    let CompleteRequestFinal: StatusRequest = new StatusRequest;
    CompleteRequestFinal = this.correspondenceShareService.buildObject(this.selection.selected, status, 'Multiselect', '');
    this.correspondenceShareService.setTransferToStatus(CompleteRequestFinal).subscribe(
      response => {
        this.getPage(this.pagenumber);
      },
      responseError => {
        this.errorHandlerFctsService.handleError(responseError).subscribe();
      }
      );
  }

  /* *************************** Assign Group task ************************************ */
  userConfirmation(mess: string, correspondenceData: Correspondence): void {
    const dialogRef = this.dialogU.open(ConfirmationDialogComponent, {
      width: '100%',
      panelClass: 'userConfirmation',
      maxWidth: '30vw',
      data: {
        message: mess
      }
    }).afterClosed().subscribe(
        response => {
        if ( mess === 'assignTransfer' && response === true) {
          this.correspondenceShareService.ToggleTransStatus(correspondenceData.transID, 'holdTask').subscribe(
              response => {
                if (response.transfer_status_changes[0].ID.toString() === correspondenceData.transID.toString()) {
                  console.log('DEV: transfer asiigned to current user');
                  // open CorrView
                  this.router.navigate([this.routerCorrDetail],
                    { queryParams:
                        {
                          VolumeID: correspondenceData.VolumeID,
                          CorrType: correspondenceData.CorrFlowType,
                          CoverID: correspondenceData.CoverID,
                          locationid: correspondenceData.DataID,
                          TaskID: correspondenceData.SubWorkTask_TaskID,
                          TransID: correspondenceData.transID,
                          TransIsCC: correspondenceData.transIsCC
                        }
                      }
                  );
                } else {
                  console.log('DEV: ERROR with assigning trarnsfer');
                }
              },
              responseError => {
                this.errorHandlerFctsService.handleError(responseError).subscribe();
              });
        } else if ( mess === 'assignTransfer' && response === false) {
          console.log('DEV: Open with RO mode');
          this.router.navigate([this.routerCorrDetail],
              { queryParams:
                  {
                    VolumeID: correspondenceData.VolumeID,
                    CorrType: correspondenceData.CorrFlowType,
                    CoverID: correspondenceData.CoverID,
                    locationid: correspondenceData.DataID,
                    TaskID: correspondenceData.SubWorkTask_TaskID,
                    TransID: correspondenceData.transID,
                    TransIsCC: correspondenceData.transIsCC
                  }
                }
            );
        } else if ( mess === 'assignWF' && response === true) {
          this.correspondenceService.assignWFStep(correspondenceData)
          .subscribe(
            response => {
             console.log('DEV: Assign WF step');
            /* !!!!!! there should be opened WF step, temporary: withing development CorrespView is opened */
            this.routeToFormStepPage(correspondenceData);
            /* *************************************************** */
            },
            responseError => {
              this.errorHandlerFctsService.handleError(responseError).subscribe();
            }
          );
        }
      },
      responseError => {
        this.errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }

  OpenDashCompleteDialog(correspondData: Correspondence, status: string): void {
    if (status === '1' && correspondData.transID.toString() !== '0' && correspondData.transStatus.toString() === '0' ) {
      const dialogRef = this.dialogU.open(ConfirmationDialogComponent, {
        width: '100%',
        panelClass: 'complete-dialog',
        maxWidth: '30vw',
        data: {
          data: correspondData,
          callplace: 'SingleDashboard'
        }
      }).afterClosed().subscribe( result => {
        if (result === 'Reload') { this.getPage(this.pagenumber); }
        });
    } else {
      let CompleteRequestFinal: StatusRequest = new StatusRequest;
      CompleteRequestFinal = this.correspondenceShareService.buildObject(correspondData, status, 'SingleDashboard', '');
      this.correspondenceShareService.setTransferToStatus(CompleteRequestFinal).subscribe(result => { this.getPage(this.pagenumber); });
    }
  }

  showMessage(message: string) {
    const dialogRef = this.dialogU.open( MessageDialogComponent, {
      width: '100%',
      // margin: 'auto',
      panelClass: 'complete-dialog',
      maxWidth: '30vw',
      data: { message }
    })
      .afterClosed().subscribe(
        // the lifecycle hook can be used e.g. to reload Dashboard
      );
  }

/* ******************  START RECALL  ****************** */
  startRecall(correspondData: Correspondence, recallType: string): void {
    if ( recallType !== 'ReturnToAS' ) {
      if ( correspondData.SubWorkTask_TaskID > 0 ) {
        this.recallWF(correspondData, recallType);
      } else {
        this.openRecallDialog(correspondData, recallType);
      }
    } else {
      this.returnToASDialog(correspondData, recallType);
    }
  }

  openRecallDialog(correspondData: Correspondence, recallType: string): void {
    const dialogRef = this.dialogU.open(TransferRecallDialogComponent, {
      width: '100%',
      panelClass: 'transferDialogBoxClass',
      maxWidth: '85vw',
      data: {
        'correspondData': correspondData,
        'recallType': recallType,
        'selectedRows': ''
      }
    }).afterClosed().subscribe(
      response => {
        if ( response === 'recall') { this.getPage(this.pagenumber); }
      },
      responseError => {
        this.errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }

  recallWF(correspondData: Correspondence, recallType: string): void {
    this.correspondenceService.checkRecallWF(correspondData).subscribe(
      response => {
        // DEV: need to check
        const recallCreateDate = Date.parse('13 September 2018');
        if ( recallCreateDate > Date.parse(response.initDate) ) {
          this.showMessage('The Correspondence was initiated before Recall functionality has been created');
        } else {
          if (recallType === 'SimpleRecall') {
            if (response.currTask !== -1 && response.prevTask !== -1 ) {
              console.log('DEV: simple WF recall');
              this.runWFRecall(response);
            } else {
              this.showMessage('You can not recall this Correspondence');
            }
          } else if (recallType === 'MRRecall') {
            if (response.currTask !== -1 && response.ASAprevTask !== -1 && response.currTask === 32) {
              response.prevTask = 24; /* set ReturnStep 05 ArchiveCorrespondence */
              this.runWFRecall(response);
              console.log('DIV: MR WF recall');
            } else {
              this.showMessage('You can not recall this Correspondence');
            }
          }
        }
      },
      responseError => {
        this.errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }

  runWFRecall(stepsInfo: RecallStepsInfo) {
    this.correspondenceService.runRecallWF(stepsInfo)
      .subscribe(
        response => {
          console.log(response);
          if (response.ok.toString() === 'true') {
            this.setDispAudit(stepsInfo, 'Recall');
            this.multipleApprove_Recall(stepsInfo);
            this.sendNotification(stepsInfo);
            this.getPage(this.pagenumber);
          } else {
            this.showMessage('An error occurred withing run Recall Correspondence, please contact the administrator');
          }
        },
        responseError => {
          this.errorHandlerFctsService.handleError(responseError).subscribe();
        }
      );
  }

  returnToASDialog(correspondData: Correspondence, recallType: string) {
    // function in component in-progress.component.ts
  }

  setDispAudit(stepsInfo: RecallStepsInfo, disposition1: string): void {
    const setDisp = this.correspondenceService.returnDisp1ForAudit(stepsInfo, disposition1);
    this.correspondenceService.setCustomDispositionAudit(stepsInfo, setDisp).subscribe(
      response => {
        if ( response.toString().trim() === stepsInfo.subWorkID.toString() ) {
          // DispAudit is set
        } else {
          this.showMessage('Error withing saving Disposition1 for Correspondence, VolumeID = ' + stepsInfo.subWorkID.toString());
        }
      },
      responseError => {
        this.errorHandlerFctsService.handleError(responseError).subscribe();
      }

    );
  }

  multipleApprove_Recall(stepsInfo: RecallStepsInfo): void {
    if ( (stepsInfo.CorrespondenceFlowType === '7' && stepsInfo.currTask === 37) || (stepsInfo.CorrespondenceFlowType === '5' && stepsInfo.currTask === 17) ) {
      this.correspondenceService.recallMultipleApprove(stepsInfo).subscribe(
        response => {
          console.log(response);
        },
        responseError => {
          this.errorHandlerFctsService.handleError(responseError).subscribe();
        }
      );
    }
  }

  sendNotification(stepsInfo: RecallStepsInfo): void {
    this.correspondenceService.sendRecallNotification(stepsInfo).subscribe(
      response => {
        console.log(response);
      },
      responseError => {
        this.errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }
/* ******************  END RECALL  ****************** */

  itemsCountShare() {
    this.correspondenceService.changeItemsCount(this.totalCount);
  }

}
