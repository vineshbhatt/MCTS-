import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-new-delegation',
  templateUrl: './new-delegation.component.html',
  styleUrls: ['./new-delegation.component.scss']
})
export class NewDelegationComponent implements OnInit {
  delegationProxy= new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  delegationFrom: FormGroup;
  constructor(public delegationDialog: MatDialogRef< NewDelegationComponent>,private _formBuilder: FormBuilder) {
    this.delegationFrom = this._formBuilder.group({
      nameProxyUser: [],
      startDate: String,
      startTime: String,
      endDate: String,
      endTime: String,
      delegationProxy: this._formBuilder.array([
        this._formBuilder.control(
          this.delegationProxy.value == [' ']
        )
      ]),
      // Delegatee: this._formBuilder.array([
      //   this._formBuilder.control(null)
      // ])
    })
  }

  ngOnInit() {
    this.filteredOptions = this.delegationProxy.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  delegationDialogClose(): void {
    this.delegationDialog.close();
  }
  addDelegatee(): void {
    (this.delegationFrom.get('delegationProxy') as FormArray).push(
      this._formBuilder.control(
        this.delegationProxy.value == null
      )
    );
      console.log(this.delegationProxy.value)
  }

  removeDelegatee(index) {
    (this.delegationFrom.get('delegationProxy') as FormArray).removeAt(index);
  }

  getDelegateeFormControls(): AbstractControl[] {
    return (<FormArray> this.delegationFrom.get('delegationProxy')).controls
  }
}
