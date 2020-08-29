import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'es-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {

  customerFormGroup: FormGroup;

  constructor(private formBuider: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.customerFormGroup = this.formBuider.group({
      name: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
    });
  }
}
