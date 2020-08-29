import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserAuthService } from '../../../core/service/auth/user-auth-service.service';
import { Login } from 'src/app/core/models/user/login.model';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';

@Component({
  selector: 'es-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  isValidatingLogin: boolean = false;
  loginForm: FormGroup = null;

  constructor(
    private dialogRef: MatDialogRef<LoginFormComponent>,
    private formBuider: FormBuilder,
    private authService: UserAuthService,
    private snackBarService: SnackbarService) { }

  async ngOnInit() {
   await this.initializeLoginForm();
  }

  async initializeLoginForm() {
    this.loginForm = await this.formBuider.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  
  async onSubmitLogin() {
    if (this.loginForm.valid) {
      await this.authenticateUser(this.loginForm.getRawValue());
    } else {
      this.loginForm.updateValueAndValidity();
      this.loginForm.markAllAsTouched();
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  async authenticateUser(login: Login) {
    this.isValidatingLogin = true;
    const receiveUserCredentials = {
      next: (userCredentials) => {
        this.isValidatingLogin = false;
        this.dialogRef.close(userCredentials);
      },
      error: (response) => {
        this.isValidatingLogin = false;
        this.loginForm.markAllAsTouched();
        this.snackBarService.openSnackBar(response.error.message);
      }
    }
    await this.authService.login(login)
    .pipe(tap(receiveUserCredentials))
    .toPromise()
    .then()
    .catch();
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }
}
