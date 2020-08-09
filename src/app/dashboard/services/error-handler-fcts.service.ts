import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { throwError } from 'rxjs';

import { MessageDialogComponent } from '../dialog-boxes/message-dialog/message-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerFctsService {

  constructor(
    public _dialogU: MatDialog
  ) { }

  showMessage(message: string) {
    const dialogRef = this._dialogU.open(MessageDialogComponent, {
      width: '100%',
      // margin: 'auto',
      panelClass: 'complete-dialog',
      maxWidth: '30vw',
      data: { message }
    });
  }

  handleError(error: HttpErrorResponse) {
    // console.log(error);
    let errMessage: string;
    if (error.error instanceof ErrorEvent) {
      errMessage = error.error.message;
    } else if (error.error.error) {
      errMessage = error.error.error;
    } else {
      errMessage = error.message;
    }
    this.showMessage(`An error ocured. Error message - "`
      + errMessage + `"`
      + ` Please contact the administrator.`);

    return throwError('An error happened - ' + errMessage);
  }

}
