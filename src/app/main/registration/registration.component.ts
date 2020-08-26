import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'es-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  customerOption: string = 'customer';

  constructor() { }

  ngOnInit() {
  }

}
