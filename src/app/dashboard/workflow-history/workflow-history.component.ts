import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CorrResponse } from '../services/correspondence-response.model';
import { AuditHistoryDetailsService } from '../services/AuditHistoryDetails.service';
import { Correspondence } from '../services/correspondence.model';
import { FCTSDashBoard } from '../../../environments/environment';

export interface DialogData {
    work_flw: string;
    work_flw2: string;
}
@Component({
    selector: 'workflow-history-dialog',
    templateUrl: 'workflow-history.component.html',
})

export class WorkflowHistoryDialogBox implements OnInit {
    basehref: String = FCTSDashBoard.BaseHref;
    transferHistoryDetailData: CorrResponse[];
    workflowHistoryDetailData: CorrResponse[];
    constructor(
        public dialogRef: MatDialogRef<WorkflowHistoryDialogBox>,
        @Inject(MAT_DIALOG_DATA) public corrData: any,
        private _auditdetailservice: AuditHistoryDetailsService) { }

        onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit() {

        this.getTransferHistoryDetails();
        this.getWorkflowHistoryDetails();
    }
    getTransferHistoryDetails(): void {
        this._auditdetailservice.getTransferHistory(this.corrData.data)
            .subscribe(
                transferHistoryDetailData => {
                    this.transferHistoryDetailData = transferHistoryDetailData;
                    console.log(this.transferHistoryDetailData);
                }
            );
    }

    getWorkflowHistoryDetails(): void {
        this._auditdetailservice.getWorkflowAudit(this.corrData.data)
            .subscribe(workflowHistoryDetailData => this.workflowHistoryDetailData = workflowHistoryDetailData);
    }
}
