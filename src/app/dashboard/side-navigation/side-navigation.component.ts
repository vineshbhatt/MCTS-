import { Component, OnInit } from '@angular/core';
import { FCTSDashBoard } from '../../../environments/environment';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { AppLoadConstService } from 'src/app/app-load-const.service';
import { multiLanguageTranslator } from 'src/assets/translator/index';
@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html'
})
export class SideNavigationComponent implements OnInit {
  basehref: String = FCTSDashBoard.BaseHref;
  showMR = false;
  userData: string[];
  private _globalConstants = this.appLoadConstService.getConstants();

  constructor(
    private appLoadConstService: AppLoadConstService, private httpServices: HttpClient, public translator: multiLanguageTranslator
  ) { }

  ngOnInit() {
    this.showMR = this._globalConstants.general.showMR;
    this.httpServices.get('../../assets/Data/userdata.json').subscribe(
      data => {
        this.userData = data as string[];
        // console.log(this.userData);
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }

}
