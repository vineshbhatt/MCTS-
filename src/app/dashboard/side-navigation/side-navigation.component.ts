import { Component, OnInit } from '@angular/core';
import {FCTSDashBoard} from '../../../environments/environment';
import { AppLoadConstService } from 'src/app/app-load-const.service';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html'
})
export class SideNavigationComponent implements OnInit {
  basehref: String = FCTSDashBoard.BaseHref;
  showMR = false;
  private _globalConstants = this.appLoadConstService.getConstants();

  constructor(
    private appLoadConstService: AppLoadConstService
  ) { }

  ngOnInit() {
    this.showMR = this._globalConstants.general.showMR;
  }

}
