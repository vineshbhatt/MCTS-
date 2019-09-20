import { Component, OnInit } from '@angular/core';
import { CSDocumentUploadService } from '../../services/CSDocumentUpload.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { CorrespondenceDetailsService } from 'src/app/dashboard/services/correspondence-details.service';
import { CorrResponse } from '../../services/correspondence-response.model';
import { CorrespondenceFolderModel } from 'src/app/dashboard/models/CorrespondenenceDetails.model';

@Component({
    selector: 'app-base-correspondence',
    templateUrl: './base-correspondence.component.html'
})

export class BaseCorrespondenceComponent implements OnInit {

    constructor(public csdocumentupload: CSDocumentUploadService, public correspondenceDetailsService: CorrespondenceDetailsService) { }
    CoverLetterData: CorrResponse[];
    AttachmentFolderData: CorrResponse[];
    corrFolderData: CorrespondenceFolderModel;
    coverID: string;
    userInfo: CorrResponse[];
    templatesDocList: any[];
    public files: NgxFileDropEntry[] = [];

    ngOnInit() {

    }

    uploadCSDocument(files: File[], parentID: number, sectionName: any) {
        // pick from one of the 4 styles of file uploads below
        this.csdocumentupload.uploadDocument(files, '' + parentID).subscribe(
            () => '',
            () => '',
            () => {
                if (sectionName === 'COVER') {
                    this.getCoverSection();
                } else if (sectionName === 'ATTACHMENT') {
                    this.getAttachmentSection();
                } else if (sectionName === 'MISC') {
                }
            }
        );
    }

    public dropped(files: NgxFileDropEntry[], parentID: string, section: string) {
        for (const droppedFile of files) {
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {
                    this.csdocumentupload.dragandDropUpload(file, parentID).subscribe(
                        () => '',
                        () => '',
                        () => {
                            if (section === 'COVER') {
                                this.getCoverSection();
                            } else if (section === 'ATTACHMENT') {
                                this.getAttachmentSection();
                            } else if (section === 'MISC') {
                                // this.GetMiscSection();
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

    deleteDocument(documentDataid: string, section: string) {
        this.csdocumentupload.deleteDocument(documentDataid).subscribe(
            () => { },
            () => { },
            () => {
                if (section === 'COVER') {
                    this.coverID = undefined;
                    this.getCoverSection();
                } else if (section === 'ATTACHMENT') {
                    this.getAttachmentSection();
                } else if (section === 'MISC') {
                    // this.GetMiscSection();
                }
            }
        );
    }

    addDocumentVersion(files: File[], documentDataid: number, sectionName: any) {
        this.csdocumentupload.uploadDocumentVersion(files, '' + documentDataid).subscribe(
            () => '',
            () => '',
            () => {
                if (sectionName === 'COVER') {
                    this.getCoverSection();
                } else if (sectionName === 'ATTACHMENT') {
                    this.getAttachmentSection();
                } else if (sectionName === 'MISC') {
                }
            }
        );
    }

    getUserInfo() {
        this.correspondenceDetailsService
            .GetUserInformation()
            .subscribe(userInfoVal =>
                this.userInfo = userInfoVal
            );
    }

    getTempFolderAttachments(corrflowType: string): void {
        this.correspondenceDetailsService.createTempAttachments(corrflowType).subscribe(
            tempAttachment => {
                this.corrFolderData = tempAttachment;
            }
        );
    }

    getCoverSection() {
        this.correspondenceDetailsService.getCoverFolderDetails(this.corrFolderData.AttachCorrCoverID).subscribe(
            coverFolderdetails => {
                this.CoverLetterData = coverFolderdetails;
                this.coverID = coverFolderdetails[0].myRows[0].Dataid;
            }
        );
    }

    getAttachmentSection() {
        this.correspondenceDetailsService.getAttachmentFolderDetails(this.corrFolderData.AttachCorrAttachmentsID).subscribe(
            attachmentFolderdetails => this.AttachmentFolderData = attachmentFolderdetails
        );
    }

    openBrowseDocument(event: any, elementID: string) {
        event.preventDefault();
        const element: HTMLElement = document.getElementById(elementID) as HTMLElement;
        element.click();
    }

    convertUndefindedOrNulltoemptyString(obj: any) {
        if (typeof obj == undefined || obj == null) {
            return '';
        } else { return obj; }
    }

    getTemplatesSectionData(corrFlowType: string, templateType: string = 'Default', onBehalfOf: string = '') {
        this.correspondenceDetailsService.getTemplatesList(corrFlowType, templateType, onBehalfOf).subscribe(
            listoftemplates => {
                this.templatesDocList = listoftemplates;
            }
        );
    }

}
