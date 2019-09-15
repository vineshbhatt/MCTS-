import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

import { FCTSDashBoard } from 'src/environments/environment';
import { CorrResponse } from '../../../services/correspondence-response.model';
import { DashboardFilterResponse, TransferAttributes } from '../../../models/DashboardFilter';

import { CorrespondenceDetailsService } from '../../../services/correspondence-details.service';
import { UserValueResponse, TransferRequestFinal } from './correspondence-transfer-dialog.model';

@Component({
  selector: 'correspondence-transfer-dialog',
  templateUrl: './correspondence-transfer-dialog.component.html'
})

export class TransferDialogBox implements OnInit {
  isReady = false;
  basehref: String = FCTSDashBoard.BaseHref;
  filteredEmpNames: Observable<DashboardFilterResponse[]>[] = [];
  filteredDepNames: Observable<DashboardFilterResponse[]>[] = [];
  TransferFormControlEmpName = new FormControl();
  TransferFormControlDepName = new FormControl();
  transfer_form: FormGroup;
  transferPurpose: any;
  transferPriority: any;
  index: string;
  transferRequestForm: FormGroup;
  transferAttribute: TransferAttributes[];
  transferResponse: CorrResponse[];
  VolumeID: string;
  CoverID: string;
  CorrespondencType: string;
  locationid: string;
  finalRequest: TransferRequestFinal[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TransferDialogBox>, private _correspondenceDetailsService: CorrespondenceDetailsService,
    private transfer_data: FormBuilder, private route: ActivatedRoute) {
    this.createForm();
  }

  createForm() {
    this.transferRequestForm = this.transfer_data.group({
      date: [{ value: '', disabled: true }, [Validators.required]],
      transfer_list: this.initItems()
    });
    this.ManageNameControl(0);
    this.isReady = true;
  }
  initItems() {
    const formArray = this.transfer_data.array([]);

    for (let i = 0; i < 1; i++) {
      formArray.push(this.transfer_data.group({
        Department: ['', Validators.required],
        Purpose: ['', Validators.required],
        To: ['', Validators.required],
        Priority: ['', Validators.required],
        Comments: ['', Validators.required],
        DueDate: ['', Validators.required]
      }));
    }
    return formArray;
  }
  ngOnInit() {
    this.VolumeID = this.route.snapshot.queryParamMap.get('VolumeID');
    this.CoverID = this.route.snapshot.queryParamMap.get('CoverID');
    this.CorrespondencType = this.route.snapshot.queryParamMap.get('CorrType');
    this.locationid = this.route.snapshot.queryParamMap.get('locationid');
    this.getTransferPurposeAndPriority();
  }

  ManageNameControl(index: number) {
    const arrayControl = this.transferRequestForm.get('transfer_list') as FormArray;
    this.filteredDepNames[index] = arrayControl.at(index).get('Department').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this._correspondenceDetailsService.searchTransferFieldName(value, 'DEP'))
      );

    this.filteredEmpNames[index] = arrayControl.at(index).get('To').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this._correspondenceDetailsService.searchTransferFieldName(value, 'EMP'))
      );
  }

  get transferLists() {
    return this.transferRequestForm.get('transfer_list') as FormArray;
  }
  /////////// End ////////////////

  /////// This is new /////////////////

  addTransferRow() {
    const controls = <FormArray>this.transferRequestForm.controls['transfer_list'];
    this.transferLists.push(this.transfer_data.group({
      Department: ['', Validators.required],
      Purpose: ['', Validators.required],
      To: ['', Validators.required],
      Priority: new FormControl('', Validators.required),
      Comments: ['', Validators.required],
      DueDate: ['', Validators.required]
    }));
    this.ManageNameControl(controls.length - 1);
  }

  deleteTransferRow(index) {
    this.transferLists.removeAt(index);
  }


  transferDielogBoxClose(action: string): void {
    this.dialogRef.close(action);
  }
  purposeChange() {
    this.transferPurpose = this.transferPurpose;
  }
  priorityChange() {
    this.transferPriority = this.transferPriority;
  }
  getTransferPurposeAndPriority() {
    this._correspondenceDetailsService.getTransferPurposeAndPriority()
      .subscribe(transferAttribute => {
        this.transferAttribute = transferAttribute;
      });
  }

  displayFieldValue(fieldValue: UserValueResponse) {
    if (fieldValue) { return fieldValue.Val_En; }
  }

  postTransferToRequest(myForm: any): void {
    // console.log('value: ', this.transferRequestForm.value);
    // this.finalRequest = <Transferlist[]>this.transferRequestForm.value;

    const CorArray = this.transferRequestForm.value;

    for (let i = 0; i < CorArray.transfer_list.length; i++) {
      const TList: TransferRequestFinal = new TransferRequestFinal;
      // Department: string;;
      // Purpose: number;
      // To: string;
      // Priority: string;
      // Comments: string;
      // DueDate: string;
      TList.Department = CorArray.transfer_list[i].Department.RecipientUserID;
      TList.To = CorArray.transfer_list[i].To.RecipientUserID;
      TList.Purpose = CorArray.transfer_list[i].Purpose;
      TList.Priority = CorArray.transfer_list[i].Priority;
      TList.Comments = CorArray.transfer_list[i].Comments;
      TList.DueDate = CorArray.transfer_list[i].DueDate;
      this.finalRequest.push(TList);
    }
    // this.VolumeID = this.route.snapshot.queryParamMap.get('VolumeID');
    // this._correspondenceDetailsService.createTransferRequest(TList, this.VolumeID);
    // this._correspondenceDetailsService.createTransferRequest(this.finalRequest, this.VolumeID, this.locationid)
    this._correspondenceDetailsService.createTransferRequest(this.finalRequest, this.data)
      .subscribe(transferResponse => {
        this.transferResponse = transferResponse;
        this.dialogRef.close('transfered');
      });
    //    this.dialogRef.close();
  }

  addGroup() {
    const val = this.transfer_data.group({
      Department: ['', Validators.required],
      Purpose: ['', Validators.required],
      To: ['', Validators.required],
      Priority: new FormControl('', Validators.required),
      Comments: ['', Validators.required],
      DueDate: ['', Validators.required]
    });
    this.newMethod(val);
  }
  private newMethod(val: FormGroup) {
    const transfer_form = this.transfer_form.get('times') as FormArray;
    transfer_form.push(val);
    this.index = ' ';
  }
  removeGroup(index: number) {
    const transfer_form = this.transfer_form.get('times') as FormArray;
    transfer_form.removeAt(index);
  }
  trackByFn(index: number, item: any) {
    return index;
  }

 groupChangePriority() {
    const arrayControl = this.transferRequestForm.get('transfer_list') as FormArray;
    for (let i = 0; i < arrayControl.length; i++) {
      arrayControl.at(i).get('Priority').setValue(this.transferPriority);
    }
  }

  groupChangePurpose() {
    const arrayControl = this.transferRequestForm.get('transfer_list') as FormArray;
    for (let i = 0; i < arrayControl.length; i++) {
      arrayControl.at(i).get('Purpose').setValue(this.transferPurpose);
    }
  }

}
