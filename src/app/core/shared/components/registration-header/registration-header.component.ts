import { Component, OnInit, Input } from '@angular/core';
import { Routes, Router } from '@angular/router';

@Component({
  selector: 'es-registration-header',
  templateUrl: './registration-header.component.html',
  styleUrls: ['./registration-header.component.css']
})
export class RegistrationHeaderComponent implements OnInit {

  @Input() isCustomerOption: boolean;

  constructor(private route: Router) { }

  ngOnInit() {
  }

  onSelectOption() {
    this.isCustomerOption ?
    this.route.navigateByUrl('registration/customer') :
    this.route.navigateByUrl('registration/company');
  }
}
