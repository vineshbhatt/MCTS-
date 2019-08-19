import { Component, OnInit, AfterViewInit, VERSION } from '@angular/core';
import { OrgNameAutoFillModel, CorrespondenceFolderModel, CCUserSetModel } from 'src/app/dashboard/models/CorrespondenenceDetails.model';
import { CorrespondenceDetailsService } from 'src/app/dashboard/services/correspondence-details.service';
import { OrganizationalChartService } from 'src/app/dashboard/services/organizationalChart.service';
import { organizationalChartModel } from 'src/app/dashboard/models/organizational-Chart.model';
import { Location } from '@angular/common'
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree'
import { Observable, EMPTY } from 'rxjs';
import { FCTSDashBoard } from '../../../../environments/environment';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CorrResponse } from '../../services/correspondence-response.model';
import { switchMap, debounceTime } from 'rxjs/operators';
import { MatOptionSelectionChange, MatCheckboxChange } from '@angular/material';
import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { DocumentPreview } from '../../services/documentpreview.model';
import { CSDocumentUploadService } from '../../services/CSDocumentUpload.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { CorrespondenceWFFormModel } from '../../models/CorrepondenceWFFormModel';


@Component({
  selector: 'new-external-incoming',
  templateUrl: './external-incoming.component.html',
  styleUrls: ['./external-incoming.component.scss']
})


export class ExternalIncoming implements OnInit, AfterViewInit {

  basehref: String = FCTSDashBoard.BaseHref;
  CSUrl: String = FCTSDashBoard.CSUrl;
  expandedRightAction: boolean = true;
  expandedAction: boolean = true;
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

  showGeneratebarcodeButton: boolean = true;
  showSendOnButton: boolean = false;
  coverID: string;

  CCOUID: organizationalChartModel[] = [];


  constructor(private correspondenceDetailsService: CorrespondenceDetailsService, private _location: Location,
    private organizationalChartService: OrganizationalChartService, private formBuilder: FormBuilder,
    private correspondencservice: CorrespondenceService, private csdocumentupload: CSDocumentUploadService) { }
  ngOnInit() {
    //Get Logged in user Information
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
  }

  getTempFolderAttachments(CorrFlowType): void {
    this.correspondenceDetailsService.createTempAttachments(CorrFlowType).subscribe(
      tempAttachment => {
        this.corrFolderData = tempAttachment
        this.getCoverSection();
        this.getAttachmentSection();
      }
    );
  }
  getMetadataFilters(): void {
    this.correspondencservice
      .getDashboardFilters()
      .subscribe(
        MetadataFilters => (this.MetadataFilters = MetadataFilters)
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
    if (searchList) { return searchList.DepName_En + ',' + searchList.SecName_En }
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

  getUserInfo() {
    this.correspondenceDetailsService
      .GetUserInformation()
      .subscribe(userInfoVal =>
        this.userInfo = userInfoVal
      );
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

  getCoverSection() {
    this.correspondenceDetailsService.getCoverFolderDetails(this.corrFolderData.AttachCorrCoverID).subscribe(
      coverFolderdetails => {
        this.externalIncCoverLetterData = coverFolderdetails;
        this.coverID = coverFolderdetails[0].myRows[0].Dataid;
      }
    );
  }
  getAttachmentSection() {
    this.correspondenceDetailsService.getAttachmentFolderDetails(this.corrFolderData.AttachCorrAttachmentsID).subscribe(
      attachmentFolderdetails => this.externalAttachmentFolderData = attachmentFolderdetails
    );
  }
  getCoverDocumentURL(CoverID: String): void {
    this.showPreviewTreeArea = false;
    this.showPreviewCoverLetter = true;
    this.correspondenceDetailsService.getDocumentURL(CoverID)
      .subscribe(correspondenceCovertData => this.documentPreviewURL = correspondenceCovertData);
  }
  showActionProperties(dataID: string): void {
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
  }
  showRecipientData() {
    this.showPreviewTreeArea = true;
    this.selectedCaption = 'Recipient'
    this.currentlyChecked = false;
    this.showPreviewCoverLetter = false;
    this.multiSelect = false;
    this.dataSource.data = this.organizationalChartData;
    this.CCOUID = [];
  }
  showCCData() {

    this.showPreviewTreeArea = true;
    this.selectedCaption = 'CC'
    this.currentlyChecked = false;
    this.showPreviewCoverLetter = false;
    this.multiSelect = true;
    this.dataSource.data = this.organizationalChartData;
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
  value = '';
  getSearchValue(value: string) {
    this.value = value;
  }
  selectSinglCheckbox(organizationalChartData: organizationalChartModel, e: MatCheckboxChange) {
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
  getSelectedIntDepartment() {
    if (this.selectedCaption === 'Recipient') {
      this.correspondenceDetailsService.searchFieldForAutoFillOUID(this.currentlyChecked.OUID, 'IntDepartmentOUID', '').subscribe(
        DepInfo => {
          this.IntRecipientInfo = DepInfo[0]
          this.recipientDetailsForm.get('RecipientDepartment').setValue(DepInfo[0])
        }
      )
    }
    else if (this.selectedCaption === 'CC') {
      let a = new Array();
      this.CCOUID.forEach(function (obj) {
        a.push(obj.OUID);
      });

      this.correspondenceDetailsService.getCCUserDetailsSet(a.toString(), 'ccDepartments', 'Incoming').subscribe(
        ccDepInfo => {

          for (let obj of ccDepInfo) {
            this.addCC(obj);
          }
        }

      )

    }
  }

  uploadCSDocument(files: File[], parentID: number, sectionName: any) {
    //pick from one of the 4 styles of file uploads below        
    this.csdocumentupload.uploadDocument(files, "" + parentID).subscribe(
      () => '',
      () => '',
      () => {
        if (sectionName === "COVER") {
          this.getCoverSection();
        }
        else if (sectionName === "ATTACHMENT") {
          this.getAttachmentSection();
        }
        else if (sectionName === "MISC") {
        }
      }
    )
  }
  public files: NgxFileDropEntry[] = [];
  public dropped(files: NgxFileDropEntry[], parentID: string, section: string) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.csdocumentupload.dragandDropUpload(file, parentID).subscribe(
            () => '',
            () => '',
            () => {
              if (section == "COVER") {
                this.getCoverSection();
              }
              else if (section == "ATTACHMENT") {
                this.getAttachmentSection();
              }
              else if (section == "MISC") {
                //this.GetMiscSection();
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

  GenerateBarcode() {

    if (this.correspondenceDetailsForm.invalid) {
      alert("Fill in Manadatory Corr Details");
    }
    else if (this.senderDetailsForm.invalid) {
      alert("Fill In Mandatory Sender Information");
    }
    else if (this.recipientDetailsForm.invalid) {
      alert("Fill In Mandatory Recipient Information");
    }
    else {
      this.correspondenceDetailsService.getCorredpondenceBarcode(this.corrFolderData.AttachCorrID, 'Incoming', new Date().getFullYear()).subscribe(
        barcodeVal => {
          this.correspondenceDetailsForm.get('corrNumber').setValue(barcodeVal.CorrespondenceCode)
          this.showSendOnButtons();
        }
      );
    }
  }

  initiateWFCorrespondence(Disposition1: string, Disposition2: string, Dispostion3: string) {

    debugger;
    if (this.correspondenceDetailsForm.invalid) {
      alert("Fill in Manadatory Corr Details");
    }
    else if (this.senderDetailsForm.invalid) {
      alert("Fill In Mandatory Sender Information");
    }
    else if (this.recipientDetailsForm.invalid) {
      alert("Fill In Mandatory Recipient Information");
    }
    else {
      //Set each and every Value ofr the three Forms to one Single Object For Post
      this.initiateIncomingCorrespondenceDetails.CorrespondenceDate = this.correspondenceDetailsForm.get('regDate').value;
      this.initiateIncomingCorrespondenceDetails.Confidential = this.correspondenceDetailsForm.get('confidential').value;
      this.initiateIncomingCorrespondenceDetails.ConnectedID = '';
      this.initiateIncomingCorrespondenceDetails.refID = '';
      this.initiateIncomingCorrespondenceDetails.CorrespondenceID = "" + this.corrFolderData.AttachCorrID;
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
      this.initiateIncomingCorrespondenceDetails.TempLanguage = '';
      this.initiateIncomingCorrespondenceDetails.FillingFilePlanPath = this.getIDVal(this.correspondenceDetailsForm.get('fillinPlanPath').value);
      this.initiateIncomingCorrespondenceDetails.CorrespondenceFlowType = '1';
      this.initiateIncomingCorrespondenceDetails.CorrespondenceYear = '' + new Date().getFullYear();
      this.initiateIncomingCorrespondenceDetails.DocumentType = '';
      this.initiateIncomingCorrespondenceDetails.CorrespondenceDueDate = '';
      this.initiateIncomingCorrespondenceDetails.HeadOfSectionRequired = '';
      this.initiateIncomingCorrespondenceDetails.CorrespondencePhase = '';
      this.initiateIncomingCorrespondenceDetails.CCSet = this.ccDetailsForm.get('CCDetails').value;



      this.correspondencservice.initiateWF(this.initiateIncomingCorrespondenceDetails, 'Incoming').subscribe(
        () => alert("Workflow Initiated")
      );
    }
  }


  getIDVal(attributeObj: any): string {
    if (typeof attributeObj === 'undefined') {
      return ''
    }
    else {
      return attributeObj.ID;
    }

  }
  showSendOnButtons() {
    this.showGeneratebarcodeButton = false;
    this.showSendOnButton = true;
  }
  SendOnWF() {
    this.initiateWFCorrespondence('SendOn', '', '2b');
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
    alert(JSON.stringify(this.CCDetails.value));

  }
}