import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { ProductService } from 'src/app/core/service/product/product.service';
import { StoreService } from 'src/app/core/service/store/store.service';
import { SubcategoryService } from 'src/app/core/service/subcategory/subcategory.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';

@Component({
  selector: 'es-product-deteail',
  templateUrl: './product-deteail.component.html',
  styleUrls: ['./product-deteail.component.css']
})
export class ProductDeteailComponent implements OnInit {

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
        private storeService: StoreService,
        private subcategoryService: SubcategoryService,
        private securityUserService: SecurityUserService,
        private productService: ProductService,
        private snackBarService: SnackbarService,
        private utilsService: UtilsService) { }

  ngOnInit() {

  }

}
