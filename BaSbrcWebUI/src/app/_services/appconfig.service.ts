import { Injectable, Inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core/testing';

@Injectable({
    providedIn: 'root'
  })
  export class AppConfigService {
  
    private appConfig: any;
  
    constructor(private http: HttpClient,
        //@Inject('BASE_URL') private baseUrl: string
        ) { }
  
    loadAppConfig() {
      return this.http.get('./assets/appconfig.json')
        .toPromise()
        .then(data => {
          this.appConfig = data;
        });
    }
  
    // This is an example property ... you can make it however you want.
    get apiBaseUrl() : string {
        if (!this.appConfig) {
            return '';
        }
        if (isDevMode()) {
            return this.appConfig.apiBaseUrl_dev;
        }
        else {
            return this.appConfig.apiBaseUrl;
        }
    }

    get autoLogout() {
      if (!this.appConfig) {
        return 12;
      }
      return this.appConfig.autoLogout;
    }
  }