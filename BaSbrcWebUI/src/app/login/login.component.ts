import { Component } from '@angular/core';
import { BookingService } from '../_services/booking.service';
import { Session } from '../_models/session';
import { Booking } from '../_models/booking';
import { Event, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  _failMsg: string = null;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';


  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onLoginFormSubmit() {
    this.submitted = true;

    if (!this.loginForm.valid) {
      return;
    }

    this.loading = true;

    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(data => {
        if (data.userRole.includes('Admin')) {
          this.router.navigate(['/bookingview/']);
        }
        else if (data.userRole.includes('RangeOfficer')) {
          this.router.navigate(['/sessions/']);
        }
        else {
          this.router.navigate([this.returnUrl]);
        }
      },
      error => {
        this._failMsg = error.error.message;
        this.loading = false;
      });
  }
}
