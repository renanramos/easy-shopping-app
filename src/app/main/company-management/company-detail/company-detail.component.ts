import { Component, OnInit, Inject } from '@angular/core';
import { CompanyService } from 'src/app/core/service/company/company.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Company } from 'src/app/core/models/registration/company.model';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'es-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
  providers: [CompanyService]
})
export class CompanyDetailComponent implements OnInit {

  company: Company;
  companyForm: FormGroup;
  isWaitingResponse: boolean = false;

  constructor(private companyService: CompanyService,
    private snackBarService: SnackbarService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CompanyDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.company = this.data['company'];
    this.createForm();
  }

  createForm() {
    this.companyForm = this.formBuilder.group({
      name: [this.company['name'], [Validators.required]],
      email: [this.company['email'], [Validators.required]],
      phone: [this.company['phone'], [Validators.required]],
      registeredNumber: [this.company['registeredNumber'], [Validators.required]]
    });
  }

  async submitCompanyUpdated() {
    this.companyForm.invalid ?
    this.companyForm.markAllAsTouched() :
    await this.updateCompany();
  }

  async updateCompany() {
    const company = this.companyForm.getRawValue();
    company['id'] = this.company['id'];
    this.isWaitingResponse = true;

    const receivedCompanyUpdate = {
      next: (companyUpdated) => {
        if (companyUpdated) {
          this.dialogRef.close(companyUpdated);
        }
        this.isWaitingResponse = false;
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
        this.isWaitingResponse = false;
      }
    }

    await this.companyService.updateCompany(company)
    .pipe(tap(receivedCompanyUpdate))
    .toPromise()
    .then(() => true)
    .catch(() => false);
  }

  get name() {
    return this.companyForm.get('name');
  }

  get email() {
    return this.companyForm.get('email');
  }

  get phone() {
    return this.companyForm.get('phone');
  }

  get registeredNumber() {
    return this.companyForm.get('registeredNumber');
  }

}
