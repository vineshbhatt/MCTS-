import { Component, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HttpErrorResponse,HttpClient } from '@angular/common/http';
import { multiLanguageTranslator } from 'src/assets/translator/index';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userData : string [];

  constructor(public profileDialog: MatDialogRef< ProfileComponent>,public translator : multiLanguageTranslator,private httpServices: HttpClient) { }

  ngOnInit() {
    this.httpServices.get('../../assets/Data/userdata.json').subscribe(
      data => {
        this.userData = data as string [];
      },
      (err: HttpErrorResponse) => {
        console.log (err.message,"user data");
      }
    );
  }
  profileClose(): void {
    this.profileDialog.close();
  }
}
