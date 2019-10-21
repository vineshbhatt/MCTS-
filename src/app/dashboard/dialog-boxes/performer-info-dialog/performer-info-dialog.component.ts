import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CorrespondenceShareService } from '../../services/correspondence-share.service';
import { ErrorHandlerFctsService } from '../../services/error-handler-fcts.service';

@Component({
  selector: 'app-performer-info-dialog',
  templateUrl: './performer-info-dialog.component.html',

})
export class PerformerInfoDialogComponent implements OnInit {
  performerInfo: any;
  performerProgbar: Boolean =  false;

  constructor(
    public dialogRef: MatDialogRef<PerformerInfoDialogComponent>,
    public correspondenceShareService: CorrespondenceShareService,
    private _errorHandlerFctsService: ErrorHandlerFctsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.getPerformerUserInfo(this.data.kuafID);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getPerformerUserInfo(ID: number): void {
    this.performerProgbar = true;
    this.correspondenceShareService.getPerformerUserInfo(ID)
    .subscribe(
      response => {
        this.performerInfo = response;
        this.performerProgbar = false;
      },
      responseError => {
        this._errorHandlerFctsService.handleError(responseError).subscribe();
        this.closeDialog();
      });
  }

}
