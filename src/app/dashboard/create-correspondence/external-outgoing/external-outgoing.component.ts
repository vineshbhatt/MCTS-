import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { OrgNameAutoFillModel, CCUserSetModel, ColUserSetModel } from 'src/app/dashboard/models/CorrespondenenceDetails.model';
import { OrganizationalChartService } from 'src/app/dashboard/services/organizationalChart.service';
import { organizationalChartModel, organizationalChartEmployeeModel } from 'src/app/dashboard/models/organizational-Chart.model';
import { Location } from '@angular/common'
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree'
import { Observable } from 'rxjs';
import { FCTSDashBoard } from '../../../../environments/environment';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { switchMap, debounceTime } from 'rxjs/operators';
import { MatOptionSelectionChange, MatCheckboxChange } from '@angular/material';
import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { DocumentPreview } from '../../services/documentpreview.model';
import { CorrespondenceWFFormModel } from '../../models/CorrepondenceWFFormModel';
import { NotificationService } from '../../services/notification.service';
import { BaseCorrespondenceComponent } from '../../base-classes/base-correspondence-csactions/base-correspondence.component';
import { CorrespondenceDetailsService } from 'src/app/dashboard/services/correspondence-details.service';
import { CSDocumentUploadService } from '../../services/CSDocumentUpload.service'




@Component({
  selector: 'new-external-outgoing',
  templateUrl: './external-outgoing.component.html',
  styleUrls: ['./external-outgoing.component.scss']
})


export class ExternalOutgoing extends BaseCorrespondenceComponent implements OnInit, AfterViewInit {


  corrFlowType: string = 'Outgoing'
  basehref: String = FCTSDashBoard.BaseHref;
  CSUrl: String = FCTSDashBoard.CSUrl;
  expandedRightAction: boolean = true;
  expandedAction: boolean = true;

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


  //
  initiateOutgoingCorrespondenceDetails = new CorrespondenceWFFormModel;

  showGeneratebarcodeButton: boolean = true;
  showSendOnButton: boolean = false;


  CCOUID: organizationalChartModel[] = [];
  CCEID: organizationalChartEmployeeModel[] = [];

  barcodeNumberToPrint: string = "";
  barcodeDate: string = "";
  initiatorMailroomPrivelage: number = 0;
  searchVal: string = '';
  ccProgbar = false;
  colProgBar = false;
  showempDetails: boolean = false;
  employeeMap = new Map<number, organizationalChartEmployeeModel[]>();
  employeeForOUID: organizationalChartEmployeeModel[] = [];

  //
  skipDepSecratory: boolean = false;
  headOfSectionReview: boolean = false;
  skipHOSSecratory: boolean = false;

  HOSReviewOptions: string[] = ['Yes', 'No']
  DepApproverList: any[];
  HOSApproverList: any[];
  showTemplateArea: boolean = false;
  templatesDocList: any[];
  templateLanguage: string;

  //
  @Input() data: number;
  @Output() focusOut: EventEmitter<number> = new EventEmitter<number>();
  viewNoteStatus;
  activeRowItem: any;
  editMode: any;
  viewLastNote(selectItemRow: number) {
    this.activeRowItem = selectItemRow;
    this.editMode = false;
  }
  closeLastNote() {
    this.activeRowItem = ' ';
    this.editMode = false;
  }
  viewLastNoteEdit(editItem) {
    this.editMode = true;
  }

  constructor(private _location: Location,
    private organizationalChartService: OrganizationalChartService, private formBuilder: FormBuilder,
    private correspondencservice: CorrespondenceService,
    private notificationmessage: NotificationService,
    public csdocumentupload: CSDocumentUploadService, public correspondenceDetailsService: CorrespondenceDetailsService) {
    super(csdocumentupload, correspondenceDetailsService)
  }
  ngOnInit() {
    //Get Logged in user Information
    this.getSenderUserInfromation('', this.corrFlowType);
    this.getOrganizationalChartDetail();
    this.getMetadataFilters();


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
      regDate: new FormControl({ value: new Date().toLocaleDateString(), disabled: true }),
      priority: [],
      confidential: [],
      personalName: [],
      idNumber: [],
      correspondenceType: [],
      obType: [],
      arabicSubject: ['', Validators.required],
      englishSubject: ['', Validators.required],
      skipDepSecratory: [],
      Approver: [],
      HOSReviewRequired: [],
      skipHOSecratory: [],
      HOSApprover: [],
      projectCode: [],
      budgetNumber: [],
      contractNumber: [],
      tenderNumber: [],
      fillinPlanPath: [],
      dispatchMethod: [],
      staffNumber: []
    });
    this.correspondenceDetailsForm.get('HOSReviewRequired').setValue("No");

    this.filteredExtOrgNames = this.recipientDetailsForm.get('ExternalOrganization').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value =>
          this.correspondenceDetailsService.searchFieldForAutoFill(value, 'ExtOrganization', '')
        )
      );
  }
  ngAfterViewInit() {
    this.getTempFolderAttachments(this.corrFlowType);
    this.getApprovers('iApprover_2_37');
    this.getApprovers('iApprover_2_33');

  }

  getMetadataFilters(): void {
    this.correspondencservice
      .getDashboardFilters()
      .subscribe(
        (MetadataFilters: any[]) => (this.MetadataFilters = MetadataFilters)
      );
  }

  public optionSelectionChangeExternal(orgInfo: OrgNameAutoFillModel, event: MatOptionSelectionChange) {
    this.ExtSenderInfo = orgInfo;
  }
  public optionSelectionChangeInternal(DepInfo: OrgNameAutoFillModel, event: MatOptionSelectionChange) {
    this.IntRecipientInfo = DepInfo;
  }
  displaySearchFilterValueExt(searchList: OrgNameAutoFillModel) {

    if (searchList) { return searchList.OrgName_En; }
  }
  displaySearchFilterValueInt(searchList: OrgNameAutoFillModel) {
    if (searchList) {
      return searchList.DepName_En + (searchList.SecName_En != null ? (',' + searchList.SecName_En) : "")
    }
  }


  expandeActionRightButton() {
    this.expandedRightAction = !this.expandedRightAction;
  }
  expandeActionLeftButton() {
    this.expandedAction = !this.expandedAction;
  }
  backNavigation() {
    this._location.back()
  }

  get f() { return this.correspondenceDetailsForm.controls; }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.correspondenceDetailsForm.invalid) {
      return;
    }
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
    this.showTemplateArea = false;
    this.showPreviewCoverLetter = true;
    this.correspondenceDetailsService.getDocumentURL(CoverID)
      .subscribe(correspondenceCovertData => this.documentPreviewURL = correspondenceCovertData);
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
    alert(organizationalChartSearch);
  }

  getSearchValue(value: string) {
    this.searchVal = value;
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
  validateCorrespondenceForm(): boolean {
    let isValid = false;
    if (this.correspondenceDetailsForm.invalid) {
      this.notificationmessage.warning('Correspondence details missing', 'Please fill in mandatory correspondence information', 3000);
      return isValid;
    }
    if (this.senderDetailsForm.invalid) {
      this.notificationmessage.warning('Sender is missing', 'Kinldy add your account to FCTS user organization user list', 3000);
      return isValid;
    }
    if (this.recipientDetailsForm.invalid) {
      this.notificationmessage.warning('Recipient Information Missing', 'Kinldy select  the recipient for this correspondence', 3000);
      return isValid;
    }
    if (this.correspondenceDetailsForm.get('skipDepSecratory').value == true && this.correspondenceDetailsForm.get('Approver').value == null) {
      this.notificationmessage.warning('Aprrover is Mandatory', 'Kinldy choose the Approver', 3000);
      return isValid;
    }
    return true;
  }
  initiateWFCorrespondence(Disposition1: string, Disposition2: string, Dispostion3: string) {
    //Set each and every Value ofr the three Forms to one Single Object For Post
    this.initiateOutgoingCorrespondenceDetails.CorrespondenceID = this.corrFolderData.AttachCorrID.toString();
    this.initiateOutgoingCorrespondenceDetails.SenderDetails = this.userInfo[0].myRows[0]

    this.initiateOutgoingCorrespondenceDetails.RecipientDetails = this.recipientDetailsForm.get('ExternalOrganization').value;
    this.initiateOutgoingCorrespondenceDetails.RecipientName = this.recipientDetailsForm.get('RecipientName').value;

    this.initiateOutgoingCorrespondenceDetails.CCSet = this.ccDetailsForm.get('CCDetails').value;
    this.initiateOutgoingCorrespondenceDetails.UserCollSet = this.colDetailsForm.get('ColDetails').value;

    this.initiateOutgoingCorrespondenceDetails.ArabicSubject = this.correspondenceDetailsForm.get('arabicSubject').value;
    this.initiateOutgoingCorrespondenceDetails.EnglishSubject = this.correspondenceDetailsForm.get('englishSubject').value;

    this.initiateOutgoingCorrespondenceDetails.DocumentType = this.getIDVal(this.correspondenceDetailsForm.get('obType').value);
    this.initiateOutgoingCorrespondenceDetails.ProjectCode = this.correspondenceDetailsForm.get('projectCode').value;
    this.initiateOutgoingCorrespondenceDetails.BudgetNumber = this.correspondenceDetailsForm.get('budgetNumber').value;
    this.initiateOutgoingCorrespondenceDetails.TenderNumber = this.correspondenceDetailsForm.get('tenderNumber').value;
    this.initiateOutgoingCorrespondenceDetails.ContractNumber = this.correspondenceDetailsForm.get('contractNumber').value;
    this.initiateOutgoingCorrespondenceDetails.FillingFilePlanPath = this.getIDVal(this.correspondenceDetailsForm.get('fillinPlanPath').value);
    this.initiateOutgoingCorrespondenceDetails.StaffNumber = this.correspondenceDetailsForm.get('staffNumber').value;
    this.initiateOutgoingCorrespondenceDetails.Confidential = this.correspondenceDetailsForm.get('confidential').value;



    this.initiateOutgoingCorrespondenceDetails.Disposition1 = Disposition1;
    this.initiateOutgoingCorrespondenceDetails.Disposition2 = Disposition2;
    this.initiateOutgoingCorrespondenceDetails.Disposition3 = Dispostion3;

    this.initiateOutgoingCorrespondenceDetails.CorrespondenceType2 = this.correspondenceDetailsForm.get('correspondenceType').value;
    this.initiateOutgoingCorrespondenceDetails.CoverID = this.coverID;
    this.initiateOutgoingCorrespondenceDetails.TemplateLanguage = this.templateLanguage;

    this.initiateOutgoingCorrespondenceDetails.SkipDeptSecratory = this.correspondenceDetailsForm.get('skipDepSecratory').value;
    this.initiateOutgoingCorrespondenceDetails.SkipHOSSecratory = this.correspondenceDetailsForm.get('skipHOSecratory').value;
    this.initiateOutgoingCorrespondenceDetails.HeadOfSectionRequired = this.correspondenceDetailsForm.get('HOSReviewRequired').value;

    this.initiateOutgoingCorrespondenceDetails.SigningAuthority = this.getIDVal(this.correspondenceDetailsForm.get('Approver').value);
    this.initiateOutgoingCorrespondenceDetails.HeadOfSection = this.getIDVal(this.correspondenceDetailsForm.get('HOSApprover').value);

    this.correspondencservice.initiateWF(this.initiateOutgoingCorrespondenceDetails, this.corrFlowType).subscribe(
      () => {
        this.notificationmessage.success('Correspondence Created Succesfully', 'Your Correspondence has been created successfullly', 2500);
        this.backNavigation();
      }

    );
  }

  getIDVal(attributeObj: any): string {
    if (typeof attributeObj === 'undefined' || attributeObj === null) {
      return ''
    }
    else {
      return attributeObj.ID;
    }
  }
  SendOnWF(action: string) {
    if (action === 'SendOn') {
      if (this.validateCorrespondenceForm()) {
        this.initiateWFCorrespondence('SendOn', '', '');
      }
    }
    else if (action === 'Save') {
      if (this.validateCorrespondenceForm()) {
        this.initiateWFCorrespondence('Save', '', '');
      }
    }
    else if (action === 'StartCollaboration') {
      if (this.validateCorrespondenceForm()) {
        this.initiateWFCorrespondence('Save', '', '');
      }
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
        this.recipientDetailsForm.get('RecipientID').setValue('');
        this.recipientDetailsForm.get('RecipientUserID').setValue('');
        this.recipientDetailsForm.get('RecipientVersion').setValue('');
        this.recipientDetailsForm.get('RecipientType').setValue('');
        this.recipientDetailsForm.get('RecipientDepartment').setValue('');
        this.recipientDetailsForm.get('RecipientSection').setValue('');
        this.recipientDetailsForm.get('RecipientName').setValue('');
        this.IntRecipientInfo = new OrgNameAutoFillModel();
      default:
        break;
    }
  }

  //CC Actions
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
      UserColl_DueDate: empDetails.UserColl_Priority,
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

  skipDepSecrtoryChange(e: MatCheckboxChange) {
    if (e.checked) {
      this.skipDepSecratory = true;
      this.correspondenceDetailsForm.get('Approver').setValidators([Validators.required]);
    } else {
      this.skipDepSecratory = false;
      this.correspondenceDetailsForm.get('Approver').setValidators(null);
    }
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
      this.correspondenceDetailsForm.get('HOSApprover').setValidators(null);
    }
  }

  skipHOSSecratoryChange(e: MatCheckboxChange) {
    if (e.checked) {
      this.skipHOSSecratory = true;
      this.correspondenceDetailsForm.get('HOSApprover').setValidators([Validators.required]);
    }
    else {
      this.skipHOSSecratory = false;
      this.correspondenceDetailsForm.get('HOSApprover').setValidators(null);

    }
  }
  getApprovers(ApproverType: string) {
    this.correspondenceDetailsService
      .getApproverList(ApproverType)
      .subscribe(
        ApproverList => {
          if (ApproverType === 'iApprover_2_37') {
            this.DepApproverList = ApproverList;
          }
          else if (ApproverType === 'iApprover_2_33') {
            this.HOSApproverList = ApproverList;
          }
        }
      );
  }
  getTemplatesSectionData(corrFlowType: string, templateType: string = 'Default', onBehalfOf: string = '') {
    this.correspondenceDetailsService.getTemplatesList(corrFlowType, templateType, onBehalfOf).subscribe(
      listoftemplates => {
        this.templatesDocList = listoftemplates
      }
    );
  }

  importLettertoCoverFolder(templateDataID: string, language: string) {
    //Check Child Count    
    if (this.coverID == undefined || this.coverID == null) {
      const newFileName = this.corrFlowType + ' ' + 'Cover Template';
      this.csdocumentupload.copyDocToCoverFolder(templateDataID, this.corrFolderData.AttachCorrCoverID, newFileName).subscribe(
        response => {
          this.coverID = response.ID;
          this.setLanguage(language)
        },
        () => { },
        () => {
          this.getCoverSection();
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
  getSenderUserInfromation(VolumeID: string, CorrespondencType: String): void {
    this.correspondenceDetailsService.getCorrespondenceSenderDetails(VolumeID, CorrespondencType, true, CSConfig.globaluserid)
      .subscribe(correspondenceSenderDetailsData => {
        this.userInfo = correspondenceSenderDetailsData
        this.senderDetailsForm.get('SenderInfo').setValue(this.userInfo)
      });
  }
}