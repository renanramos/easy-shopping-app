import { Component, OnInit } from '@angular/core';
import { SubcategoryService } from 'src/app/core/service/subcategory/subcategory.service';

@Component({
  selector: 'es-subcategory-list',
  templateUrl: './subcategory-list.component.html',
  styleUrls: ['./subcategory-list.component.css'],
  providers: [SubcategoryService]
})
export class SubcategoryListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
