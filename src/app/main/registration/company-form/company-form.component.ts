import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { passwordMatcher } from 'src/app/core/shared/validators/password-matcher';

@Component({
  selector: 'es-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {

companyForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.companyForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      registeredNumber: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    },
    {
     validator: passwordMatcher('password', 'confirmPassword')
    });
  }

  onSubmitCompany() {
    this.companyForm.invalid ?
      this.companyForm.markAllAsTouched() :
      this.saveCompany();
  }

  saveCompany() {
    console.log(this.companyForm.getRawValue());
  }

  get name() {
    return this.companyForm.get('name');
  }
  
  get registeredNumber() {
    return this.companyForm.get('registeredNumber');
  }

  get phone() {
    return this.companyForm.get('phone');
  }

  get email() {
    return this.companyForm.get('email');
  }

  get password() {
    return this.companyForm.get('password');
  }

  get confirmPassword() {
    return this.companyForm.get('confirmPassword');
  }
}
