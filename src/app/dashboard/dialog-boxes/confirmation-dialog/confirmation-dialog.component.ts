import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html'
})

export class ConfirmationDialogComponent implements OnInit {

  private _message: string;

  public get message(): string {
    return this._message;
  }
  public set message(value: string) {
    this._message = value;
  }

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  private _chooseMessage(): void {
    // choose confirmation message
    switch (this.data.message) {
      case 'assignTransfer': {
        this._message = 'This Step Assignment has been offered to more than one person, it must be Accepted before work can be done';
        break;
      }
      case 'assignWF': {
        this._message = 'This Step Assignment has been offered to more than one person, it must be Accepted before work can be done';
        break;
      }
      case 'activateDelegation': {
        this._message = 'Do you want to activate this delegation now?';
        break;
      }
      case 'deleteDelegation': {
        this._message = 'Are you sure you want to delete this delegation?';
        break;
      }
      case 'deleteConnection': {
        this.message = 'Are you sure to remove this connection?';
        break;
      }
      default: {
        this._message = 'An unknown case, please inform Administrator';
        break;
      }
    }
  }

  closeDialog(): void {
    this.dialogRef.close('close');
  }

  ngOnInit() {
    this._chooseMessage();
  }

}
