import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Admin } from 'src/app/core/models/admin/admin.model';
import { AdminService } from 'src/app/core/service/admin/admin.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { passwordMatcher } from 'src/app/core/shared/validators/password-matcher';

@Component({
  selector: 'es-admin-detail',
  templateUrl: './admin-detail.component.html',
  styleUrls: ['./admin-detail.component.css'],
  providers: [AdminService]
})
export class AdminDetailComponent implements OnInit {

  adminForm: FormGroup;
  administrator: Admin;
  passwordVisibility: boolean = false;
  passwordInputType: string = 'password';
  isCreatingAdmin: boolean = false;

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBarService: SnackbarService,
    private utilsService: UtilsService,
    private dialogRef: MatDialogRef<AdminDetailComponent>,
    private adminService: AdminService) { }

  ngOnInit() {
    this.administrator = this.data['admin'] ? this.data['admin'] : new Admin();
    this.isCreatingAdmin = this.data['isCreatingAdmin'];
    this.createForm();
    this.checkFields();
  }

  createForm() {
    this.adminForm = this.formBuilder.group({
      name: [ this.administrator['name'], [Validators.required]],
      email: [ this.administrator['email'], [Validators.required]],
      password: [this.administrator['password'], [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    },{
      validator: passwordMatcher('password', 'confirmPassword')
    });
  }

  async onSubmitAdministrator() {
    this.adminForm.invalid ?
      this.adminForm.markAllAsTouched() :
      await this.saveAdministrator();
  }

  checkFields() {
    if (!this.isCreatingAdmin) {
      this.adminForm.removeControl('password');
      this.adminForm.removeControl('confirmPassword');
    }
  }

  async saveAdministrator() {
    this.administrator['id'] ?
      await this.updateAdministrator() :
      await this.addNewAdministrator();
  }

  async addNewAdministrator() {
    const administrator = this.adminForm.getRawValue();

    const receivedAdministrator = {
      next: (administratorCreated: Admin) => {
        if (administratorCreated['id']) {
          this.dialogRef.close(administratorCreated);
        }
      },
      error: (error) => {
        const errorMessage = this.utilsService.handleErrorMessage(error);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    };

    await this.adminService.saveAdmin(administrator)
      .pipe(tap(receivedAdministrator))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  async updateAdministrator() {
    const administrator = this.adminForm.getRawValue();
    administrator['id'] = this.administrator['id'];

    const receivedAdminUpdated = {
      next: (administratorUpdated: Admin) => {
        if (administratorUpdated['id']) {
          this.dialogRef.close(administratorUpdated);
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    };

    await this.adminService.updateAdmin(administrator)
      .pipe(tap(receivedAdminUpdated))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  changeInputPasswordVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
    this.passwordVisibility ?
      this.passwordInputType = 'text' :
      this.passwordInputType = 'password';
  }

  get name() {
    return this.adminForm.get('name');
  }

  get email() {
    return this.adminForm.get('email');
  }

  get password() {
    return this.adminForm.get('password');
  }

  get  confirmPassword() {
    return this.adminForm.get('confirmPassword');
  }
}
 