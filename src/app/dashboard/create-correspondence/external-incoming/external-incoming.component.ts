import { Component, OnInit, AfterViewInit } from '@angular/core';
import { OrgNameAutoFillModel, CCUserSetModel } from 'src/app/dashboard/models/CorrespondenenceDetails.model';
import { OrganizationalChartService } from 'src/app/dashboard/services/organizationalChart.service';
import { organizationalChartModel, organizationalChartEmployeeModel } from 'src/app/dashboard/models/organizational-Chart.model';
import { Location } from '@angular/common';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
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
import { CSDocumentUploadService } from '../../services/CSDocumentUpload.service';






@Component({
  selector: 'new-external-incoming',
  templateUrl: './external-incoming.component.html',
  styleUrls: ['./external-incoming.component.scss']
})


export class ExternalIncoming extends BaseCorrespondenceComponent implements OnInit, AfterViewInit {

  basehref: String = FCTSDashBoard.BaseHref;
  CSUrl: String = FCTSDashBoard.CSUrl;
  expandedRightAction = true;
  expandedAction = true;

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
  initiateIncomingCorrespondenceDetails = new CorrespondenceWFFormModel;

  showGeneratebarcodeButton: boolean = true;
  showSendOnButton: boolean = false;


  CCOUID: organizationalChartModel[] = [];
  CCEID: organizationalChartEmployeeModel[] = [];

  barcodeNumberToPrint = '';
  barcodeDate = '';
  initiatorMailroomPrivelage = 0;
  searchVal = '';
  ccProgbar = false;
  showempDetails = false;

  employeeMap = new Map<number, organizationalChartEmployeeModel[]>();
  employeeForOUID: organizationalChartEmployeeModel[] = [];
  spinnerDataLoaded: boolean = false;


  constructor(private _location: Location,
    private organizationalChartService: OrganizationalChartService, private formBuilder: FormBuilder,
    private correspondencservice: CorrespondenceService,
    private notificationmessage: NotificationService,
    public csdocumentupload: CSDocumentUploadService, public correspondenceDetailsService: CorrespondenceDetailsService) {
    super(csdocumentupload, correspondenceDetailsService);
  }
  ngOnInit() {
    // Get Logged in user Information
    this.getUserInfo();
    this.getOrganizationalChartDetail();
    this.getMetadataFilters();

    this.senderDetailsForm = this.formBuilder.group({
      ExternalOrganization: ['', Validators.required],
      SenderDepartment: [],
      SenderName: []
    });

    this.recipientDetailsForm = this.formBuilder.group({
      RecipientID: [],
      RecipientUserID: [],
      RecipientVersion: [],
      RecipientType: [],
      RecipientDepartment: ['', Validators.required],
      RecipientSection: [],
      RecipientName: []
    });

    this.ccDetailsForm = this.formBuilder.group({
      CCDetails: this.formBuilder.array([])
    });

    this.correspondenceDetailsForm = this.formBuilder.group({
      regDate: new FormControl({ value: new Date().toLocaleDateString(), disabled: true }),
      docsDate: [''],
      confidential: [''],
      priority: [''],
      refNumber: ['', Validators.required],
      personalName: [''],
      idNumber: [''],
      correspondenceType: [''],
      baseType: [''],
      arabicSubject: [''],
      englishSubject: [''],
      projectCode: [''],
      budgetNumber: [''],
      contractNumber: [''],
      tenderNumber: [''],
      corrNumber: new FormControl({ value: '', disabled: true }),
      fillinPlanPath: [''],
      dispatchMethod: [''],
      staffNumber: ['']
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

  ngAfterViewInit() {
    this.getTempFolderAttachments('Incoming');
    this.getUserMailroomPrivvelage();
  }

  getMetadataFilters(): void {
    this.correspondencservice
      .getDashboardFilters()
      .subscribe(
        (MetadataFilters) => {
          this.MetadataFilters = MetadataFilters
          this.SetDefaultPriority();
        }
      );
  }
  SetDefaultPriority() {
    this.correspondenceDetailsForm.get('priority').setValue({ EN: 'Normal', ID: 1, AR: 'Normal' });
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
      return searchList.DepName_En + (searchList.SecName_En != null ? (',' + searchList.SecName_En) : '');
    }
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

  get f() { return this.correspondenceDetailsForm.controls; }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.correspondenceDetailsForm.invalid) {
      return;
    }
    console.log(JSON.stringify(this.correspondenceDetailsForm.value));
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
    this.correspondenceDetailsService.getDocumentURL(CoverID)
      .subscribe(correspondenceCovertData => this.documentPreviewURL = correspondenceCovertData);
  }

  showActionProperties(dataID: string): void {
    this.showPreviewTreeArea = false;
    this.showPreviewCoverLetter = true;
    this.correspondenceDetailsService.getDocumentPropertiesURL(dataID)
      .subscribe(correspondenceCovertData => this.documentPreviewURL = correspondenceCovertData);
  }
  tranlsateDocument(dataID: string): void {
    this.showPreviewTreeArea = false;
    this.showPreviewCoverLetter = true;
    this.correspondenceDetailsService.getDocumentTranslateURL(dataID)
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
    this.CCEID = [];
  }

  showRecipientData() {
    this.showPreviewTreeArea = true;
    this.selectedCaption = 'Recipient';
    this.currentlyChecked = false;
    this.showPreviewCoverLetter = false;
    this.multiSelect = false;
    this.dataSource.data = this.organizationalChartData;
    this.CCEID = [];
  }

  showCCData() {
    this.showPreviewTreeArea = true;
    this.selectedCaption = 'CC';
    this.currentlyChecked = false;
    this.showPreviewCoverLetter = false;
    this.multiSelect = true;
    this.dataSource.data = this.organizationalChartData;
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
  getEmplDetail(organizationalChartData: organizationalChartModel): Map<number, organizationalChartEmployeeModel[]> {
    this.showempDetails = false;
    if (this.employeeMap.has(organizationalChartData.OUID)) {
      this.showempDetails = true;
      return this.employeeMap;
    } else {
      // get the List of Employees from an OUID and add to the Map
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
      } else {
        this.CCOUID.splice(this.CCOUID.lastIndexOf(organizationalChartData), 1);
      }
    } else {
      this.currentlyChecked = organizationalChartData;
    }
  }

  selectSinglCheckboxEmp(employeeChartData: organizationalChartEmployeeModel, e: MatCheckboxChange) {
    if (this.multiSelect) {
      if (e.checked) {
        if (this.CCEID.lastIndexOf(employeeChartData) === -1) {
          this.CCEID.push(employeeChartData);
        }
      } else {
        this.CCEID.splice(this.CCEID.lastIndexOf(employeeChartData), 1);
      }
    } else {
      this.currentlyChecked = employeeChartData;
    }
  }

  getSelectedIntDepartment() {
    if (this.selectedCaption === 'Recipient') {
      if (this.currentlyChecked.EID === undefined) {
        this.correspondenceDetailsService.searchFieldForAutoFillOUID(this.currentlyChecked.OUID, 'IntDepartmentOUID', '').subscribe(
          DepInfo => {
            this.IntRecipientInfo = DepInfo[0];
            this.recipientDetailsForm.get('RecipientDepartment').setValue(DepInfo[0]);
          }
        );
      } else {
        this.correspondenceDetailsService.searchFieldForAutoFillOUID(this.currentlyChecked.EID, 'IntEmployeeEID', '').subscribe(
          EmpInfo => {
            this.IntRecipientInfo = EmpInfo[0];
            this.recipientDetailsForm.get('RecipientDepartment').setValue(EmpInfo[0]);
          }
        );
      }
    } else if (this.selectedCaption === 'CC') {
      this.ccProgbar = true;
      this.ccDetailsForm = this.formBuilder.group({
        CCDetails: this.formBuilder.array([])
      });
      const orgArray = new Array();
      this.CCOUID.forEach(function (obj) {
        orgArray.push(obj.OUID);
      });

      const empArray = new Array();
      this.CCEID.forEach(function (obj) {
        empArray.push(obj.EID);
      });

      this.correspondenceDetailsService.getCCUserDetailsSet(orgArray.toString(), empArray.toString(), 'Incoming').subscribe(
        ccDepInfo => {
          for (const obj of ccDepInfo) {
            this.addCC(obj);
          }
          this.ccProgbar = false;
        }
      );
    }
  }

  GenerateBarcode() {
    if (this.correspondenceDetailsForm.invalid) {
      this.notificationmessage.warning('Correspondence details missing', 'Please fill in manadatory correspondence details', 2500);
    } else if (this.senderDetailsForm.invalid) {
      this.notificationmessage.warning('Sender information missing', 'Please fill in mandatory sender information', 2500);
    } else if (this.recipientDetailsForm.invalid) {
      this.notificationmessage.warning('Recipient infomration missing', 'Please fill in mandatory recipient information', 2500);
    } else {
      this.correspondenceDetailsService.getCorredpondenceBarcode(this.corrFolderData.AttachCorrID, 'Incoming', new Date().getFullYear()).subscribe(
        barcodeVal => {
          this.correspondenceDetailsForm.get('corrNumber').setValue(barcodeVal.CorrespondenceCode);
          this.barcodeNumberToPrint = barcodeVal.CorrespondenceCode;
          this.barcodeDate = new Date().toLocaleDateString();
          this.showSendOnButtons();
        }
      );
    }
  }

  initiateWFCorrespondence(Disposition1: string, Disposition2: string, Dispostion3: string) {

    if (this.correspondenceDetailsForm.invalid) {
      this.notificationmessage.warning('Correspondence details missing', 'Please fill in manadatory correspondence details', 2500);
    } else if (this.senderDetailsForm.invalid) {
      this.notificationmessage.warning('Sender information missing', 'Please fill in mandatory sender information', 2500);
    } else if (this.recipientDetailsForm.invalid) {
      this.notificationmessage.warning('Recipient infomration missing', 'Please fill in mandatory recipient information', 2500);
    }
    else {
      this.spinnerDataLoaded = true;
      //Set each and every Value ofr the three Forms to one Single Object For Post
      this.initiateIncomingCorrespondenceDetails.CorrespondenceDate = this.correspondenceDetailsForm.get('regDate').value;
      this.initiateIncomingCorrespondenceDetails.Confidential = this.correspondenceDetailsForm.get('confidential').value;
      this.initiateIncomingCorrespondenceDetails.ConnectedID = '';
      this.initiateIncomingCorrespondenceDetails.ConnectedRefID = '';
      this.initiateIncomingCorrespondenceDetails.CorrespondenceID = '' + this.corrFolderData.AttachCorrID;
      this.initiateIncomingCorrespondenceDetails.CorrespondenceCode = this.correspondenceDetailsForm.get('corrNumber').value;
      this.initiateIncomingCorrespondenceDetails.SenderDetails = this.senderDetailsForm.get('ExternalOrganization').value;
      this.initiateIncomingCorrespondenceDetails.RecipientDetails = this.recipientDetailsForm.get('RecipientDepartment').value;
      this.initiateIncomingCorrespondenceDetails.SenderName = '';
      this.initiateIncomingCorrespondenceDetails.RecipientName = '';
      this.initiateIncomingCorrespondenceDetails.CCSet = '';
      this.initiateIncomingCorrespondenceDetails.Disposition1 = Disposition1;
      this.initiateIncomingCorrespondenceDetails.Disposition2 = Disposition2;
      this.initiateIncomingCorrespondenceDetails.Disposition3 = Dispostion3;
      this.initiateIncomingCorrespondenceDetails.CoverID = '' + this.coverID;
      this.initiateIncomingCorrespondenceDetails.ArabicSubject = this.correspondenceDetailsForm.get('arabicSubject').value;
      this.initiateIncomingCorrespondenceDetails.EnglishSubject = this.correspondenceDetailsForm.get('englishSubject').value;
      this.initiateIncomingCorrespondenceDetails.CoverDate = this.correspondenceDetailsForm.get('docsDate').value;
      this.initiateIncomingCorrespondenceDetails.DocumentNumber = this.correspondenceDetailsForm.get('refNumber').value;
      this.initiateIncomingCorrespondenceDetails.Priority = this.getIDVal(this.correspondenceDetailsForm.get('priority').value);
      this.initiateIncomingCorrespondenceDetails.CorrespondenceType2 = this.getIDVal(this.correspondenceDetailsForm.get('correspondenceType').value);
      this.initiateIncomingCorrespondenceDetails.IDNumber = this.correspondenceDetailsForm.get('idNumber').value;
      this.initiateIncomingCorrespondenceDetails.BaseType = this.getIDVal(this.correspondenceDetailsForm.get('baseType').value);
      this.initiateIncomingCorrespondenceDetails.ProjectCode = this.correspondenceDetailsForm.get('projectCode').value;
      this.initiateIncomingCorrespondenceDetails.BudgetNumber = this.correspondenceDetailsForm.get('budgetNumber').value;
      this.initiateIncomingCorrespondenceDetails.CommitmentNumber = '';
      this.initiateIncomingCorrespondenceDetails.TenderNumber = this.correspondenceDetailsForm.get('tenderNumber').value;
      this.initiateIncomingCorrespondenceDetails.CompanyRegistrationNumber = '';
      this.initiateIncomingCorrespondenceDetails.ContractNumber = this.correspondenceDetailsForm.get('contractNumber').value;
      this.initiateIncomingCorrespondenceDetails.StaffNumber = this.correspondenceDetailsForm.get('staffNumber').value;
      this.initiateIncomingCorrespondenceDetails.CorrespondencePurpose = '';
      this.initiateIncomingCorrespondenceDetails.TemplateLanguage = '';
      this.initiateIncomingCorrespondenceDetails.FillingFilePlanPath = this.getIDVal(this.correspondenceDetailsForm.get('fillinPlanPath').value);
      this.initiateIncomingCorrespondenceDetails.CorrespondenceFlowType = '1';
      this.initiateIncomingCorrespondenceDetails.CorrespondenceYear = '' + new Date().getFullYear();
      this.initiateIncomingCorrespondenceDetails.DocumentType = '';
      this.initiateIncomingCorrespondenceDetails.CorrespondenceDueDate = '';
      this.initiateIncomingCorrespondenceDetails.HeadOfSectionRequired = '';
      this.initiateIncomingCorrespondenceDetails.CorrespondencePhase = '';
      this.initiateIncomingCorrespondenceDetails.CCSet = this.ccDetailsForm.get('CCDetails').value;

      this.correspondencservice.initiateWF(this.initiateIncomingCorrespondenceDetails, 'Incoming').subscribe(
        () => {
          this.spinnerDataLoaded = false;
          this.notificationmessage.success('Correspondence Created Succesfully', 'Your Correspondence has been created successfullly', 2500);
          this.backNavigation();
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

  SendOnWF(action: string) {
    if (action === 'SENDON') {

      if (this.initiatorMailroomPrivelage > 1) {
        switch (this.initiatorMailroomPrivelage) {
          case 2:
            // Disposition1 SendOnAndSkip
            // Disposition3  3
            this.initiateWFCorrespondence('SendOnAndSkip', 'WR2b', '3');
            break;
          case 3:
            // Disposition1 SendOnAndSkip
            // Disposition3  4
            this.initiateWFCorrespondence('SendOnAndSkip', 'WR2b', '4');
            break;
          case 4:
            // Disposition1 SendOnAndSkip
            // Disposition3  5
            this.initiateWFCorrespondence('SendOnAndSkip', 'WR2b', '5');
            break;
          case 5:
            // Disposition1 SendOnAndSkip
            // Disposition3  6
            if (this.coverID !== '' && this.coverID != undefined) {
              this.initiateWFCorrespondence('SendOnAndSkip', 'WR2b', '6');
            } else {
              this.notificationmessage.warning('Cover Document Manadatory', 'Please upload Cover Document to Proceed', 2500);
            }

            break;
        }
      } else {
        this.initiateWFCorrespondence('SendOn', '', '2b');
      }
    } else if (action === 'SAVE') {
      this.initiateWFCorrespondence('Save', '', '1');
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
        break;
      default:
        break;
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

  getUserMailroomPrivvelage() {
    this.correspondenceDetailsService.getCurrentUserMailroomPrivelage().subscribe(
      mailroomuserprivelage => {
        this.initiatorMailroomPrivelage = Number(mailroomuserprivelage.usermailroomprivelage);
      }
    );
  }
  showSpinner() {
    this.spinnerDataLoaded = true;
  }
  showCSCopy(folderID: string) {
    this.showPreviewTreeArea = false;
    this.showPreviewCoverLetter = true;
    this.correspondenceDetailsService.getCopyFromContentServerURL(folderID)
      .subscribe(correspondenceCovertData => this.documentPreviewURL = correspondenceCovertData);
  }
  loadFolderPageForScan(folderID: string) {
    this.showPreviewTreeArea = false;
    this.showPreviewCoverLetter = true;
    this.correspondenceDetailsService.getFolderBrowse(folderID)
      .subscribe(correspondenceCovertData => this.documentPreviewURL = correspondenceCovertData);
  }

  LinkedCorrAction(obj) {
    if (obj.hasOwnProperty('action') || obj.hasOwnProperty('dataID')) {
      if (obj.action === 'showActionProperties') {
        this.showActionProperties(obj.dataID);
      } else if (obj.action === 'tranlsateDocument') {
        this.tranlsateDocument(obj.dataID);
      } else if (obj.action === 'getCoverDocumentURL') {
        this.getCoverDocumentURL(obj.dataID);
      }
    }
  }

}
