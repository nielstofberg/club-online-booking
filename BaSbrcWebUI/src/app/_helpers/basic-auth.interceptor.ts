import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with basic auth credentials if available
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let authdata = JSON.parse(localStorage.getItem('authdata'));
        if (currentUser && authdata) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Basic ${authdata}`
                }
            });
        }
        else {
            console.debug("Not logged in.");
        }

        return next.handle(request);
    }
}