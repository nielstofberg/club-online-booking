import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-account-admin',
  templateUrl: './account-admin.component.html',
  styleUrls: ['./account-admin.component.scss']
})
export class AccountAdminComponent implements OnInit {
  _currentUser: User;
  _userList: User[];
  _changePassword: boolean = false;

  _userForm =  this.fb.group({
    id: ['', Validators.required],
    username: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: [''],
    userRole: ['', Validators.required],
    password: [''],
  });
;
  _passwordForm: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService) { 
    this._currentUser = authService.getCurrentUser();
  }

  ngOnInit(): void {
    this._userForm.setValue(this._currentUser);
    this.authService.getAllUsers().subscribe(ret => {
      this._userList = ret;
    });
    /*
    this.fb.group({
      id: [this._currentUser.id, Validators.required],
      username: [this._currentUser.username, Validators.required],
      firstName: [this._currentUser.firstName, Validators.required],
      lastName: [this._currentUser.lastName],
      userRole: [this._currentUser.userRole, Validators.required]
    });
*/
    this._passwordForm =  this.fb.group({
      id: [this._currentUser.id, Validators.required],
      oldPassword: ['', Validators.required],
      newPassword1: ['', Validators.required],
      newPassword2: ['', Validators.required]
    },
    {
      validators: [this.passwordsMatch]
    });
  }

  onUserSubmit() {
    if (this._userForm.valid) {
      if (this._currentUser != null && this._userForm.dirty) {
        var user: User = this._userForm.value;
        this.authService.updateUser(user).subscribe(() => {
          localStorage.setItem('currentUser', JSON.stringify(user));
        });
      }
    }
  }

  cancelPasswordForm() {
    this._passwordForm.setValue({id: 0, oldPassword: '', newPassword1: '', newPassword2: ''});
    this._changePassword = false;
  }

  cancel() {
    this.router.navigate(['/bookingview']);
  }

  onPasswordSubmit() {
    if (this._passwordForm.valid) {
      if (this._currentUser != null && this._passwordForm.dirty) {
        let id = this._passwordForm.get('id').value;
        let oldPw = this._passwordForm.get('oldPassword').value;
        let newPw1 = this._passwordForm.get('newPassword1').value;
        let newPw2 = this._passwordForm.get('newPassword2').value;
        if (newPw1 != newPw2) {
          return;
        }

        this.authService.updatePassword(id, oldPw, newPw1).subscribe(() => {
          this.authService.login(this._currentUser.username, newPw1);
          this._passwordForm.setValue({id: 0, oldPassword: '', newPassword1: '', newPassword2: ''});
          this._changePassword = false;
        });
      }
    }
  }
  
  passwordsMatch(formGroup: FormGroup) {
    const password = formGroup.get('newPassword1');
    const confirmPassword = formGroup.get('newPassword2');
  
    if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
      return null;
    }
  
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ confirmPassword: true });
    } else {
      confirmPassword.setErrors(null);
    }
  }
}
