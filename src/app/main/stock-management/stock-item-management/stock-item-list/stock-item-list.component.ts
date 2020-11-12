import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { StockItem } from 'src/app/core/models/stock-item/stock-item.model';
import { Stock } from 'src/app/core/models/stock/stock.model';
import { StockItemService } from 'src/app/core/service/stock-item/stock-item.service';
import { StockService } from 'src/app/core/service/stock/stock.service';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { ScrollValues } from 'src/app/core/shared/constants/scroll-values';
import { SearchService } from 'src/app/core/shared/service/search-service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { StockItemDetailComponent } from '../stock-item-detail/stock-item-detail.component';

@Component({
  selector: 'es-stock-item-list',
  templateUrl: './stock-item-list.component.html',
  styleUrls: ['./stock-item-list.component.css'],
  providers: [StockItemService, StockService]
})
export class StockItemListComponent implements OnInit {

  stockId: number = null;
  stockItems: StockItem[] = [];
  stockItemsNotFound: boolean = false;
  pageNumber: number = ScrollValues.DEFAULT_PAGE_NUMBER;
  stock: Stock;

  searchSubscription: Subscription;
  filterName: string = '';

  dialogStockItemDetailRef: MatDialogRef<StockItemDetailComponent>;

  constructor(
    private dialog: MatDialog,
    private snackBarService: SnackbarService,
    private utilsService: UtilsService,
    private stockItemService: StockItemService,
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService,
    private stockService: StockService) { }

  async ngOnInit() {
    this.hasItemPropertyId();
    this.subscribeToSearchService();
    await this.loadStockItems();
    await this.loadStockInfo();
  }

  async loadStockInfo() {
    const stockReceived = {
      next: (stock: Stock) => {
        if (stock) {
          this.stock = stock;
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };

    await this.stockService.getStockById(this.stockId)
      .pipe(tap(stockReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  subscribeToSearchService() {
    this.searchSubscription = this.searchService.searchSubject$
    .subscribe((value) => {
      this.pageNumber = ScrollValues.DEFAULT_PAGE_NUMBER;
      this.filterName = value;
      this.stockItems = [];
      this.loadStockItems();
    });
  }

  async loadStockItems() {
    const stockItemsReceived = {
      next: (stockItems: StockItem[]) => {
        if (stockItems.length) {
          this.stockItems = [...this.stockItems, ...stockItems];
        } else {
          this.stockItemsNotFound = true;
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
        this.stockItemsNotFound = true;
      }
    };

    await this.stockItemService.getStockItems(this.stockId, this.pageNumber, this.filterName)
      .pipe(tap(stockItemsReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  hasItemPropertyId() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id && Number(id)) {
      this.stockId = Number(id);
      return true;
    }
    return false;
  }

  onScroll() {
    this.pageNumber += 1;
    this.loadStockItems();
  }

  onAddNewItem() {

    let stockItem: StockItem = new StockItem();

    stockItem['storeId'] = this.stock['storeId'];

    this.dialogStockItemDetailRef = this.dialog.open(StockItemDetailComponent, {
      data: { stockItem: stockItem },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    const closedDialog = {
      next: (stockItem: StockItem) => {
        if (stockItem) {
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_CREATED);
          this.reloadListOfItens();
        }
      }
    };

    this.dialogStockItemDetailRef.afterClosed().subscribe(closedDialog);
  }

  openEditStockItem(item: StockItem) {
    this.dialogStockItemDetailRef = this.dialog.open(StockItemDetailComponent, {
      data: { stockItem: item },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-small-dialog'
    });

    const closedDialog = {
      next: (stockItem: StockItem) => {
        if (stockItem) {
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_UPDATED);
          this.reloadListOfItens();
        }
      }
    };

    this.dialogStockItemDetailRef.afterClosed().subscribe(closedDialog);
  }

  reloadListOfItens() {
    this.stockItems = [];
    this.pageNumber = ScrollValues.DEFAULT_PAGE_NUMBER;
    this.loadStockItems();
  }
}
