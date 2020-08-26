import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {

  companyOption = 'company';

  constructor() { }

  ngOnInit() {
    console.log(this.companyOption);
  }

}
