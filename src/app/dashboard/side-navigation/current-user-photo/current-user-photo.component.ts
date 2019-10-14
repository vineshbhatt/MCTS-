import { Component, OnInit } from '@angular/core';
import { SidebarInfoService } from '../sidebar-info.service';
import { SidebarUsersInfo , UserInfo } from '../sidebar-info.model';
import {DomSanitizer} from '@angular/platform-browser';
import { AppLoadConstService } from 'src/app/app-load-const.service';
import { UserInfoComponent } from '../user-info/user-info.component';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';

@Component({
  selector: 'app-current-user-photo',
  templateUrl: './current-user-photo.component.html',
})
export class CurrentUserPhotoComponent extends UserInfoComponent implements OnInit {

  constructor(
    public sidebarInfoService: SidebarInfoService,
    public sanitizer: DomSanitizer,
    public appLoadConstService: AppLoadConstService,
    public errorHandlerFctsService: ErrorHandlerFctsService,
  ) {
    super( sidebarInfoService, sanitizer, appLoadConstService, errorHandlerFctsService);
   }

  ngOnInit() {
    this.userPhoto = undefined;
    this.sidebarInfoService.getUserInfo(this.getProxyUser()).subscribe(
      response => {
        if (response.results.data.properties.photo_id) {
          this.getUserImg(this.getProxyUser());
        } else {
          this.initials = response.results.data.properties.initials;
        }
      },
      responseError => {
        this.errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }
}
