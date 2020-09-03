import { Component, OnInit } from '@angular/core';
import { AdministrationService } from 'src/app/dashboard/administration/services/administration.service';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {
  structureJson: any;

  constructor(
    public _router: Router
    , private _administration: AdministrationService
    , private _errorHandlerFctsService: ErrorHandlerFctsService) { }

  ngOnInit() {
    this.getAdminPageStructure();
  }

  getAdminPageStructure(): void {
    this._administration.getAdminPageStructure().subscribe(
      response => {
        this.structureJson = response;
      },
      responseError => {
        this._errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }

}
