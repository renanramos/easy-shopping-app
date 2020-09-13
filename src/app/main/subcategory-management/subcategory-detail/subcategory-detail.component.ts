import { Component, OnInit } from '@angular/core';
import { SubcategoryService } from 'src/app/core/service/subcategory/subcategory.service';

@Component({
  selector: 'es-subcategory-detail',
  templateUrl: './subcategory-detail.component.html',
  styleUrls: ['./subcategory-detail.component.css'],
  providers: [SubcategoryService]
})
export class SubcategoryDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
