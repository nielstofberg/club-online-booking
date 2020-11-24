import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';

// Helpers
import { BasicAuthInterceptor } from './_helpers/basic-auth.interceptor';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {LoginComponent} from './login/login.component'
import {BookingNewComponent} from './booking-new/booking-new.component'
import {BookingViewComponent} from './booking-view/booking-view.component'
import { AppConfigService } from './_services/appconfig.service'
import { AuthGuard } from './_helpers/auth.guard';
import { AccountAdminComponent } from './account-admin/account-admin.component';
import { SessionsComponent } from './sessions/sessions.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    BookingNewComponent,
    BookingViewComponent,
    AccountAdminComponent,
    SessionsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: '', component: BookingNewComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent},
      { path: 'bookingnew', component: BookingNewComponent, canActivate: [AuthGuard] },
      { path: 'bookingview', component: BookingViewComponent, canActivate: [AuthGuard], data: {roles: ['Admin']}  },
      { path: 'accountadmin', component: AccountAdminComponent, canActivate: [AuthGuard], data: {roles: ['Admin']}  },
      { path: 'sessions', component: SessionsComponent, canActivate: [AuthGuard], data: {roles: ['Admin','RangeOfficer']}  }
    ])
  ],
  providers: [
    { 
      provide: APP_INITIALIZER, multi: true, deps: [AppConfigService], 
        useFactory: (appConfigService: AppConfigService) => {
          return () => {
          //Make sure to return a promise!
            return appConfigService.loadAppConfig();
          };
        }
    },
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: 'BASE_URL', multi: true, deps: [AppConfigService],
        useFactory: (appConfig: AppConfigService) =>{
            if (appConfig.apiBaseUrl.length == 0){
              return document.getElementsByTagName('base')[0].href;
            }
            else {
              return appConfig.apiBaseUrl;
            }
        }
    }
 ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function getBaseUrl() {  
  return document.getElementsByTagName('base')[0].href;
}
