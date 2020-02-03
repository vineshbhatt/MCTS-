import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CorrespondenceShareService } from 'src/app/dashboard/services/correspondence-share.service';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { forEach } from '@angular/router/src/utils/collection';
import { FormControl } from '@angular/forms';
import { FCTSDashBoard } from 'src/environments/environment';


export interface FolderProperties {
  folderHierarchy: FolderHierarchy[];
  folderFiles: FolderFiles[];
}

export interface FolderHierarchy {
  DataID: string;
  ParentID: string;
  Name: string;
  Level: string;
}

export interface FolderFiles {
  position: number;
  DataID: number;
  Name: string;
  VersionNum: string;
  ModifyDate: string;
  CreateDate: string;
  Size: string;
  MimeType: string;
  Type: string;
}

@Component({
  selector: 'app-files-select',
  templateUrl: './files-select.component.html',
  styleUrls: ['./files-select.component.scss']
})
export class FilesSelectComponent implements OnInit {

  public folderProp: FolderProperties;
  public hierarchy: FormControl;
  public folderParent: string;
  public activeSearchSpinner = false;
  public dataSource;
  public currentFolderID;
  public basehref: String = FCTSDashBoard.BaseHref;
  public currentReferenceID;
  @Input() DataID: string;
  @Input() multiple: boolean;
  @Output() backtodoc = new EventEmitter<number>();
  // table fields
  FilesDisplayedColumns: string[] = ['Select', 'Type', 'Name', 'Size'];
  // objects for tables loop
  FilesTableStructure = [
    { 'columnDef': 'Type', 'columnName': 'Type', 'width': '5' },
    { 'columnDef': 'Name', 'columnName': 'Name', 'width': '75' },
    { 'columnDef': 'Size', 'columnName': 'Size', 'width': '15' }
  ];
  // TODO constants for correspondence insert (make it global)
  InsertFileConstants = {
    'ConnectedType': 'Dtree',
    'ReferenceType': 'Correspondence',
    'ConnectionType': '1',
    'Deleted': '0'
  };

  constructor(
    public correspondenceShareService: CorrespondenceShareService,
    public errorHandlerFctsService: ErrorHandlerFctsService) { }
  selection = new SelectionModel<FolderFiles>(true, []);

  ngOnInit() {
    this.currentReferenceID = this.DataID;
    this.getParentFolderProperties(this.currentReferenceID);
  }

  threadedMoving(DataID) {
    this.currentReferenceID = DataID;
    this.getParentFolderProperties(this.currentReferenceID);
  }

  getFolderProperties(folder_id: string) {
    this.activeSearchSpinner = true;
    this.correspondenceShareService.getFolderProperties(folder_id).subscribe(
      response => {
        this.folderProp = response;
        this.dataSource = new MatTableDataSource<FolderFiles>(response.FolderFiles);
        if ( response.hasOwnProperty('FolderHierarchy') &&  response.FolderHierarchy.length > 0 ) {
          this.hierarchy = new FormControl(response.FolderHierarchy[response.FolderHierarchy.length - 1].DataID);
          this.folderParent = response.FolderHierarchy[response.FolderHierarchy.length - 1].ParentID;
        }
/*         this.hierarchy = new FormControl(response.FolderHierarchy[response.FolderHierarchy.length - 1].DataID);
        this.folderParent = response.FolderHierarchy[response.FolderHierarchy.length - 1].ParentID; */
        this.activeSearchSpinner = false;
      },
      responseError => {
        this.errorHandlerFctsService.handleError(responseError).subscribe();
        this.activeSearchSpinner = false;
      }
    );
  }

  getParentFolderProperties(folder_id: string) {
    this.activeSearchSpinner = true;
    this.correspondenceShareService.getParentFolderProperties(folder_id).subscribe(
      response => {
        this.folderProp = response;
        this.dataSource = new MatTableDataSource<FolderFiles>(response.FolderFiles);
        if ( response.hasOwnProperty('FolderHierarchy') &&  response.FolderHierarchy.length > 0 ) {
          this.hierarchy = new FormControl(response.FolderHierarchy[response.FolderHierarchy.length - 1].DataID);
          this.folderParent = response.FolderHierarchy[response.FolderHierarchy.length - 1].ParentID;
        }
        this.activeSearchSpinner = false;
      },
      responseError => {
        this.errorHandlerFctsService.handleError(responseError).subscribe();
        this.activeSearchSpinner = false;
      }
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: FolderFiles): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  changeCheckbox(event, row: FolderFiles): void {
    if (event && !this.multiple) {
      this.selection.clear();
      this.selection.toggle(row);
    } else if (event) {
      this.selection.toggle(row);
    }
  }

  BackToDocList(): void {
    this.backtodoc.next(0);
  }

  addFileConnection() {
    let arr = new Array;
    this.selection.selected.forEach(element => {
      arr.push(element.DataID);
    });
    this.correspondenceShareService.insertDocConnection(this.currentReferenceID, arr.join(), this.InsertFileConstants)
      .subscribe(response => {
        this.selection.clear();
        this.BackToDocList();
      },
        responseError => {
          this.errorHandlerFctsService.handleError(responseError).subscribe();
        });
  }

}
