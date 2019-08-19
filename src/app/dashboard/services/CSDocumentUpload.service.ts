import { Injectable, } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClientModule, HttpClient, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { FCTSDashBoard } from '../../../environments/environment';
import { map, tap, catchError } from 'rxjs/operators'; /* added 24/06/2019 */
import { CorrespondenceFolderModel } from '../../dashboard/models/CorrespondenenceDetails.model';
import { EMPTY } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class CSDocumentUploadService {


    private CSUrl: string = CSConfig.CSUrl;
    constructor(
        private httpServices: HttpClient
    ) { }



    uploadDocument(files: File[], parentID: string): Observable<any> {
        var formData = new FormData();
        Array.from(files).forEach(f => {
            var inputBody = new UploadParameterModel();
            inputBody.name = f.name;
            inputBody.type = "144";
            inputBody.parent_id = parentID;
            formData.append('file', f);
            formData.append('body', JSON.stringify(inputBody))
        })
        return this.httpServices.post(this.CSUrl + `${FCTSDashBoard.WFApiV2}nodes`,
            formData, { reportProgress: true, observe: 'events', headers: { OTCSTICKET: CSConfig.AuthToken } });
    }

    dragandDropUpload(file: File, parentID: string): Observable<any> {
        var formData = new FormData();

        var inputBody = new UploadParameterModel();
        inputBody.name = file.name;
        inputBody.type = "144";
        inputBody.parent_id = parentID;
        formData.append('file', file);
        formData.append('body', JSON.stringify(inputBody))
        return this.httpServices.post(this.CSUrl + `${FCTSDashBoard.WFApiV2}nodes`,
            formData, { reportProgress: true, observe: 'events', headers: { OTCSTICKET: CSConfig.AuthToken } });
    }
}

export class UploadParameterModel {
    name: string;
    type: string;
    parent_id: string;
}