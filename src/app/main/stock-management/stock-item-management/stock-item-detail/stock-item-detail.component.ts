import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Product } from 'src/app/core/models/product/product.model';
import { StockItem } from 'src/app/core/models/stock-item/stock-item.model';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { ProductService } from 'src/app/core/service/product/product.service';
import { StockItemService } from 'src/app/core/service/stock-item/stock-item.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';

@Component({
  selector: 'es-stock-item-detail',
  templateUrl: './stock-item-detail.component.html',
  styleUrls: ['./stock-item-detail.component.css'],
  providers: [StockItemService, ProductService]
})
export class StockItemDetailComponent implements OnInit {

  stockItem: StockItem;
  storeId: number = null;
  products: Product[] = [];
  stockItemForm: FormGroup;

  constructor(private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private snackBarService: SnackbarService,
    private securityUserService: SecurityUserService,
    private dialogRef: MatDialogRef<StockItemDetailComponent>,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  async ngOnInit() {
    this.stockItem = this.data['stockItem'] ? this.data['stockItem'] : new StockItem();
    this.createForm();
    await this.loadProductsByStoreId();
  }

  createForm() {
    this.stockItemForm = this.formBuilder.group({
      productId: [this.stockItem['productId'], [Validators.required]],
      maxAmount: [this.stockItem['maxAmount'], [Validators.required]],
      minAmount: [this.stockItem['minAmount'], [Validators.required]],
      currentAmount: [this.stockItem['currentAmount'], [Validators.required]]
    })
  }

  async loadProductsByStoreId() {
    const receivedProducts = {
      next: (products: Product[]) => {
        if (products.length) {
          this.products = products;
        } else {
          this.productId.setErrors({
            'productsNotFoun': true
          })
          this.productId.markAsTouched();
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    }

    await this.productService.getProducts(null, null, this.storeId)
      .pipe(tap(receivedProducts))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  get productId() {
    return this.stockItemForm.get('productId');
  }

  get maxAmount() {
    return this.stockItemForm.get('maxAmount');
  }

  get minAmount() {
    return this.stockItemForm.get('minAmount');
  }

  get currentAmount() {
    return this.stockItemForm.get('currentAmount');
  }

  submitStockItem() {
    console.log(this.stockItemForm.getRawValue());
  }
}
