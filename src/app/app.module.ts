import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { MatButtonModule, MatCheckboxModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatMenuModule } from "@angular/material/menu";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MalihuScrollbarModule } from "ngx-malihu-scrollbar";
import { DraftnamePipe } from "../app/dashboard/pipes/draftname.pipe";
import { ReactiveFormsModule } from '@angular/forms';
import { AppLoadConstService } from './app-load-const.service';


export function initApp(appInitService: AppLoadConstService) {
  return (): Promise<any> => {
    return appInitService.Init();
  };
}
@NgModule({
  declarations: [AppComponent, DraftnamePipe],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonModule,
    MatCheckboxModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MalihuScrollbarModule.forRoot(),
    ReactiveFormsModule
  ],
  exports: [MatButtonModule, MatCheckboxModule],
  providers: [
    AppLoadConstService, {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AppLoadConstService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
  // schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
