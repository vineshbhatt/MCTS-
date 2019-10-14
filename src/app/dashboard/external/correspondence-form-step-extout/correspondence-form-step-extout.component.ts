import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Observable } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';
import { MatOptionSelectionChange, MatCheckboxChange } from '@angular/material';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { DatePipe } from '@angular/common';
import { FCTSDashBoard } from '../../../../environments/environment';
import { OrgNameAutoFillModel, CorrespondenceFolderModel, CCUserSetModel, CorrespondenenceDetailsModel, CorrWFTaskInfoModel, SyncDocumentMetadataModel, ColUserSetModel } from 'src/app/dashboard/models/CorrespondenenceDetails.model';
import { CorrResponse, CorrespondenceFormData, SenderDetailsData, RecipientDetailsData, CommentsNode } from '../../services/correspondence-response.model';
import { organizationalChartModel, organizationalChartEmployeeModel } from 'src/app/dashboard/models/organizational-Chart.model';
import { DocumentPreview } from '../../services/documentpreview.model';
import { CorrespondenceWFFormModel } from '../../models/CorrepondenceWFFormModel';
import { MatDialog } from '@angular/material';
import { SendBackDialogComponent } from '../../dialog-boxes/send-back-dialog/send-back-dialog.component';

import { CorrespondenceDetailsService } from 'src/app/dashboard/services/correspondence-details.service';
import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { OrganizationalChartService } from 'src/app/dashboard/services/organizationalChart.service';
import { CSDocumentUploadService } from '../../services/CSDocumentUpload.service';
import { ErrorHandlerFctsService } from '../../services/error-handler-fcts.service';

import { ShowSections, ShowCorrItems, ShowWFButtons } from 'src/app/dashboard/external/correspondence-detail/correspondence-show-sections';
import { BaseCorrespondenceComponent } from '../../base-classes/base-correspondence-csactions/base-correspondence.component';
import { NotificationService } from '../../services/notification.service';
import { AppLoadConstService } from 'src/app/app-load-const.service';
import { CorrespondenceShareService } from '../../services/correspondence-share.service';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-correspondence-form-step-extout',
  templateUrl: './correspondence-form-step-extout.component.html',
  styleUrls: ['./correspondence-form-step-extout.component.scss']
})

export class CorrespondenceFormStepExtOutComponent extends BaseCorrespondenceComponent implements OnInit, AfterViewInit {

  constructor(
    public correspondenceDetailsService: CorrespondenceDetailsService
    , private _location: Location
    , private organizationalChartService: OrganizationalChartService
    , private formBuilder: FormBuilder
    , private correspondencservice: CorrespondenceService
    , public csdocumentupload: CSDocumentUploadService
    , private _correspondenceDetailsService: CorrespondenceDetailsService
    , public dialog: MatDialog
    , private route: ActivatedRoute
    , private appLoadConstService: AppLoadConstService
    , private correspondenceShareService: CorrespondenceShareService
    , private _errorHandlerFctsService: ErrorHandlerFctsService, private notificationmessage: NotificationService, private datePipe: DatePipe) { super(csdocumentupload, correspondenceDetailsService) }

  get f() { return this.correspondenceDetailsForm.controls; }

  basehref: String = FCTSDashBoard.BaseHref;
  CSUrl: String = FCTSDashBoard.CSUrl;
  globalConstants = this.appLoadConstService.getConstants();
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

  colDetailsForm: FormGroup;
  ColDetails: FormArray;


  submitted = false;
  CorrespondenceType: string;
  MetadataFilters: any[];
  CoverLetterData: CorrResponse[];
  AttachmentFolderData: CorrResponse[];

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
  colProgBar: boolean = false;
  //
  initiateIncomingCorrespondenceDetails = new CorrespondenceWFFormModel;

  showGeneratebarcodeButton = true;
  showSendOnButton = false;
  coverID: string;

  CCOUID: organizationalChartModel[] = [];
  CCEID: organizationalChartEmployeeModel[] = [];
  value = '';
  public files: NgxFileDropEntry[] = [];

  correspondenceData: CorrespondenenceDetailsModel;

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

  // UI elements show/hide
  stepUIData: any;
  sectionDisplay = new ShowSections();
  showCorrItems = new ShowCorrItems();
  showFields = new ShowCorrItems();
  showWFButtons: ShowWFButtons;
  skipDepSecratory: boolean = false;
  skipHOSSecratory: boolean = false;
  headOfSectionReview: boolean = false;
  HOSReviewOptions: string[] = ['Yes', 'No']
  DepApproverList: any[];
  HOSApproverList: any[];
  showTemplateArea: boolean = false;
  templatesDocList: any[];
  templateLanguage: string;
  corrFlowType: string;
  collaborationNotes: string;
  showNotesVal: boolean = false;
  taskTitle: string;
  body: CorrespondenceFormData = {
    action: 'formUpdate',
    values: {}
  };
  public name = '';
  employeeMap = new Map<number, organizationalChartEmployeeModel[]>();
  showempDetails = false;
  CCLoaded = false;
  CollaborationLoaded = false;

  corrTaskInfo: CorrWFTaskInfoModel;
  documentMetadataSync = new SyncDocumentMetadataModel;
  spinnerDataLoaded: boolean = false;

  @Input() data: number;
  @Output() focusOut: EventEmitter<number> = new EventEmitter<number>();
  viewNoteStatus;
  activeRowItem: any;
  editMode: any;
  Disposition1: string = '';
  Disposition2: string = '';
  Disposition3: string = '';

  barcodeNumberToPrint: string;
  barcodeDate = new Date().toLocaleDateString();
  returnReason: string;
  returnComment: string;

  ngOnInit() {


    this.VolumeID = this.route.snapshot.queryParamMap.get('VolumeID');
    this.CorrespondencType = this.route.snapshot.queryParamMap.get('CorrType');
    this.locationid = this.route.snapshot.queryParamMap.get('locationid');
    this.taskID = this.route.snapshot.queryParamMap.get('TaskID');

    this.corrFlowType = this.CorrespondencType;

    // Get Logged in user Information
    this.getUserInfo();

    //this.getCorrTaskInfo();
    this.getCorrespondenceSenderDetails();
    this.getCorrespondenceRecipientDetails();
    this.readCorrespondenceInfo();
    this.RefreshRecord();
    this.stepUIData = this.toShowWFButtons(this.taskID);
    this.showWFButtons = this.stepUIData.ShowButtons;
    this.sectionDisplay = this.stepUIData.ShowSections;
    this.showFields = this.stepUIData.ShowFields;

    //this.sectionDisplay.ShowCorrSectionWF();


    this.senderDetailsForm = this.formBuilder.group({
      SenderInfo: ['', Validators.required]
    });


    this.recipientDetailsForm = this.formBuilder.group({
      ExternalOrganization: ['', Validators.required],
      RecipientDepartment: [],
      RecipientName: []
    });

    this.ccDetailsForm = this.formBuilder.group({
      CCDetails: this.formBuilder.array([])
    });

    this.colDetailsForm = this.formBuilder.group({
      ColDetails: this.formBuilder.array([])
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
      obType: new FormControl({ value: '', disabled: !this.showCorrItems.obType.Modify }),
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
      skipDepSecratory: new FormControl({ value: '', disabled: !this.showCorrItems.staffNumber.Modify }),
      Approver: new FormControl({ value: '', disabled: !this.showCorrItems.staffNumber.Modify }),
      HOSReviewRequired: new FormControl({ value: '', disabled: !this.showCorrItems.staffNumber.Modify }),
      skipHOSecratory: new FormControl({ value: '', disabled: !this.showCorrItems.staffNumber.Modify }),
      HOSApprover: new FormControl({ value: '', disabled: !this.showCorrItems.staffNumber.Modify }),
    });

    this.filteredExtOrgNames = this.recipientDetailsForm.get('ExternalOrganization').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value =>
          this.correspondenceDetailsService.searchFieldForAutoFill(value, 'ExtOrganization', '')
        )
      );
  }

  ngAfterViewInit() {
    this.getOrganizationalChartDetail();

  }

  ReadRecord(locationid: string, transid: string) {
    this.correspondenceDetailsService
      .getCorrRecord(locationid, transid, CSConfig.globaluserid)
      .subscribe(correspondenceData => {
        this.correspondenceData = correspondenceData[0];
        this.corrFolderData = new CorrespondenceFolderModel;
        this.corrFolderData.AttachCorrAttachmentsID = Number(this.correspondenceData.AttachCorrAttachmentsID);
        this.corrFolderData.AttachCorrCoverID = Number(this.correspondenceData.AttachCorrCoverID);
        this.corrFolderData.AttachCorrID = Number(this.correspondenceData.AttachCorrID);
        this.corrFolderData.AttachCorrMiscID = Number(this.correspondenceData.AttachCorrMiscID);
        this.getCoverSection();

      });
  }

  RefreshRecord() {
    this.ReadRecord(this.locationid, '0');
  }

  getCorrespondenceSenderDetails(): void {
    this.spinnerDataLoaded = true;
    this._correspondenceDetailsService
      .getCorrespondenceSenderDetails(this.VolumeID, this.CorrespondencType, false, '')
      .subscribe(
        correspondenceSenderDetailsData => {
          if ((typeof correspondenceSenderDetailsData[0].myRows !== 'undefined') && correspondenceSenderDetailsData[0].myRows.length > 0) {
            this.correspondenceSenderDetailsData = correspondenceSenderDetailsData[0].myRows[0];
            this.senderDetailsForm.get('SenderInfo').setValue(this.correspondenceSenderDetailsData);
          }
        },
        responseError => {
          this._errorHandlerFctsService.handleError(responseError).subscribe();
        }
      );
  }

  getCorrespondenceRecipientDetails(): void {
    this._correspondenceDetailsService
      .getCorrespondenceRecipientDetails(this.VolumeID, this.CorrespondencType)
      .subscribe(

        correspondenceRecipientDetailsData => {
          debugger;
          if ((typeof correspondenceRecipientDetailsData[0].myRows !== 'undefined') && correspondenceRecipientDetailsData[0].myRows.length > 0) {
            this.correspondenceRecipientDetailsData = correspondenceRecipientDetailsData[0].myRows[0];
            this.recipientDetailsForm.get('RecipientName').setValue(this.correspondenceRecipientDetailsData.Name_EN);
            this.recipientDetailsForm.get('RecipientDepartment').setValue(this.correspondenceRecipientDetailsData.DepartmentName_EN);
            this.recipientDetailsForm.get('ExternalOrganization').setValue({ OrgName_En: this.correspondenceRecipientDetailsData.OrganizationName_EN });
          }
          this.spinnerDataLoaded = false;
        },
        responseError => {
          this._errorHandlerFctsService.handleError(responseError).subscribe();
        }
      );
  }

  ccShowData() {
    this.getCorrespondenceCCDetail(this.VolumeID, this.CorrespondencType);
  }

  getCorrespondenceCCDetail(VolumeID: String, CorrFlowType: String): void {
    if (!this.CCLoaded) {
      this.ccProgbar = true;
      this._correspondenceDetailsService.getCorrespondenceCCDetail(VolumeID, CorrFlowType)
        .subscribe(correspondenceCCtData => {
          this.correspondenceCCtData = correspondenceCCtData;
          this.ccProgbar = false;
          this.CCLoaded = true;
          for (const obj of this.correspondenceCCtData[0].myRows) {
            if (obj.CCUserID > 0) {
              this.addCC(obj);
            }
          }
        });
    }
  }

  addCC(depDetails: CCUserSetModel): void {
    this.CCDetails = this.ccDetailsForm.get('CCDetails') as FormArray;
    this.CCDetails.push(this.createNewCC(depDetails));
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
    this.CCDetails = this.ccDetailsForm.get('CCDetails') as FormArray;
    this.CCDetails.removeAt(index);
  }

  collaborationShowData() {
    this.getCorrespondenceCollaborationData();
  }

  getCorrespondenceCollaborationData(): void {
    if (!this.CollaborationLoaded) {
      this.colProgBar = true;
      this._correspondenceDetailsService.getCorrespondenceCollaborationInfoRO(this.VolumeID, this.CorrespondencType)
        .subscribe(correspondenceCollaborationDetail => {
          this.correspondenceCollaborationDetail = correspondenceCollaborationDetail;
          this.colProgBar = false;
          this.CollaborationLoaded = true;
          for (const obj of this.correspondenceCollaborationDetail[0].myRows) {
            if (obj.UserColl_User > 0) {
              this.addCollaboator(obj);
            }
          }
        });
    }
  }
  //Collaboration Actions
  addCollaboator(depDetails: ColUserSetModel): void {
    this.ColDetails = this.colDetailsForm.get('ColDetails') as FormArray;
    this.ColDetails.push(this.createNewCollaboator(depDetails));

  }
  createNewCollaboator(empDetails: ColUserSetModel): FormGroup {

    return this.formBuilder.group({
      UserColl_User: empDetails.UserColl_User,
      UserColl_Type: empDetails.UserColl_Type,
      UserColl_Purpose: empDetails.UserColl_Purpose,
      UserColl_Priority: empDetails.UserColl_Priority,
      UserColl_DueDate: this.datePipe.transform(new Date(empDetails.UserColl_DueDate), 'full'),
      UserColl_Notes: empDetails.UserColl_Notes,
      UserColl_FurtherAction: empDetails.UserColl_FurtherAction,
      UserColl_Status: empDetails.UserColl_Status,
      Name_EN: empDetails.Name_EN,
      Name_AR: empDetails.Name_AR,
      DepartmentName_EN: empDetails.DepartmentName_EN,
      DepartmentName_AR: empDetails.DepartmentName_AR,
      Purpose_EN: empDetails.Purpose_EN,
      Purpose_AR: empDetails.Purpose_AR,
      Status_EN: empDetails.Status_EN,
      Status_AR: empDetails.Status_AR
    });
  }

  removeCollaboator(index: number) {
    this.ColDetails = this.colDetailsForm.get('ColDetails') as FormArray;
    this.ColDetails.removeAt(index);
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
          this.taskTitle = response.data.title;
          this.getMetadataFilters();
        }
      },
      responseError => {
        this._errorHandlerFctsService.handleError(responseError).subscribe();
      },
      () => {

      }

    );
  }
  makeFormObjectToSubmit(action: string) {
    this.body.values.WorkflowForm_1x4x1x22 = this.setPopupCheckedValue('Priority', this.correspondenceDetailsForm.get('priority').value.EN);
    this.body.values.WorkflowForm_1x4x1x78 = this.correspondenceDetailsForm.get('confidential').value;
    this.body.values.WorkflowForm_1x4x1x88 = this.correspondenceDetailsForm.get('personalName').value;
    this.body.values.WorkflowForm_1x4x1x27 = this.correspondenceDetailsForm.get('idNumber').value;
    this.body.values.WorkflowForm_1x4x1x30 = this.setPopupCheckedValue('CorrespondenceType', this.correspondenceDetailsForm.get('correspondenceType').value.EN);
    this.body.values.WorkflowForm_1x4x1x31 = this.setPopupCheckedValue('OBDocumentType', this.correspondenceDetailsForm.get('obType').value.EN);
    this.body.values.WorkflowForm_1x4x1x35 = this.correspondenceDetailsForm.get('arabicSubject').value;
    this.body.values.WorkflowForm_1x4x1x36 = this.correspondenceDetailsForm.get('englishSubject').value;
    this.body.values.WorkflowForm_1x4x1x129 = this.correspondenceDetailsForm.get('skipDepSecratory').value;
    this.body.values.WorkflowForm_1x4x1x87 = this.setPopupCheckedApproverValue('DepApprover', this.correspondenceDetailsForm.get('Approver').value.EN);
    this.body.values.WorkflowForm_1x4x1x26 = this.correspondenceDetailsForm.get('HOSReviewRequired').value;
    this.body.values.WorkflowForm_1x4x1x130 = this.correspondenceDetailsForm.get('skipHOSecratory').value;
    this.body.values.WorkflowForm_1x4x1x24 = this.setPopupCheckedApproverValue('HOSApprover', this.correspondenceDetailsForm.get('HOSApprover').value.EN);
    this.body.values.WorkflowForm_1x4x1x37 = this.correspondenceDetailsForm.get('projectCode').value;
    this.body.values.WorkflowForm_1x4x1x38 = this.correspondenceDetailsForm.get('budgetNumber').value;
    this.body.values.WorkflowForm_1x4x1x40 = this.correspondenceDetailsForm.get('contractNumber').value;
    this.body.values.WorkflowForm_1x4x1x29 = this.setPopupCheckedValue('BaseType', this.correspondenceDetailsForm.get('baseType').value.EN);
    this.body.values.WorkflowForm_1x4x1x39 = this.correspondenceDetailsForm.get('tenderNumber').value;
    this.body.values.WorkflowForm_1x4x1x41 = this.correspondenceDetailsForm.get('staffNumber').value;
    this.body.values.WorkflowForm_1x4x1x49 = this.setPopupCheckedValue('DispatchMethod', this.correspondenceDetailsForm.get('dispatchMethod').value.EN);

    let recipientDetails: OrgNameAutoFillModel = this.recipientDetailsForm.get('ExternalOrganization').value;
    this.body.values.WorkflowForm_1x4x1x93 = recipientDetails.OrgID;
    this.body.values.WorkflowForm_1x4x1x83 = recipientDetails.DepID;
    this.body.values.WorkflowForm_1x4x1x89 = this.recipientDetailsForm.get('RecipientName').value;


    this.body.values.WorkflowForm_1x4x1x61 = this.coverID;
    this.body.values.WorkflowForm_1x4x1x48 = this.templateLanguage;

    this.body.values.WorkflowForm_1x4x1x75 = this.Disposition1;
    this.body.values.WorkflowForm_1x4x1x76 = this.Disposition2;
    this.body.values.WorkflowForm_1x4x1x77 = this.Disposition3;

    if (this.CCLoaded) {
      this.getCCtoFormObject();
    }
    if (this.CollaborationLoaded) {
      this.getCollaborationtoFormObject();
    }

  }

  getCCtoFormObject() {
    this.body.values.WorkflowForm_1x4x1x17.splice(this.ccDetailsForm.get('CCDetails').value.length);
    for (let i = 0; i < this.ccDetailsForm.get('CCDetails').value.length; i++) {
      if (typeof this.body.values.WorkflowForm_1x4x1x17[i] === 'object') {
        this.body.values.WorkflowForm_1x4x1x17[i].WorkflowForm_1x4x1x17_x_18 = this.ccDetailsForm.get('CCDetails').value[i].DepID;
        this.body.values.WorkflowForm_1x4x1x17[i].WorkflowForm_1x4x1x17_x_19 = this.ccDetailsForm.get('CCDetails').value[i].Depversion;
      } else {
        this.body.values.WorkflowForm_1x4x1x17.push({
          WorkflowForm_1x4x1x17_x_18: this.ccDetailsForm.get('CCDetails').value[i].DepID,
          WorkflowForm_1x4x1x17_x_19: this.ccDetailsForm.get('CCDetails').value[i].Depversion,
          WorkflowForm_1x4x1x17_x_20: null, WorkflowForm_1x4x1x17_x_92: null
        });
      }
    }
  }
  getCollaborationtoFormObject() {
    this.body.values.WorkflowForm_1x4x1x110.splice(this.colDetailsForm.get('ColDetails').value.length);
    for (let i = 0; i < this.colDetailsForm.get('ColDetails').value.length; i++) {
      if (typeof this.body.values.WorkflowForm_1x4x1x110[i] === 'object') {
        this.body.values.WorkflowForm_1x4x1x110[i].WorkflowForm_1x4x1x110_x_111 = this.colDetailsForm.get('ColDetails').value[i].UserColl_User;
        this.body.values.WorkflowForm_1x4x1x110[i].WorkflowForm_1x4x1x110_x_121 = this.colDetailsForm.get('ColDetails').value[i].UserColl_Type;
        this.body.values.WorkflowForm_1x4x1x110[i].WorkflowForm_1x4x1x110_x_113 = this.colDetailsForm.get('ColDetails').value[i].UserColl_Purpose;
        this.body.values.WorkflowForm_1x4x1x110[i].WorkflowForm_1x4x1x110_x_115 = this.colDetailsForm.get('ColDetails').value[i].UserColl_DueDate;
        this.body.values.WorkflowForm_1x4x1x110[i].WorkflowForm_1x4x1x110_x_116 = this.colDetailsForm.get('ColDetails').value[i].UserColl_Notes;
        this.body.values.WorkflowForm_1x4x1x110[i].WorkflowForm_1x4x1x110_x_117 = this.colDetailsForm.get('ColDetails').value[i].UserColl_FurtherAction;


      } else {
        this.body.values.WorkflowForm_1x4x1x110.push({


          WorkflowForm_1x4x1x110_x_111: this.colDetailsForm.get('ColDetails').value[i].UserColl_User,
          WorkflowForm_1x4x1x110_x_121: this.colDetailsForm.get('ColDetails').value[i].UserColl_Type,
          WorkflowForm_1x4x1x110_x_113: this.colDetailsForm.get('ColDetails').value[i].UserColl_Purpose,
          WorkflowForm_1x4x1x110_x_115: this.colDetailsForm.get('ColDetails').value[i].UserColl_DueDate,
          WorkflowForm_1x4x1x110_x_116: this.colDetailsForm.get('ColDetails').value[i].UserColl_Notes,
          WorkflowForm_1x4x1x110_x_117: this.colDetailsForm.get('ColDetails').value[i].UserColl_FurtherAction


        });
      }
    }
  }

  setCorrespondenceDetails(): void {

    this.senderDetailsForm.get('SenderInfo').setValue(this.correspondenceSenderDetailsData);
    this.recipientDetailsForm.get('RecipientName').setValue(this.correspondenceRecipientDetailsData.Name_EN);
    this.recipientDetailsForm.get('RecipientDepartment').setValue(this.correspondenceRecipientDetailsData.DepartmentName_EN);
    this.recipientDetailsForm.get('ExternalOrganization').setValue({ OrgName_En: this.correspondenceRecipientDetailsData.OrganizationName_EN });


    this.correspondenceDetailsForm.get('confidential').setValue(this.body.values.WorkflowForm_1x4x1x78);
    if (this.body.values.WorkflowForm_1x4x1x78) {
      this.skipDepSecratory = true;
      this.skipHOSSecratory = true;
    }

    this.correspondenceDetailsForm.get('skipDepSecratory').setValue(this.body.values.WorkflowForm_1x4x1x129);

    if (this.body.values.WorkflowForm_1x4x1x129) {
      this.skipDepSecratory = true;
    }
    this.correspondenceDetailsForm.get('skipHOSecratory').setValue(this.body.values.WorkflowForm_1x4x1x130);
    if (this.body.values.WorkflowForm_1x4x1x130) {
      this.skipHOSSecratory = true;
    }
    if (this.body.values.WorkflowForm_1x4x1x26 == "Yes") {
      this.headOfSectionReview = true;
    }
    this.correspondenceDetailsForm.get('HOSReviewRequired').setValue(this.body.values.WorkflowForm_1x4x1x26);
    this.correspondenceDetailsForm.get('personalName').setValue(this.body.values.WorkflowForm_1x4x1x88);
    this.correspondenceDetailsForm.get('Approver').setValue({ EN: '' });
    this.correspondenceDetailsForm.get('HOSApprover').setValue({ EN: '' });
    this.correspondenceDetailsForm.get('priority').setValue({ EN: this.getDefaultaValue('Priority', this.body.values.WorkflowForm_1x4x1x22) });
    this.correspondenceDetailsForm.get('obType').setValue({ EN: this.getDefaultaValue('OBDocumentType', this.body.values.WorkflowForm_1x4x1x31) });
    this.correspondenceDetailsForm.get('regDate').setValue(this.body.values.WorkflowForm_1x4x1x2);
    this.correspondenceDetailsForm.get('docsDate').setValue(this.body.values.WorkflowForm_1x4x1x124);
    this.correspondenceDetailsForm.get('refNumber').setValue(this.body.values.WorkflowForm_1x4x1x28);
    this.correspondenceDetailsForm.get('personalName').setValue(this.body.values.WorkflowForm_1x4x1x88);
    this.correspondenceDetailsForm.get('idNumber').setValue(this.body.values.WorkflowForm_1x4x1x27);
    this.correspondenceDetailsForm.get('correspondenceType').setValue({ EN: this.getDefaultaValue('CorrespondenceType', this.body.values.WorkflowForm_1x4x1x30) });
    this.correspondenceDetailsForm.get('baseType').setValue({ EN: this.getDefaultaValue('BaseType', this.body.values.WorkflowForm_1x4x1x29) });
    this.correspondenceDetailsForm.get('arabicSubject').setValue(this.body.values.WorkflowForm_1x4x1x35);
    this.correspondenceDetailsForm.get('englishSubject').setValue(this.body.values.WorkflowForm_1x4x1x36);
    this.correspondenceDetailsForm.get('projectCode').setValue(this.body.values.WorkflowForm_1x4x1x37);
    this.correspondenceDetailsForm.get('budgetNumber').setValue(this.body.values.WorkflowForm_1x4x1x38);
    this.correspondenceDetailsForm.get('contractNumber').setValue(this.body.values.WorkflowForm_1x4x1x40);
    this.correspondenceDetailsForm.get('tenderNumber').setValue(this.body.values.WorkflowForm_1x4x1x39);
    this.correspondenceDetailsForm.get('corrNumber').setValue(this.body.values.WorkflowForm_1x4x1x9);
    this.correspondenceDetailsForm.get('fillinPlanPath').setValue(this.body.values.WorkflowForm_1x4x1x133);
    this.correspondenceDetailsForm.get('staffNumber').setValue(this.body.values.WorkflowForm_1x4x1x41);
    this.correspondenceDetailsForm.get('dispatchMethod').setValue({ EN: this.getDefaultaValue('DispatchMethod', this.body.values.WorkflowForm_1x4x1x49) });

    this.coverID = this.body.values.WorkflowForm_1x4x1x61;
    this.templateLanguage = this.body.values.WorkflowForm_1x4x1x48;

    this.Disposition1 = this.body.values.WorkflowForm_1x4x1x75;
    this.Disposition2 = this.body.values.WorkflowForm_1x4x1x76;
    this.Disposition3 = this.body.values.WorkflowForm_1x4x1x77;

    this.getCoverDocumentURL(this.body.values.WorkflowForm_1x4x1x61);

    this.getApprovers('qApprover_2_37');
    this.getApprovers('qApprover_2_33');

  }

  getApproverValue(Attrname: string, ID: number): string {
    if (ID === 0 || ID == null || ID == undefined) {
      return '';
    } else {
      let Name_EN: string;
      if (Attrname == 'DepApprover') {
        this.DepApproverList.forEach(element => {
          if (element.AttrName === Attrname && element.ID === ID) {
            Name_EN = element.Name_EN;
          }
        });
      }
      else if (Attrname == 'HOSApprover') {
        this.HOSApproverList.forEach(element => {
          if (element.AttrName === Attrname && element.ID === ID) {
            Name_EN = element.Name_EN;
          }
        });
      }
      return Name_EN;
    }
  }
  getDefaultaValue(Attrname: string, ID: number): string {
    if (ID === 0 || ID === null) {
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
  setPopupCheckedApproverValue(Attrname: string, Name_EN: string): string {

    let ID = 0;
    if (Name_EN === '' || Name_EN == null || Name_EN == undefined) {
      return '0';
    }
    else {
      if (Attrname == 'DepApprover') {
        this.DepApproverList.forEach(element => {
          if (element.AttrName === Attrname && element.Name_EN === Name_EN) {
            ID = element.ID;
            return ID;
          }
        });
      }
      else if (Attrname == 'HOSApprover') {
        this.HOSApproverList.forEach(element => {
          if (element.AttrName === Attrname && element.Name_EN === Name_EN) {
            ID = element.ID;
            return ID;
          }
        });
      }
    }
    return ID.toString();
  }
  SendOnCollaborators() {
   // TODO: send on Collaborators when Send ON
  }
  submitCorrespondenceAction(action: string) {
    //  set Disposition
    //  Do some actions
    //  validate
    //  Submit    

    switch (action) {
      case 'StartCollaboration':
        this.Disposition1 = 'StartCollaboration';
        if (this.taskID === '45') {
          this.SendOnCollaborators();
        }
        else if (this.taskID === '18') {
          this.Disposition3 = 'A2b';
        }
        else if (this.taskID === '15') {
          this.Disposition3 = 'A1b';
        }
        else {
          this.Disposition3 = 'E1b';
        }
        break;
      case 'Save':
        this.Disposition1 = 'Save';
        break;
      case 'SendOn':
        this.Disposition1 = 'SendOn';
        if (this.taskID === '3') {
          this.Disposition3 = '';
        }
        break;
      case 'CompleteCollaboration':
        //TODO
        break;
      case 'Wait':
        this.Disposition1 = 'Wait';
        break;
      case 'SendOnForApproval':
        this.Disposition1 = 'SendOn';
        if (this.taskID === '9') {
          this.body.values.WorkflowForm_1x4x1x96 = '2';
        }
        else if (this.taskID === '45') {
          this.SendOnCollaborators();
          this.Disposition3 = '1b';
          this.body.values.WorkflowForm_1x4x1x96 = '2';
        }
        break;
      case 'Approve':
        this.Disposition1 = 'SendOn';
        this.Disposition3 = 'E1b';
        break;
      case 'Reject':
        this.Disposition1 = 'Reject';
        switch (this.taskID) {
          case '13':
          case '17':
          case '21':
          case '3':
          case '93':
          case '5':
          case '95':
          case '98':
            this.Disposition3 = '1';
            this.body.values.WorkflowForm_1x4x1x96 = '1';
            break;
          case '15':
            this.Disposition3 = '2';
            this.body.values.WorkflowForm_1x4x1x96 = '1';
            break;
          case '18':
            this.Disposition3 = '1';
            this.body.values.WorkflowForm_1x4x1x96 = '1';
            break;
        }
        break;
      case 'Terminate':
        this.Disposition1 = 'Terminate';
        break;
      case 'Cancel':
        this.Disposition1 = 'Terminate';
        break;
      case 'SendBack':
        switch (this.taskID) {
          case '5':
            this.Disposition3 = '7';
            break;
          case '95':
            this.Disposition3 = '7';
            break;
          case '102':
            this.Disposition3 = '7';
            break;
        }
        break;
    }
    this.makeFormObjectToSubmit(action);
    this.spinnerDataLoaded = true;
    this.correspondenceDetailsService.submitCorrespondenceInfo(this.VolumeID, this.taskID, this.body)
      .subscribe(
        response => {
          if (action === '') {
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
  openSendBackDialog(action: string) {
    this.dialog.open(SendBackDialogComponent, {
      data: this.body.values.WorkflowForm_1x4x1x96,
      width: '100%',
      panelClass: 'sendBackDialogBoxClass',
      maxWidth: '30vw'
    })
      .afterClosed().subscribe(result => {
        if (result) {
          this.updateReturnReason(result.selectedID, result.selectedDescription, result.comment, action);
        }
      });
  }

  updateReturnReason(returnReason, returnDescription, comment, action) {
    this.returnReason = returnReason;
    this.returnComment = comment;
    const CommentObj: CommentsNode = {
      CommentText: returnDescription + ' - ' + comment,
      CreationDate: '',
      CreatorID: '',
      CreatorName_AR: '',
      CreatorName_EN: '',
      Deleted: '',
      ID: '',
      Private: '0',
      ReferenceID: this.VolumeID,
      ReferenceType: 'Workflow',
      ReplyAvailable: '',
      ReplyTo: '',
      Version: '',
      shortComment: '',
    };
    this.insertComment(CommentObj, this.taskID, action);
  }

  insertComment(CommentObj, taskID, action) {
    this.correspondenceShareService.setComment(CommentObj, taskID)
      .subscribe(response => {
        this.submitCorrespondenceAction(action);
      },
        responseError => {
          this._errorHandlerFctsService.handleError(responseError).subscribe();
        });
  }

  submitCorrespondenceInfo(action: string) {

    this.makeFormObjectToSubmit(action);
    this.correspondenceDetailsService.submitCorrespondenceInfo(this.VolumeID, this.taskID, this.body)
      .subscribe(
        response => {
          if (action === '') {
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
          this.spinnerDataLoaded = false;
          // ?? needs to validate response if send on was correct
          this.backNavigation();
        },
        responseError => {
          this._errorHandlerFctsService.handleError(responseError).subscribe();
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
    if (event.source.selected) {
      this.updateRecipientInfo();
    }
  }
  public optionSelectionChangeInternal(DepInfo: OrgNameAutoFillModel, event: MatOptionSelectionChange) {
    this.IntRecipientInfo = DepInfo;
    if (event.source.selected) {
      this.updateSenderInfo();
    }
  }

  updateSenderInfo() {
    this.recipientDetailsForm.get('SenderName').setValue(this.ExtSenderInfo.Name_En);
    this.senderDetailsForm.get('SenderDepartment').setValue(this.ExtSenderInfo.DepName_En);
    this.body.values.WorkflowForm_1x4x1x93 = this.ExtSenderInfo.OrgID;
    this.body.values.WorkflowForm_1x4x1x80 = this.ExtSenderInfo.DepID;
    this.body.values.WorkflowForm_1x4x1x88 = this.ExtSenderInfo.Name_En;
    this.correspondenceDetailsForm.get('personalName').setValue(this.ExtSenderInfo.Name_En);
  }

  updateRecipientInfo() {

    this.recipientDetailsForm.get('ExternalOrganization').setValue(this.ExtSenderInfo);
    this.recipientDetailsForm.get('RecipientDepartment').setValue(this.ExtSenderInfo.DepName_En);
    this.recipientDetailsForm.get('RecipientName').setValue(this.ExtSenderInfo.Name_En);
    this.body.values.WorkflowForm_1x4x1x93 = this.ExtSenderInfo.OrgID;
    this.body.values.WorkflowForm_1x4x1x83 = this.ExtSenderInfo.DepID;
    this.body.values.WorkflowForm_1x4x1x89 = this.ExtSenderInfo.Name_En;
    this.correspondenceDetailsForm.get('personalName').setValue(this.ExtSenderInfo.Name_En);
  }

  displaySearchFilterValueExt(searchList: OrgNameAutoFillModel) {
    if (searchList) { return searchList.OrgName_En; }
  }

  displaySearchFilterValueInt(searchList: OrgNameAutoFillModel) {
    if (searchList) { return searchList.DepName_En + (searchList.SecName_En === null ? '' : ', ' + searchList.SecName_En); }
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
  displayFn(attribute?: any): string | undefined {
    return attribute ? attribute.EN : undefined;
  }

  refreshCoverSection() {
    this.getCoverSection();
  }

  refreshAttachmentSection() {
    this.getAttachmentSection();
  }
  getCoverDocumentURL(CoverID: String): void {
    this.showPreviewTreeArea = false;
    this.showPreviewCoverLetter = true;
    this.showTemplateArea = false;
    this.correspondenceDetailsService.getDocumentURL(CoverID)
      .subscribe(correspondenceCovertData => {
        this.documentPreviewURL = correspondenceCovertData;
      });
  }
  showActionProperties(dataID: string): void {
    this.showPreviewTreeArea = false;
    this.showTemplateArea = false;
    this.showPreviewCoverLetter = true;
    this.correspondenceDetailsService.getDocumentPropertiesURL(dataID)
      .subscribe(correspondenceCovertData => this.documentPreviewURL = correspondenceCovertData);
  }

  showSenderData() {
    this.showPreviewTreeArea = true;
    this.selectedCaption = 'Sender'
    this.currentlyChecked = false;
    this.showPreviewCoverLetter = false;
    this.multiSelect = false;
    this.dataSource.data = this.organizationalChartData;
    this.CCOUID = [];
    this.CCEID = [];
    this.showTemplateArea = false;
  }
  showRecipientData() {
    this.showPreviewTreeArea = true;
    this.selectedCaption = 'Recipient'
    this.currentlyChecked = false;
    this.showPreviewCoverLetter = false;
    this.multiSelect = false;
    this.dataSource.data = this.organizationalChartData;
    this.CCEID = [];
    this.showTemplateArea = false;
  }
  showCCData() {

    this.showPreviewTreeArea = true;
    this.selectedCaption = 'CC'
    this.currentlyChecked = false;
    this.showPreviewCoverLetter = false;
    this.multiSelect = true;
    this.dataSource.data = this.organizationalChartData;
    this.showTemplateArea = false;
  }

  showCollaboartorData() {
    this.showPreviewTreeArea = true;
    this.selectedCaption = 'Collaboration'
    this.currentlyChecked = false;
    this.showPreviewCoverLetter = false;
    this.multiSelect = true;
    this.dataSource.data = this.organizationalChartData;
    this.showTemplateArea = false;

  }

  showTemplateSection() {

    this.showPreviewTreeArea = false;
    this.showPreviewCoverLetter = false;
    this.showTemplateArea = true;
    this.getTemplatesSectionData(this.corrFlowType, 'Default', '');
  }
  getOrganizationalChartDetail(): void {
    this.organizationalChartService.getOrgChartInternal()
      .subscribe(OrgChartResponse => {
        let myMap = new Map();
        for (let obj of OrgChartResponse) {
          let orgChartData: organizationalChartModel;
          orgChartData = obj;
          orgChartData.children = [];
          myMap[orgChartData.OUID] = orgChartData;
          let parent = orgChartData.Parent || '-';
          if (!myMap[parent]) {
            myMap[parent] = {
              children: []
            };
          }
          myMap[parent].children.push(orgChartData);
        }
        this.organizationalChartData = myMap['-1'].children;
        //this.treeControl.expand(this.organizationalChartData[0]);        
      });
  }
  hasChild = (_number: number, node: organizationalChartModel) => !!node.children && node.children.length > 0;
  getEmplDetail(organizationalChartData: organizationalChartModel): Map<number, organizationalChartEmployeeModel[]> {
    this.showempDetails = false;
    if (this.employeeMap.has(organizationalChartData.OUID)) {
      this.showempDetails = true;
      return this.employeeMap;
    }
    else {
      //get the List of Employees from an OUID and add to the Map
      this.organizationalChartService.getEmployeeListFromOUID(organizationalChartData.OUID).subscribe(
        emplist => {
          this.employeeMap.set(organizationalChartData.OUID, emplist);
          this.showempDetails = true;
        }, () => { },
        () => {

        }
      );
    }
  }
  getOrgSelectDetail(organizationalChartData: organizationalChartModel) {
    this.showOrgChartData = organizationalChartData;
  }
  addRecipient() {
  }
  searchTreeValue(organizationalChartSearch: string) {

  }

  getSearchValue(value: string) {
    //this.searchVal = value;
  }
  selectSinglCheckboxOrg(organizationalChartData: organizationalChartModel, e: MatCheckboxChange) {
    if (this.multiSelect) {
      if (e.checked) {
        if (this.CCOUID.lastIndexOf(organizationalChartData) === -1) {
          this.CCOUID.push(organizationalChartData);
        }
      }
      else {
        this.CCOUID.splice(this.CCOUID.lastIndexOf(organizationalChartData), 1);
      }
    }
    else {
      this.currentlyChecked = organizationalChartData;
    }
  }
  selectSinglCheckboxEmp(employeeChartData: organizationalChartEmployeeModel, e: MatCheckboxChange) {

    if (this.multiSelect) {
      if (e.checked) {
        if (this.CCEID.lastIndexOf(employeeChartData) === -1) {
          this.CCEID.push(employeeChartData);
        }
      }
      else {
        this.CCEID.splice(this.CCEID.lastIndexOf(employeeChartData), 1);
      }
    }
    else {
      this.currentlyChecked = employeeChartData;
    }
  }

  getSelectedIntDepartment() {
    if (this.selectedCaption === 'Recipient') {
      if (this.currentlyChecked.EID === undefined) {
        this.correspondenceDetailsService.searchFieldForAutoFillOUID(this.currentlyChecked.OUID, 'IntDepartmentOUID', '').subscribe(
          DepInfo => {
            this.IntRecipientInfo = DepInfo[0]
            this.recipientDetailsForm.get('RecipientDepartment').setValue(DepInfo[0])
          }
        )
      }
      else {
        this.correspondenceDetailsService.searchFieldForAutoFillOUID(this.currentlyChecked.EID, 'IntEmployeeEID', '').subscribe(
          EmpInfo => {
            this.IntRecipientInfo = EmpInfo[0]
            this.recipientDetailsForm.get('RecipientDepartment').setValue(EmpInfo[0])
          }
        )
      }
    }
    else if (this.selectedCaption === 'CC') {
      this.ccProgbar = true;
      this.ccDetailsForm = this.formBuilder.group({
        CCDetails: this.formBuilder.array([])
      });
      let orgArray = new Array();
      this.CCOUID.forEach(function (obj) {
        orgArray.push(obj.OUID);
      });

      let empArray = new Array();
      this.CCEID.forEach(function (obj) {
        empArray.push(obj.EID);
      });

      this.correspondenceDetailsService.getCCUserDetailsSet(orgArray.toString(), empArray.toString(), this.corrFlowType).subscribe(
        ccDepInfo => {
          for (let obj of ccDepInfo) {
            this.addCC(obj);
          }
          this.ccProgbar = false;
        }
      )
    }
    else if (this.selectedCaption === 'Collaboration') {
      this.colProgBar = true;
      this.colDetailsForm = this.formBuilder.group({
        ColDetails: this.formBuilder.array([])
      });

      let empArray = new Array();
      this.CCEID.forEach(function (obj) {
        empArray.push(obj.EID);
      });

      this.correspondenceDetailsService.getCollUserDetailsSet(empArray.toString(), this.corrFlowType).subscribe(
        colEmpInfo => {
          for (let obj of colEmpInfo) {
            this.addCollaboator(obj);
          }
          this.colProgBar = false;
        }
      )
    }
  }

  getIDVal(attributeObj: any): string {
    if (typeof attributeObj === 'undefined') {
      return '';
    } else {
      return attributeObj.ID;
    }

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
        this.recipientDetailsForm.get('ExternalOrganization').setValue('');
        this.recipientDetailsForm.get('RecipientDepartment').setValue('');
        this.recipientDetailsForm.get('RecipientName').setValue('');
        this.body.values.WorkflowForm_1x4x1x93 = null;
        this.body.values.WorkflowForm_1x4x1x83 = null;
        this.body.values.WorkflowForm_1x4x1x89 = null;
        this.ExtSenderInfo = new OrgNameAutoFillModel();
        break;
      default:
        break;
    }
  }

  getCorrTaskInfo() {
    this.correspondenceDetailsService.getCorrWFTaskInfo(this.VolumeID, this.taskID).subscribe(
      taskInfo => {
        this.corrTaskInfo = taskInfo;
      }
    )
  }

  skipDepSecrtoryChange(e: MatCheckboxChange) {
    if (e.checked) {
      this.skipDepSecratory = true;
      this.correspondenceDetailsForm.get('Approver').setValidators([Validators.required]);
    } else {
      this.skipDepSecratory = false;
      this.correspondenceDetailsForm.get('Approver').clearValidators();
    }
    this.correspondenceDetailsForm.get('Approver').updateValueAndValidity();
  }

  confidentialChange(e: MatCheckboxChange) {
    if (e.checked) {
      this.correspondenceDetailsForm.get('skipDepSecratory').setValue(true);
      this.correspondenceDetailsForm.get('skipHOSecratory').setValue(true);
      this.skipDepSecratory = true;
      this.skipHOSSecratory = true;
      this.correspondenceDetailsForm.get('Approver').setValidators([Validators.required]);
    }

  }

  headOfSectionReviewRequiredChange(e: MatOptionSelectionChange) {
    if (e.source.value === 'Yes') {
      this.headOfSectionReview = true;
    }
    else {
      this.headOfSectionReview = false;
      this.correspondenceDetailsForm.get('HOSApprover').clearValidators();
    }
    this.correspondenceDetailsForm.get('HOSApprover').updateValueAndValidity();
  }

  skipHOSSecratoryChange(e: MatCheckboxChange) {
    if (e.checked) {
      this.skipHOSSecratory = true;
      this.correspondenceDetailsForm.get('HOSApprover').setValidators([Validators.required]);
    }
    else {
      this.skipHOSSecratory = false;
      this.correspondenceDetailsForm.get('HOSApprover').clearValidators();

    }
    this.correspondenceDetailsForm.get('HOSApprover').updateValueAndValidity();
  }



  getApprovers(ApproverType: string) {
    this.correspondenceDetailsService
      .getApproverListRunningWF(ApproverType, this.VolumeID)
      .subscribe(
        ApproverList => {
          if (ApproverType === 'qApprover_2_37') {
            this.DepApproverList = ApproverList;
            this.correspondenceDetailsForm.get('Approver').setValue({ EN: this.getApproverValue('DepApprover', this.body.values.WorkflowForm_1x4x1x87) });
          }
          else if (ApproverType === 'qApprover_2_33') {
            this.HOSApproverList = ApproverList;
            this.correspondenceDetailsForm.get('HOSApprover').setValue({ EN: this.getApproverValue('HOSApprover', this.body.values.WorkflowForm_1x4x1x24) });
          }
        }
      );
  }

  syncCoverData() {
    this.documentMetadataSync.docFolderID = this.correspondenceData.AttachCorrCoverID.toString();
    this.documentMetadataSync.srcDocID = this.body.values.WorkflowForm_1x4x1x61;
    if (this.body.values.WorkflowForm_1x4x1x48 === 'EN') {
      let senderDetails: OrgNameAutoFillModel = this.senderDetailsForm.get('SenderInfo').value;
      this.documentMetadataSync.SenderOrganization = this.convertUndefindedOrNulltoemptyString(senderDetails.OrgName_En);
      this.documentMetadataSync.SenderDepartment = this.convertUndefindedOrNulltoemptyString(senderDetails.DepName_En + (senderDetails.SecName_En != null ? ("," + senderDetails.SecName_En) : ""))
      this.documentMetadataSync.SenderName = this.convertUndefindedOrNulltoemptyString(senderDetails.Name_En)
      let recipientDetails: OrgNameAutoFillModel = this.recipientDetailsForm.get('ExternalOrganization').value;
      this.documentMetadataSync.RecipientOrganization = this.convertUndefindedOrNulltoemptyString(recipientDetails.OrgName_En)
      this.documentMetadataSync.RecipientDepartment = this.convertUndefindedOrNulltoemptyString(recipientDetails.DepName_En) + (this.convertUndefindedOrNulltoemptyString(recipientDetails.SecName_En) ? "," + this.convertUndefindedOrNulltoemptyString(recipientDetails.SecName_En) : "");
      this.documentMetadataSync.RecipientRole = this.convertUndefindedOrNulltoemptyString(recipientDetails.RoleName_En)
      this.documentMetadataSync.RecipientName = this.convertUndefindedOrNulltoemptyString(this.recipientDetailsForm.get('RecipientName').value)
      this.documentMetadataSync.DATE = this.convertUndefindedOrNulltoemptyString(this.correspondenceDetailsForm.get('regDate').value)
      this.documentMetadataSync.SUBJECT = this.convertUndefindedOrNulltoemptyString(this.correspondenceDetailsForm.get('englishSubject').value)

    }
    else if (this.body.values.WorkflowForm_1x4x1x48 === 'AR') {

      let senderDetails: OrgNameAutoFillModel = this.senderDetailsForm.get('SenderInfo').value;
      this.documentMetadataSync.SenderOrganization = this.convertUndefindedOrNulltoemptyString(senderDetails.OrgName_Ar);
      this.documentMetadataSync.SenderDepartment = this.convertUndefindedOrNulltoemptyString(senderDetails.DepName_AR + (senderDetails.SecName_Ar != null ? ("," + senderDetails.SecName_Ar) : ""))
      this.documentMetadataSync.SenderName = this.convertUndefindedOrNulltoemptyString(senderDetails.Name_Ar)
      let recipientDetails: OrgNameAutoFillModel = this.recipientDetailsForm.get('ExternalOrganization').value
      this.documentMetadataSync.RecipientOrganization = this.convertUndefindedOrNulltoemptyString(recipientDetails.OrgName_Ar)
      this.documentMetadataSync.RecipientDepartment = this.convertUndefindedOrNulltoemptyString(recipientDetails.DepName_AR) + (this.convertUndefindedOrNulltoemptyString(recipientDetails.SecName_Ar) ? "," + this.convertUndefindedOrNulltoemptyString(recipientDetails.SecName_Ar) : "");
      this.documentMetadataSync.RecipientRole = this.convertUndefindedOrNulltoemptyString(recipientDetails.RoleName_Ar)
      this.documentMetadataSync.RecipientName = this.convertUndefindedOrNulltoemptyString(this.recipientDetailsForm.get('RecipientName').value)
      this.documentMetadataSync.DATE = this.convertUndefindedOrNulltoemptyString(this.correspondenceDetailsForm.get('regDate').value)
      this.documentMetadataSync.SUBJECT = this.convertUndefindedOrNulltoemptyString(this.correspondenceDetailsForm.get('arabicsubject').value)
    }

    this.correspondenceDetailsService.syncDocumentMetadata(this.documentMetadataSync)
      .subscribe(
        () => { },
        () => { },
        () => { this.getCoverSection(); }
      );
  }

  importLettertoCoverFolder(templateDataID: string, language: string) {
    //Check Child Count    
    if (this.coverID == undefined || this.coverID == null) {
      const newFileName = this.CorrespondencType + ' ' + 'Cover Template';
      this.csdocumentupload.copyDocToCoverFolder(templateDataID, Number(this.correspondenceData.AttachCorrCoverID), newFileName).subscribe(
        response => {
          this.coverID = response.id;
          this.setLanguage(language)
        },
        () => { },
        () => {
          this.syncCoverData();
        }
      );
    }
    else {
      this.notificationmessage.warning('Cover Document Already Available', 'Kindly delete the existing document to upload new one', 2500);
    }
  }
  setLanguage(language: string) {
    switch (language.toUpperCase()) {
      case 'ENGLISH':
        this.templateLanguage = 'EN';
        break;
      case 'ARABIC':
        this.templateLanguage = 'AR';
        break;

    }
  }

  //Notes Area
  viewLastNote(selectItemRow: number, noteID: string) {
    this.showNotesVal = false;
    this.collaborationNotes = '';
    this.activeRowItem = selectItemRow;
    this.editMode = false;
    this.correspondenceDetailsService.getNotesText(noteID, this.VolumeID)
      .subscribe(
        notes => {
          for (let note of notes) {
            this.collaborationNotes = note.NoteText;
          }
          this.showNotesVal = true;
        },
        () => { },
        () => { }
      );
  }
  closeLastNote(selectItemRow: number) {
    this.activeRowItem = ' ';
    this.editMode = false;
  }

  viewLastNoteEdit(editItem, noteID: string) {
    this.editMode = true;
  }

  toShowWFButtons(taskID: string): any {
    debugger;
    let WFStepsUI: any;
    if (this.CorrespondencType === 'Incoming') {
      WFStepsUI = this.globalConstants.WFStepsUI.Incoming;
    } else if (this.CorrespondencType === 'Outgoing') {
      WFStepsUI = this.globalConstants.WFStepsUI.Outgoing;
    } else if (this.CorrespondencType === 'Internal') {
      WFStepsUI = this.globalConstants.WFStepsUI.Internal;
    }
    let tmpObj: any;
    WFStepsUI.forEach(function (taskObj) {
      if (taskID === taskObj.TaskID) {
        tmpObj = taskObj;
      }
    });
    return tmpObj;
  }
}
