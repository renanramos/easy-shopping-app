import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Product } from 'src/app/core/models/product/product.model';
import { StockItem } from 'src/app/core/models/stock-item/stock-item.model';
import { ProductService } from 'src/app/core/service/product/product.service';
import { StockItemService } from 'src/app/core/service/stock-item/stock-item.service';
import { StockService } from 'src/app/core/service/stock/stock.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { amountValidator } from 'src/app/core/shared/validators/amount-validator';

@Component({
  selector: 'es-stock-item-detail',
  templateUrl: './stock-item-detail.component.html',
  styleUrls: ['./stock-item-detail.component.css'],
  providers: [StockItemService, ProductService, StockService]
})
export class StockItemDetailComponent implements OnInit {

  stockItem: StockItem;
  storeId: number = null;
  stockId: number = null;
  products: Product[] = [];
  stockItemForm: FormGroup;

  constructor(private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private snackBarService: SnackbarService,
    private dialogRef: MatDialogRef<StockItemDetailComponent>,
    private productService: ProductService,
    private stockItemService: StockItemService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  async ngOnInit() {
    this.setStockItemComponentProperties();
    this.createForm();
    await this.loadProductsByStoreId();
  }

  setStockItemComponentProperties() {
    this.stockItem = this.data['stockItem'] ? this.data['stockItem'] : new StockItem();
    this.storeId = this.stockItem['storeId'];
    this.stockId = this.stockItem['stockId'];
  }

  createForm() {
    this.stockItemForm = this.formBuilder.group({
      productId: [{
        value: this.stockItem['productId'],
        disabled: this.stockItem['id'] 
      }, [Validators.required]],
      maxAmount: [this.stockItem['maxAmount'], [Validators.required]],
      minAmount: [this.stockItem['minAmount'], [Validators.required]],
      currentAmount: [this.stockItem['currentAmount'], [Validators.required]]
    },
    {
      validators: [
        amountValidator('minAmount', 'maxAmount')
      ]
    })
  }

  async loadProductsByStoreId() {
    const receivedProducts = {
      next: (products: Product[]) => {
        if (products.length) {
          this.products = products;
        } else {
          this.productId.setErrors({
            'productsNotFound': true
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

  async submitStockItem() {
    this.stockItemForm.valid ?
     await this.handleStockItemOperation() :
      this.stockItemForm.markAllAsTouched();
  }

  validateCurrentAmount() {
    let currentAmount = Number(this.currentAmount.value);
    let minAmount = Number(this.minAmount.value);
    let maxAmount = Number(this.maxAmount.value);

    if (currentAmount > maxAmount) {
      this.currentAmount.setErrors({
        maxValueExceeded: true
      });
      this.currentAmount.markAsTouched();
    }

    if (currentAmount < minAmount) {
      this.currentAmount.setErrors({
        minValueExceeded: true
      });
      this.currentAmount.markAsTouched();
    }
  }

  async handleStockItemOperation() {
    const stockItem: StockItem = this.getStockItemValuesUpdated();
    this.stockItem['id'] ?
      await this.updateStockItem(stockItem) :
      await this.saveNewStockItem(stockItem) ;
  }

  async saveNewStockItem(stockItem: StockItem) {
    this.validateCurrentAmount();
    const stockItemCreated = {
      next: (stockItem: StockItem) => {
        this.dialogRef.close(stockItem);
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };

    await this.stockItemService.saveStockItems(stockItem)
      .pipe(tap(stockItemCreated))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  async updateStockItem(stockItem: StockItem) {
    stockItem['id'] = this.stockItem['id'];
    const stockItemCreated = {
      next: (stockItem: StockItem) => {
        this.dialogRef.close(stockItem);
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };

    await this.stockItemService.updateStockItem(stockItem)
      .pipe(tap(stockItemCreated))
      .toPromise()
      .then(() => true)
      .catch(() => false); 
  }

  getStockItemValuesUpdated(): StockItem {
    const stockItem: StockItem = this.stockItemForm.getRawValue();
    stockItem['maxAmount'] = Number(this.maxAmount.value);
    stockItem['minAmount'] = Number(this.minAmount.value);
    stockItem['currentAmount'] = Number(this.currentAmount.value);
    stockItem['stockId'] = this.stockId;
    stockItem['productName'] = this.products.find(prod => this.productId.value === prod['id'])['name'];
    return stockItem;
  }
}
