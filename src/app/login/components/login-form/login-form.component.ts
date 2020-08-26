import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { UserAuthService } from '../../../core/service/auth/user-auth-service.service';
import { Login } from 'src/app/core/models/user/login.model';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup = null;

  constructor(
    private dialogRef: MatDialogRef<LoginFormComponent>,
    private formBuider: FormBuilder,
    private authService: UserAuthService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.initializeLoginForm();
  }

  initializeLoginForm() {
    this.loginForm = this.formBuider.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  
  async onSubmitLogin() {
    if (this.loginForm.valid) {
      await this.authenticateUser(this.loginForm.getRawValue());
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  async authenticateUser(login: Login) {
    
    const receiveUserCredentials = {
      next: (userCredentials) => {
        this.dialogRef.close(userCredentials);
      },
      error: (response) => {
        this.loginForm.markAllAsTouched();
        this.snackBar.open(response.error.message, 'close');
      }
    }

    await this.authService.login(login)
    .pipe(tap(receiveUserCredentials))
    .toPromise()
    .then()
    .catch();
  }

  get loginFormControls() {
    return this.loginForm
  }
}
