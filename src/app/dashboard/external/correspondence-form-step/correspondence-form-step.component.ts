import { Component, OnInit, AfterViewInit, VERSION } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Observable, EMPTY } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';
import { MatOptionSelectionChange, MatCheckboxChange } from '@angular/material';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

import { FCTSDashBoard } from '../../../../environments/environment';
import { OrgNameAutoFillModel, CorrespondenceFolderModel, CCUserSetModel, CorrespondenenceDetailsModel } from 'src/app/dashboard/models/CorrespondenenceDetails.model';
import { CorrResponse, CorrespondenceFormData, SenderDetailsData, RecipientDetailsData } from '../../services/correspondence-response.model';
import { organizationalChartModel } from 'src/app/dashboard/models/organizational-Chart.model';
import { DocumentPreview } from '../../services/documentpreview.model';
import { CorrespondenceWFFormModel } from '../../models/CorrepondenceWFFormModel';

import { CorrespondenceDetailsService } from 'src/app/dashboard/services/correspondence-details.service';
import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { OrganizationalChartService } from 'src/app/dashboard/services/organizationalChart.service';
import { CSDocumentUploadService } from '../../services/CSDocumentUpload.service';
import { ErrorHandlerFctsService } from '../../services/error-handler-fcts.service';

import { ShowSections, ShowCorrItems } from 'src/app/dashboard/external/correspondence-detail/correspondence-show-sections';


@Component({
  selector: 'app-correspondence-form-step',
  templateUrl: './correspondence-form-step.component.html',
  styleUrls: ['./correspondence-form-step.component.scss']
})

export class CorrespondenceFormStepComponent implements OnInit {

  constructor(
      private correspondenceDetailsService: CorrespondenceDetailsService
    , private _location: Location
    , private organizationalChartService: OrganizationalChartService
    , private formBuilder: FormBuilder
    , private correspondencservice: CorrespondenceService
    , private csdocumentupload: CSDocumentUploadService
    , private _correspondenceDetailsService: CorrespondenceDetailsService
    , private route: ActivatedRoute
    , private _router: Router
    , private _errorHandlerFctsService: ErrorHandlerFctsService) { }

  get f() { return this.correspondenceDetailsForm.controls; }

  parentRoute = '';

  basehref: String = FCTSDashBoard.BaseHref;
  CSUrl: String = FCTSDashBoard.CSUrl;
  expandedRightAction = true;
  expandedAction = true;
  userInfo: CorrResponse[];
  filteredExtOrgNames: Observable<OrgNameAutoFillModel[]>;
  filteredIntDepNames: Observable<OrgNameAutoFillModel[]>;
  filteredDepartmentNames: Observable<OrgNameAutoFillModel[]>;
  ExtSenderInfo: OrgNameAutoFillModel;
  IntRecipientInfo: OrgNameAutoFillModel;
  senderControl = new FormControl();
  recipientControl = new FormControl();
  myControl = new FormControl();
  correspondenceDetailsForm: FormGroup;
  senderDetailsForm: FormGroup;
  recipientDetailsForm: FormGroup;

  ccDetailsForm: FormGroup;
  CCDetails: FormArray;
  submitted = false;
  CorrespondenceType: string;
  MetadataFilters: any[];
  externalIncCoverLetterData: CorrResponse[];
  externalAttachmentFolderData: CorrResponse[];
  corrFolderData: CorrespondenceFolderModel;
  documentPreviewURL: DocumentPreview[];

  selectedCaption: string;
  multiSelect: boolean;
  currentlyChecked: any = false;
  currentlyCheckedStatus: boolean;
  showPreviewCoverLetter: boolean;

  treeControl = new NestedTreeControl<organizationalChartModel>(node => node.children);
  dataSource = new MatTreeNestedDataSource<organizationalChartModel>();

  showEmployees = false;

  organizationalChartData: organizationalChartModel[];
  showEmplChartData: organizationalChartModel;
  showOrgChartData: organizationalChartModel;
  showPreviewTreeArea = false;
  //
  percentDone: number;
  uploadSuccess: boolean;
  version = VERSION;

  //
  initiateIncomingCorrespondenceDetails = new CorrespondenceWFFormModel;

  showGeneratebarcodeButton = true;
  showSendOnButton = false;
  coverID: string;

  CCOUID: organizationalChartModel[] = [];
  value = '';
  public files: NgxFileDropEntry[] = [];

  correspondenceData: CorrespondenenceDetailsModel;

  //
  VolumeID: string;
  CoverID: string;
  locationid: string;
  CorrespondencType: string;
  taskID: string;
  CorrespondenceFolderName: Observable<any>;

  correspondenceSenderDetailsData: SenderDetailsData;    // make model
  correspondenceRecipientDetailsData: RecipientDetailsData; // make model
  correspondenceCollaborationDetail: CorrResponse[]; // make model
  ccProgbar = false;
  commentsProgbar = false;
  correspondenceCCtData: CorrResponse[];
  correspondenceCommentsDetail: CorrResponse[];
  transferhistorytabData: CorrResponse[];
  transferProgbar = false;
  userCollaborationProgbar = false;
  sectionDisplay = new ShowSections();
  showCorrItems = new ShowCorrItems();

  body: CorrespondenceFormData = {
    action: 'formUpdate',
    values: {}
  };

  ngOnInit() {
    this.VolumeID = this.route.snapshot.queryParamMap.get('VolumeID');
    this.CorrespondencType = this.route.snapshot.queryParamMap.get('CorrType');
    this.locationid = this.route.snapshot.queryParamMap.get('locationid');
    this.taskID = this.route.snapshot.queryParamMap.get('TaskID');
    this.RefreshRecord();
    this.readCorrespondenceInfo();
    this.getCorrespondenceSenderDetails(this.VolumeID, this.CorrespondencType);
    this.getCorrespondenceRecipientDetails(this.VolumeID, this.CorrespondencType);
    this.sectionDisplay.ShowCorrSectionWF();

    // Get Logged in user Information
    this.getUserInfo();
    this.getOrganizationalChartDetail();

    this.senderDetailsForm = this.formBuilder.group({
      SenderName: [],
      SenderDepartment: [],
      ExternalOrganization: [],

    });


    this.recipientDetailsForm = this.formBuilder.group({
      RecipientID: [],
      RecipientUserID: [],
      RecipientVersion: [],
      RecipientType: [],
      RecipientDepartment: [],
      RecipientDepartmentName: [],
      RecipientSection: [],
      RecipientRole: [],
      RecipientName: []
    });

    this.ccDetailsForm = this.formBuilder.group({
      CCDetails: this.formBuilder.array([

      ])
    });

    this.correspondenceDetailsForm = this.formBuilder.group({
      regDate: new FormControl({ value: '', disabled: !this.showCorrItems.regDate.Modify }),
      docsDate: new FormControl({ value: '', disabled: !this.showCorrItems.docsDate.Modify }),
      confidential: new FormControl({ value: '', disabled: !this.showCorrItems.confidential.Modify }),
      priority: new FormControl({ value: '', disabled: !this.showCorrItems.priority.Modify }),
      refNumber: ['', Validators.required],
      personalName: new FormControl({ value: '', disabled: !this.showCorrItems.personalName.Modify }),
      idNumber: new FormControl({ value: '', disabled: !this.showCorrItems.idNumber.Modify }),
      correspondenceType: new FormControl({ value: '', disabled: !this.showCorrItems.correspondenceType.Modify }),
      baseType: new FormControl({ value: '', disabled: !this.showCorrItems.baseType.Modify }),
      arabicSubject: new FormControl({ value: '', disabled: !this.showCorrItems.arabicSubject.Modify }),
      englishSubject: new FormControl({ value: '', disabled: !this.showCorrItems.englishSubject.Modify }),
      projectCode: new FormControl({ value: '', disabled: !this.showCorrItems.projectCode.Modify }),
      budgetNumber: new FormControl({ value: '', disabled: !this.showCorrItems.budgetNumber.Modify }),
      contractNumber: new FormControl({ value: '', disabled: !this.showCorrItems.contractNumber.Modify }),
      tenderNumber: new FormControl({ value: '', disabled: !this.showCorrItems.tenderNumber.Modify }),
      corrNumber: new FormControl({ value: '', disabled: !this.showCorrItems.corrNumber.Modify }),
      fillinPlanPath: new FormControl({ value: '', disabled: !this.showCorrItems.fillinPlanPath.Modify }),
      dispatchMethod: new FormControl({ value: '', disabled: !this.showCorrItems.dispatchMethod.Modify }),
      staffNumber: new FormControl({ value: '', disabled: !this.showCorrItems.staffNumber.Modify }),
    });

    this.filteredExtOrgNames = this.senderDetailsForm.get('ExternalOrganization').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value =>
          this.correspondenceDetailsService.searchFieldForAutoFill(value, 'ExtOrganization', '')
        )
      );

    this.filteredIntDepNames = this.recipientDetailsForm.get('RecipientDepartment').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value =>
          this.correspondenceDetailsService.searchFieldForAutoFill(value, 'IntDepartment', '')
        )
      );
  }

  ReadRecord(locationid: string, transid: string) {
    this.correspondenceDetailsService
      .getCorrRecord(locationid, transid, CSConfig.globaluserid)
      .subscribe(correspondenceData => {
        this.correspondenceData = correspondenceData[0];
        this.getCoverSection();
        console.log(this.correspondenceData);
      });
  }

  RefreshRecord() {
    this.ReadRecord(this.locationid, '0');
  }

  getCorrespondenceSenderDetails(VolumeID: string, CorrespondencType: String): void {
    this._correspondenceDetailsService.getCorrespondenceSenderDetails(VolumeID, CorrespondencType, false, '')
      .subscribe(correspondenceSenderDetailsData => {
        if ((typeof correspondenceSenderDetailsData[0].myRows !== 'undefined') && correspondenceSenderDetailsData[0].myRows.length > 0) {
          this.correspondenceSenderDetailsData = correspondenceSenderDetailsData[0].myRows[0];
        }
      });

  }

  getCorrespondenceRecipientDetails(VolumeID: string, CorrespondencType: String): void {
    this._correspondenceDetailsService
      .getCorrespondenceRecipientDetails(VolumeID, CorrespondencType)
      .subscribe(
        correspondenceRecipientDetailsData => {
          // tslint:disable-next-line: max-line-length
          if (( typeof correspondenceRecipientDetailsData[0].myRows !== 'undefined') && correspondenceRecipientDetailsData[0].myRows.length > 0) {
            this.correspondenceRecipientDetailsData = correspondenceRecipientDetailsData[0].myRows[0];
          }
        }
      );
  }

  ccShowData() {
    this.getCorrespondenceCCDetail(this.VolumeID, this.CorrespondencType);
  }

  getCorrespondenceCCDetail(VolumeID: String, CorrFlowType: String): void {
    this.ccProgbar = true;
    this._correspondenceDetailsService.getCorrespondenceCCDetail(VolumeID, CorrFlowType)
      .subscribe(correspondenceCCtData => {
        this.correspondenceCCtData = correspondenceCCtData;
        this.ccProgbar = false;
        console.log('this.correspondenceCCtData');
        console.log(this.correspondenceCCtData);
        for (const obj of this.correspondenceCCtData[0].myRows) {
          this.addCC(obj);
        }
      });
  }

  addCC(depDetails: CCUserSetModel): void {
    console.log(depDetails);
    this.CCDetails = this.ccDetailsForm.get('CCDetails') as FormArray;
    this.CCDetails.push(this.createNewCC(depDetails));
    console.log('this.CCDetails');
    console.log(this.CCDetails);
  }
  createNewCC(depDetails: CCUserSetModel): FormGroup {
    return this.formBuilder.group({
      DepID: depDetails.CCUserID,
      Depversion: depDetails.CCVersion,
      departmentName: depDetails.DepartmentName_EN,
      role: depDetails.Role_EN,
      name: depDetails.Name_EN
    });
  }
  removeCC(index: number) {
    alert(JSON.stringify(this.CCDetails.value));

  }

  collaborationShowData() {
    this.getCorrespondenceCollaborationData();
  }

  getCorrespondenceCollaborationData(): void {
    this.userCollaborationProgbar = true;
    this._correspondenceDetailsService.getCorrespondenceCollaborationInfoRO(this.VolumeID, this.CorrespondencType)
      .subscribe(correspondenceCollaborationDetail => {
        this.correspondenceCollaborationDetail = correspondenceCollaborationDetail;
        console.log('this.correspondenceCollaborationDetail');
        console.log(this.correspondenceCollaborationDetail);
        this.userCollaborationProgbar = false;
      });
  }

  showCommentsData() {
    this.getCommentsData();
  }

  getCommentsData(): void {
    this.commentsProgbar = true;
    this._correspondenceDetailsService.getCommentsData(this.VolumeID)
      .subscribe(correspondenceCommentsDetail => {
        this.correspondenceCommentsDetail = correspondenceCommentsDetail;
        this.commentsProgbar = false;
      });
  }
  /* */
  readCorrespondenceInfo(): void {
    this._correspondenceDetailsService.getFormStepInfo(this.VolumeID, this.VolumeID, this.taskID).subscribe(
      response => {
        if ((typeof response.forms !== 'undefined') && response.forms.length > 0) {
          this.body.values = response.forms[0].data;
          this.getMetadataFilters();
        }
      },
      responseError => {
        this._errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }
/*
  printdata() {
    this.makeFormObjectToSubmit();
    console.log('MetadataFilters');
    console.log(this.MetadataFilters);
  }
*/
  makeFormObjectToSubmit(action: string) {
    this.body.values.WorkflowForm_1x4x1x22 = this.setPopupCheckedValue('Priority', this.correspondenceDetailsForm.get('priority').value.EN);
    this.body.values.WorkflowForm_1x4x1x2 = this.correspondenceDetailsForm.get('regDate').value;
    this.body.values.WorkflowForm_1x4x1x124 = this.correspondenceDetailsForm.get('docsDate').value;
    this.body.values.WorkflowForm_1x4x1x28 = this.correspondenceDetailsForm.get('refNumber').value;
    this.body.values.WorkflowForm_1x4x1x88 = this.correspondenceDetailsForm.get('personalName').value;
    this.body.values.WorkflowForm_1x4x1x27 = this.correspondenceDetailsForm.get('idNumber').value;
    this.body.values.WorkflowForm_1x4x1x30 = this.setPopupCheckedValue('CorrespondenceType', this.correspondenceDetailsForm.get('correspondenceType').value.EN);
    this.body.values.WorkflowForm_1x4x1x29 = this.setPopupCheckedValue('BaseType', this.correspondenceDetailsForm.get('baseType').value.EN);
    this.body.values.WorkflowForm_1x4x1x35 = this.correspondenceDetailsForm.get('arabicSubject').value;
    this.body.values.WorkflowForm_1x4x1x36 = this.correspondenceDetailsForm.get('englishSubject').value;
    this.body.values.WorkflowForm_1x4x1x37 = this.correspondenceDetailsForm.get('projectCode').value;
    this.body.values.WorkflowForm_1x4x1x38 = this.correspondenceDetailsForm.get('budgetNumber').value;
    this.body.values.WorkflowForm_1x4x1x40 = this.correspondenceDetailsForm.get('contractNumber').value;
    this.body.values.WorkflowForm_1x4x1x39 = this.correspondenceDetailsForm.get('tenderNumber').value;
    this.body.values.WorkflowForm_1x4x1x9 = this.correspondenceDetailsForm.get('corrNumber').value;
    this.body.values.WorkflowForm_1x4x1x41 = this.correspondenceDetailsForm.get('staffNumber').value;
    this.body.values.WorkflowForm_1x4x1x49 = this.setPopupCheckedValue('DispatchMethod', this.correspondenceDetailsForm.get('dispatchMethod').value.EN);
    this.body.values.WorkflowForm_1x4x1x75 = action;
    this.getCCtoFormObject();
  }

  getCCtoFormObject() {
    this.body.values.WorkflowForm_1x4x1x17.splice(this.ccDetailsForm.get('CCDetails').value.length);
    for (let i = 0; i < this.ccDetailsForm.get('CCDetails').value.length; i++ ) {
      if (typeof this.body.values.WorkflowForm_1x4x1x17[i] === 'object') {
       this.body.values.WorkflowForm_1x4x1x17[i].WorkflowForm_1x4x1x17_x_18 = this.ccDetailsForm.get('CCDetails').value[i].DepID;
       this.body.values.WorkflowForm_1x4x1x17[i].WorkflowForm_1x4x1x17_x_19 = this.ccDetailsForm.get('CCDetails').value[i].Depversion;
      } else {
       this.body.values.WorkflowForm_1x4x1x17.push(
          { WorkflowForm_1x4x1x17_x_18: this.ccDetailsForm.get('CCDetails').value[i].DepID,
            WorkflowForm_1x4x1x17_x_19: this.ccDetailsForm.get('CCDetails').value[i].Depversion,
            WorkflowForm_1x4x1x17_x_20: null, WorkflowForm_1x4x1x17_x_92: null
          }
        );
      }
    }
  }

  setCorrespondenceDetails(): void {
    // tslint:disable-next-line: max-line-length
    this.recipientDetailsForm.get('RecipientDepartment').setValue({DepName_En : this.correspondenceRecipientDetailsData.DepartmentName_EN, SecName_En : this.correspondenceRecipientDetailsData.SectionName_EN});
    this.recipientDetailsForm.get('RecipientName').setValue(this.correspondenceRecipientDetailsData.Name_EN);
    this.senderDetailsForm.get('SenderName').setValue(this.correspondenceSenderDetailsData.Name_EN);
    this.senderDetailsForm.get('SenderDepartment').setValue(this.correspondenceSenderDetailsData.SenderDepartment);
    this.senderDetailsForm.get('ExternalOrganization').setValue({OrgName_En : this.correspondenceSenderDetailsData.OrganizationName_EN});
     // tslint:disable-next-line: max-line-length
    this.correspondenceDetailsForm.get('priority').setValue({EN: this.getDefaultaValue('Priority', this.body.values.WorkflowForm_1x4x1x22)});
    this.correspondenceDetailsForm.get('confidential').setValue(this.body.values.WorkflowForm_1x4x1x78);
    this.correspondenceDetailsForm.get('regDate').setValue(this.body.values.WorkflowForm_1x4x1x2);
    this.correspondenceDetailsForm.get('docsDate').setValue(this.body.values.WorkflowForm_1x4x1x124);
    this.correspondenceDetailsForm.get('refNumber').setValue(this.body.values.WorkflowForm_1x4x1x28);
    this.correspondenceDetailsForm.get('personalName').setValue(this.body.values.WorkflowForm_1x4x1x88);
    this.correspondenceDetailsForm.get('idNumber').setValue(this.body.values.WorkflowForm_1x4x1x27);
    // tslint:disable-next-line: max-line-length
    this.correspondenceDetailsForm.get('correspondenceType').setValue({EN: this.getDefaultaValue('CorrespondenceType', this.body.values.WorkflowForm_1x4x1x30)});
    // tslint:disable-next-line: max-line-length
    this.correspondenceDetailsForm.get('baseType').setValue({EN: this.getDefaultaValue('BaseType', this.body.values.WorkflowForm_1x4x1x29)});
    this.correspondenceDetailsForm.get('arabicSubject').setValue(this.body.values.WorkflowForm_1x4x1x35);
    this.correspondenceDetailsForm.get('englishSubject').setValue(this.body.values.WorkflowForm_1x4x1x36);
    this.correspondenceDetailsForm.get('projectCode').setValue(this.body.values.WorkflowForm_1x4x1x37);
    this.correspondenceDetailsForm.get('budgetNumber').setValue(this.body.values.WorkflowForm_1x4x1x38);
    this.correspondenceDetailsForm.get('contractNumber').setValue(this.body.values.WorkflowForm_1x4x1x40);
    this.correspondenceDetailsForm.get('tenderNumber').setValue(this.body.values.WorkflowForm_1x4x1x39);
    this.correspondenceDetailsForm.get('corrNumber').setValue(this.body.values.WorkflowForm_1x4x1x9);
    this.correspondenceDetailsForm.get('fillinPlanPath').setValue(this.body.values.WorkflowForm_1x4x1x133);
    this.correspondenceDetailsForm.get('staffNumber').setValue(this.body.values.WorkflowForm_1x4x1x41);
    this.correspondenceDetailsForm.get('dispatchMethod').setValue({EN: this.getDefaultaValue('DispatchMethod', this.body.values.WorkflowForm_1x4x1x49)});
  }

  getDefaultaValue(Attrname: string, ID: number): string {
    if ( ID === 0 ) {
      return '';
    } else {
      let Name_EN: string;
      this.MetadataFilters.forEach(element => {
        if (element.AttrName === Attrname && element.ID === ID) {
          Name_EN = element.Name_EN;
        }
      });
      return Name_EN;
    }
  }

  setPopupCheckedValue(Attrname: string, Name_EN: string): number {
    let ID = 0;
    this.MetadataFilters.forEach(element => {
      if (element.AttrName === Attrname && element.Name_EN === Name_EN) {
        ID = element.ID;
        return ID;
      }
    });
    return ID;
  }

  submitCorrespondenceInfo(action: string) {
    this.makeFormObjectToSubmit(action);
      this.correspondenceDetailsService.submitCorrespondenceInfo(this.VolumeID, this.taskID, this.body)
      .subscribe(
        response => {
          if (action === 'TEST') {
            /* submits form but doesn't Send On */
            console.log(this.body.values);
          } else {
            this.sendOnCorrespondence();
          }
        },
        responseError => {
          this._errorHandlerFctsService.handleError(responseError).subscribe();
        }
      );
  }

  sendOnCorrespondence() {
    this.correspondenceDetailsService.sendOnCorrespondence(this.VolumeID, this.taskID)
    .subscribe(
      response => {
        // ?? needs to validate response if send on was correct
        this.backNavigation();
        console.log(response);
      },
      responseError => {
        this._errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }


  /*********************Transfer************************ */
/*   transferTabShowData() {
    this.getTransferHistoryData(this.VolumeID);
  }

  getTransferHistoryData(VolumeID: String): void {
    this.transferProgbar = true;
    this._correspondenceDetailsService.getTransferHistoryTab(VolumeID)
      .subscribe(transferhistorytabData => {
        this.transferhistorytabData = transferhistorytabData;
        this.transferProgbar = false;
      });
  } */
  /************************************************************* */

  getTempFolderAttachments(CorrFlowType): void {
    this.correspondenceDetailsService.createTempAttachments(CorrFlowType).subscribe(
      tempAttachment => {
        this.corrFolderData = tempAttachment;
        this.getCoverSection();
        this.getAttachmentSection();
      }
    );
  }

  getMetadataFilters(): void {
    this.correspondencservice
      .getDashboardFilters()
      .subscribe(
        MetadataFilters => {
          this.MetadataFilters = MetadataFilters;
          this.setCorrespondenceDetails();
        }
      );
  }

  public optionSelectionChangeExternal(orgInfo: OrgNameAutoFillModel, event: MatOptionSelectionChange) {
    this.ExtSenderInfo = orgInfo;
    this.updateSenderInfo();
  }

  public optionSelectionChangeInternal(DepInfo: OrgNameAutoFillModel, event: MatOptionSelectionChange) {
    this.IntRecipientInfo = DepInfo;
    this.updateRecipientInfo();
  }

  updateSenderInfo() {
    console.log(this.ExtSenderInfo);
    this.senderDetailsForm.get('SenderName').setValue(this.ExtSenderInfo.Name_En);
    this.senderDetailsForm.get('SenderDepartment').setValue(this.ExtSenderInfo.DepName_En);
    this.body.values.WorkflowForm_1x4x1x93 = this.ExtSenderInfo.OrgID.toString() !== '0' ? this.ExtSenderInfo.OrgID : '';
    this.body.values.WorkflowForm_1x4x1x11 = this.ExtSenderInfo.RecipientUserID.toString() !== '0' ? this.ExtSenderInfo.RecipientUserID : '';
    this.body.values.WorkflowForm_1x4x1x12 = this.ExtSenderInfo.NameID.toString() !== '0' ? this.ExtSenderInfo.NameID : '';
    this.body.values.WorkflowForm_1x4x1x13 = this.ExtSenderInfo.RecipientVersion.toString() !== '0' ? this.ExtSenderInfo.RecipientVersion : '';
    this.body.values.WorkflowForm_1x4x1x80 = this.ExtSenderInfo.DepID.toString() !== '0' ? this.ExtSenderInfo.DepID : '';
    this.body.values.WorkflowForm_1x4x1x81 = this.ExtSenderInfo.SecID.toString() !== '0' ? this.ExtSenderInfo.SecID : '';
    this.body.values.WorkflowForm_1x4x1x82 = this.ExtSenderInfo.RoleID.toString() !== '0' ? this.ExtSenderInfo.RoleID : '';
    this.body.values.WorkflowForm_1x4x1x88 = this.ExtSenderInfo.Name_En.toString() !== '0' ? this.ExtSenderInfo.Name_En : '';
  }

  updateRecipientInfo() {
    console.log(this.IntRecipientInfo);
    this.recipientDetailsForm.get('RecipientName').setValue(this.IntRecipientInfo.Name_En);
    this.body.values.WorkflowForm_1x4x1x14 = this.IntRecipientInfo.DepID.toString() !== '0' ? this.IntRecipientInfo.DepID : '';
    this.body.values.WorkflowForm_1x4x1x15 = this.IntRecipientInfo.RecipientUserID.toString() !== '0' ? this.IntRecipientInfo.RecipientUserID : '';
    this.body.values.WorkflowForm_1x4x1x16 = this.IntRecipientInfo.RecipientVersion.toString() !== '0' ? this.IntRecipientInfo.RecipientVersion : '';
    this.body.values.WorkflowForm_1x4x1x79 = this.IntRecipientInfo.Type.toString() !== '0' ? this.IntRecipientInfo.Type : '';
    this.body.values.WorkflowForm_1x4x1x83 = this.IntRecipientInfo.DepID.toString() !== '0' ? this.IntRecipientInfo.DepID : '';
    this.body.values.WorkflowForm_1x4x1x84 = this.IntRecipientInfo.SecID.toString() !== '0' ? this.IntRecipientInfo.SecID : '';
    this.body.values.WorkflowForm_1x4x1x85 = this.IntRecipientInfo.RoleID.toString() !== '0' ? this.IntRecipientInfo.RoleID : '';
    this.body.values.WorkflowForm_1x4x1x89 = this.IntRecipientInfo.DepName_En.toString() !== '0' ? this.IntRecipientInfo.DepName_En : '';
  }

  displaySearchFilterValueExt(searchList: OrgNameAutoFillModel) {
    if (searchList) { return searchList.OrgName_En; }
  }

  displaySearchFilterValueInt(searchList: OrgNameAutoFillModel) {
    if (searchList) { return searchList.DepName_En + ',' + searchList.SecName_En; }
  }

  expandeActionRightButton() {
    this.expandedRightAction = !this.expandedRightAction;
  }

  expandeActionLeftButton() {
    this.expandedAction = !this.expandedAction;
  }

  backNavigation() {
    this._location.back();
  }

  getUserInfo() {
    this.correspondenceDetailsService
      .GetUserInformation()
      .subscribe(userInfoVal =>
        this.userInfo = userInfoVal
      );
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.correspondenceDetailsForm.invalid) {
      return;
    }
    // console.log(JSON.stringify(this.correspondenceDetailsForm.value));
  }

  displayFn(attribute?: any): string | undefined {
    return attribute ? attribute.EN : undefined;
  }

  refreshCoverSection() {
    this.getCoverSection();
  }

  refreshAttachmentSection() {
    this.getAttachmentSection();
  }

  getCoverSection() {
    this.correspondenceDetailsService.getCoverFolderDetails(Number(this.correspondenceData.AttachCorrCoverID)).subscribe(
      coverFolderdetails => {
        this.externalIncCoverLetterData = coverFolderdetails;
        if (coverFolderdetails[0].myRows.length) {
          this.coverID = coverFolderdetails[0].myRows[0].Dataid;
          this.getCoverDocumentURL(this.coverID);
        }
      }
    );
  }

  getAttachmentSection() {
    this.correspondenceDetailsService.getAttachmentFolderDetails(Number(this.correspondenceData.AttachCorrAttachmentsID)).subscribe(
      attachmentFolderdetails => { this.externalAttachmentFolderData = attachmentFolderdetails; }
    );
  }

  getCoverDocumentURL(CoverID: String): void {
    this.showPreviewTreeArea = false;
    this.showPreviewCoverLetter = true;
    this.correspondenceDetailsService.getDocumentURL(CoverID)
      .subscribe(correspondenceCovertData => { this.documentPreviewURL = correspondenceCovertData; });
  }

  showActionProperties(dataID: string): void {
    this.correspondenceDetailsService.getDocumentPropertiesURL(dataID)
      .subscribe(correspondenceCovertData => this.documentPreviewURL = correspondenceCovertData);
  }

  showSenderData() {
    this.showPreviewTreeArea = true;
    this.selectedCaption = 'Sender';
    this.currentlyChecked = false;
    this.showPreviewCoverLetter = false;
    this.multiSelect = false;
    this.dataSource.data = this.organizationalChartData;
    this.CCOUID = [];
  }

  showRecipientData() {
    this.showPreviewTreeArea = true;
    this.selectedCaption = 'Recipient';
    this.currentlyChecked = false;
    this.showPreviewCoverLetter = false;
    this.multiSelect = false;
    this.dataSource.data = this.organizationalChartData;
    this.CCOUID = [];
  }

  showCCData() {
    this.showPreviewCoverLetter = false;
    this.showPreviewTreeArea = true;
    this.selectedCaption = 'CC';
    this.currentlyChecked = false;
    this.showPreviewCoverLetter = false;
    this.multiSelect = true;
    this.dataSource.data = this.organizationalChartData;
    console.log(this.dataSource.data);
  }

  getOrganizationalChartDetail(): void {
    this.organizationalChartService.getOrgChartInternal()
      .subscribe(OrgChartResponse => {
        const myMap = new Map();
        for (const obj of OrgChartResponse) {
          let orgChartData: organizationalChartModel;
          orgChartData = obj;
          orgChartData.children = [];
          myMap[orgChartData.OUID] = orgChartData;
          const parent = orgChartData.Parent || '-';
          if (!myMap[parent]) {
            myMap[parent] = {
              children: []
            };
          }
          myMap[parent].children.push(orgChartData);
        }
        this.organizationalChartData = myMap['-1'].children;
        // this.treeControl.expand(this.organizationalChartData[0]);
      });
  }

  hasChild = (_number: number, node: organizationalChartModel) => !!node.children && node.children.length > 0;

  getEmplDetail(organizationalChartData: organizationalChartModel): void {
    this.showEmplChartData = organizationalChartData;
  }

  getOrgSelectDetail(organizationalChartData: organizationalChartModel) {
    this.showOrgChartData = organizationalChartData;

  }

  addRecipient() {
  }

  searchTreeValue(organizationalChartSearch: string) {
    alert(organizationalChartSearch);
  }

  getSearchValue(value: string) {
    this.value = value;
  }

  selectSinglCheckbox(organizationalChartData: organizationalChartModel, e: MatCheckboxChange) {
    if (this.multiSelect) {
      if (e.checked) {
        if (this.CCOUID.lastIndexOf(organizationalChartData) === -1) {
          this.CCOUID.push(organizationalChartData);
        }
      } else {
        this.CCOUID.splice(this.CCOUID.lastIndexOf(organizationalChartData), 1);
      }
    } else {
      this.currentlyChecked = organizationalChartData;
    }
  }

  getSelectedIntDepartment() {
    if (this.selectedCaption === 'Recipient') {
      this.correspondenceDetailsService.searchFieldForAutoFillOUID(this.currentlyChecked.OUID, 'IntDepartmentOUID', '').subscribe(
        DepInfo => {
          this.IntRecipientInfo = DepInfo[0];
          this.recipientDetailsForm.get('RecipientDepartment').setValue(DepInfo[0]);
        }
      );
    } else if (this.selectedCaption === 'CC') {
      const a = new Array();
      this.CCOUID.forEach(function (obj) {
        a.push(obj.OUID);
      });
      this.correspondenceDetailsService.getCCUserDetailsSet(a.toString(), 'ccDepartments', 'Incoming').subscribe(
        ccDepInfo => {
          console.log(ccDepInfo);
          for (const obj of ccDepInfo) {
            this.addCC(obj);
          }
        }
      );
    }

  }

  uploadCSDocument(files: File[], parentID: number, sectionName: any) {
    this.csdocumentupload.uploadDocument(files, '' + parentID).subscribe(
      () => '',
      () => '',
      () => {
        if (sectionName === 'COVER') {
          this.getCoverSection();
        } else if (sectionName === 'ATTACHMENT') {
          this.getAttachmentSection();
        } else if (sectionName === 'MISC') {
        }
      }
    );
  }

  public dropped(files: NgxFileDropEntry[], parentID: string, section: string) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.csdocumentupload.dragandDropUpload(file, parentID).subscribe(
            () => '',
            () => '',
            () => {
              if (section === 'COVER') {
                this.getCoverSection();
              } else if (section === 'ATTACHMENT') {
                this.getAttachmentSection();
              } else if (section === 'MISC') {
                // this.GetMiscSection();
              }
            }
          );
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        // console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event) {

  }

  public fileLeave(event) {

  }

   // check if needed on WF Step
  GenerateBarcode() {
    if (this.correspondenceDetailsForm.invalid) {
      alert('Fill in Manadatory Corr Details');
    } else if (this.senderDetailsForm.invalid) {
      alert('Fill In Mandatory Sender Information');
    } else if (this.recipientDetailsForm.invalid) {
      alert('Fill In Mandatory Recipient Information');
    } else {
      this.correspondenceDetailsService.getCorredpondenceBarcode(this.corrFolderData.AttachCorrID, 'Incoming', new Date().getFullYear()).subscribe(
        barcodeVal => {
          this.correspondenceDetailsForm.get('corrNumber').setValue(barcodeVal.CorrespondenceCode);
          this.showSendOnButtons();
        }
      );
    }
  }



  getIDVal(attributeObj: any): string {
    if (typeof attributeObj === 'undefined') {
      return '';
    } else {
      return attributeObj.ID;
    }

  }
  showSendOnButtons() {
    this.showGeneratebarcodeButton = false;
    this.showSendOnButton = true;
  }

  SaveWF() {

  }

  clearDetails(clearFormName: string) {
    switch (clearFormName) {
      case 'senderDetailsForm':
        this.senderDetailsForm.get('ExternalOrganization').setValue('');
        this.senderDetailsForm.get('SenderDepartment').setValue('');
        this.senderDetailsForm.get('SenderName').setValue('');
        this.ExtSenderInfo = new OrgNameAutoFillModel();
        break;
      case 'recipientDetailsForm':
        this.recipientDetailsForm.get('RecipientID').setValue('');
        this.recipientDetailsForm.get('RecipientUserID').setValue('');
        this.recipientDetailsForm.get('RecipientVersion').setValue('');
        this.recipientDetailsForm.get('RecipientType').setValue('');
        this.recipientDetailsForm.get('RecipientDepartment').setValue('');
        this.recipientDetailsForm.get('RecipientSection').setValue('');
        this.recipientDetailsForm.get('RecipientName').setValue('');
        this.IntRecipientInfo = new OrgNameAutoFillModel();
        break;
      default:
        break;
    }
  }

}
