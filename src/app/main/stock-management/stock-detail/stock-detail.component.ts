import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Stock } from 'src/app/core/models/stock/stock.model';
import { Store } from 'src/app/core/models/store/store.model';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { StockService } from 'src/app/core/service/stock/stock.service';
import { StoreService } from 'src/app/core/service/store/store.service';
import { UserRolesConstants } from 'src/app/core/shared/constants/user-roles-constants';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';

@Component({
  selector: 'es-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.css'],
  providers: [StockService, StoreService]
})
export class StockDetailComponent implements OnInit {

  stockForm: FormGroup;
  stores: Store[] = [];
  stock: Stock;

  constructor(private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private snackBarService: SnackbarService,
    private stockService: StockService,
    private storeService: StoreService,
    private securityUserService: SecurityUserService,
    private dialogRef: MatDialogRef<StockDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  async ngOnInit() {
    this.stock = this.data['stock'] ? this.data['stock'] : new Stock();
    this.createForm();
    await this.loadStores();
  }

  async loadStores() {
    const receivedStores = {
      next: (stores: Store[]) => {
        if (stores.length) {
          this.stores = stores;
        } else {
          this.storeId.setErrors({
            'storesNotFound': true
          });
          this.storeId.markAsTouched();
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };
    
    if (this.securityUserService.userLoggedRole == UserRolesConstants.COMPANY) {
      await this.storeService.getCompanyOwnStores(null, null, true)
        .pipe(tap(receivedStores))
        .toPromise()
        .then(() => true)
        .catch(() => false);      
    } else {
      await this.storeService.getStores(null, null, null, true)
        .pipe(tap(receivedStores))
        .toPromise()
        .then(() => true)
        .catch(() => false);
    }
  }

  createForm() {
    this.stockForm = this.formBuilder.group({
      name: [this.stock['name'], [Validators.required]],
      storeId: [{
        value: this.stock['storeId'] ? this.stock['storeId'] : null,
        disabled: this.stock['id']
      }, [Validators.required]]
    });
  }

  get name() {
    return this.stockForm.get('name');
  }

  get storeId() {
    return this.stockForm.get('storeId');
  }

  async submitStock() {
    this.stockForm.valid ?
      await this.handleStockOperation() :
      this.stockForm.markAsTouched();
  }

  async handleStockOperation() {
    const stock: Stock = this.stockForm.getRawValue();

    this.stock['id'] ?
      await this.updateStock(stock) :
      await this.saveStock(stock);
  }

  async saveStock(stock: Stock) {
    const receivedStock = {
      next: (stock: Stock) => {
        this.dialogRef.close(stock);
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };

    await this.stockService.saveStock(stock)
      .pipe(tap(receivedStock))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  async updateStock(stock: Stock) {
    stock['id'] = this.stock['id'];
    console.log(stock);
    const stockUpdated = {
      next: (stock: Stock) => {
        this.dialogRef.close(stock);
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };

    await this.stockService.updateStock(stock)
      .pipe(tap(stockUpdated))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
