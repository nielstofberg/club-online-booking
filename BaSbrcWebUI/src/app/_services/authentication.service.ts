import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map } from 'rxjs/operators';
import { AppConfigService } from './appconfig.service';
import { User } from '../_models/user';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private timeout: number = 600000; //ms before user times out
  public user: User;
  timeoutSubscription = new Subscription()

  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {
      this.user = this.getCurrentUser();
  }

  login(username: string, password: string) {
    return this.http.post<User>(`${this.baseUrl}api/users/authenticate/`, { username, password })
      .pipe(map(usr => {
        // login successful if there's a user in the response
        if (usr) {
          // store user details and basic auth credentials in local storage 
          // to keep user logged in between page refreshes
          var authdata = window.btoa(username + ':' + password);
          localStorage.setItem('currentUser', JSON.stringify(usr));
          localStorage.setItem('authdata', JSON.stringify(authdata));
          this.user = usr;
          this.expirationCounter();
        }
        return usr;
      }));
  }

  expirationCounter() {
    this.timeoutSubscription.unsubscribe();
    this.timeoutSubscription = of(null).pipe(delay(this.timeout)).subscribe((expired) => {
      console.log('EXPIRED!!');
      this.logout();
      this.router.navigate(["/login"]);
    });
  }


  isAuthenticated(): boolean {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let authdata = JSON.parse(localStorage.getItem('authdata'));
     if (currentUser && authdata) {
      return true;
    }
    else {
      return false;
    }
  }

  getCurrentUser(): User {
    let currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
    let authdata: User = JSON.parse(localStorage.getItem('authdata'));
    if (currentUser && authdata) {
      return currentUser;
    }
    else {
      return null;
    }
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authdata');
    this.user = null;
  }

  getAllUsers() : Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'api/users/');
  }

  updateUser(user: User) : Observable<User> {
    user.password = '*****'; // This value never gets saved
    return this.http.put<User>(this.baseUrl + 'api/users/' + user.id, user);

  }

  updatePassword(id: number,oldpassword: string, newpassword: string) : Observable<any>  {
    return this.http.put<User>(`${this.baseUrl}api/users/updatepw/${id}/`, {oldpassword, newpassword});
  }

}
