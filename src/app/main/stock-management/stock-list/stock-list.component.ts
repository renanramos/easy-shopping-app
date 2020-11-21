import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Stock } from 'src/app/core/models/stock/stock.model';
import { StockService } from 'src/app/core/service/stock/stock.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { ScrollValues } from 'src/app/core/shared/constants/scroll-values';
import { SearchService } from 'src/app/core/shared/service/search-service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { StockDetailComponent } from '../stock-detail/stock-detail.component';

@Component({
  selector: 'es-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css'],
  providers: [StockService]
})
export class StockListComponent implements OnInit {

  pageNumber: number = ScrollValues.DEFAULT_PAGE_NUMBER;
  stocksNotFound: boolean = false;
  stocks: Stock[] = [];
  
  searchSubscription: Subscription;
  filterName: string = '';

  dialogRef: MatDialogRef<StockDetailComponent>;
  dialogRefConfirm: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private snackBarService: SnackbarService,
    private stockService: StockService,
    private searchService: SearchService) { }

  async ngOnInit() {
    this.subscribeToSearchService();
    await this.loadStocks();
  }

  subscribeToSearchService() {
    this.searchService.hideSearchField.next(false);
    this.searchSubscription = this.searchService.searchSubject$
    .subscribe((value) => {
      this.pageNumber = ScrollValues.DEFAULT_PAGE_NUMBER;
      this.filterName = value;
      this.stocks = [];
      this.loadStocks();
    });
  }

  async loadStocks() {

    const receivedStocks = {
      next: (stocks: Stock[]) => {
        if (stocks.length) {
          this.stocks = [...this.stocks, ...stocks];
        } else {
          this.stocksNotFound = true;
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };

    await this.stockService.getStocks(null, this.pageNumber, this.filterName)
      .pipe(tap(receivedStocks))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  onScroll() {
    this.pageNumber += 1;
    this.loadStocks();
  }

  reloadListOfItens() {
    this.stocks = [];
    this.pageNumber = ScrollValues.DEFAULT_PAGE_NUMBER;
    this.loadStocks();
  }

  onAddNewStock() {
    this.dialogRef = this.dialog.open(StockDetailComponent, {
      data: { store: new Stock()},
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    const stockCreated = {
      next: (stock: Stock) => {
        if (stock) {
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_CREATED);
          this.reloadListOfItens();
        }
      }
    }

    this.dialogRef.afterClosed().subscribe(stockCreated);
  }

  openEditStock(stock: Stock) {
    this.dialogRef = this.dialog.open(StockDetailComponent, {
      data: { stock: stock},
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    const stockCreated = {
      next: (stock: Stock) => {
        if (stock) {
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_UPDATED);
          this.reloadListOfItens();
        }
      }
    }

    this.dialogRef.afterClosed().subscribe(stockCreated);
  }

  openRemoveStock(stock: Stock) {
    this.dialogRefConfirm = this.dialog.open(ConfirmDialogComponent, {
      data: stock,
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-small-dialog'
    });

    const closedDialog = {
      next: (response) => {
        if (response) {
         this.removeStock(stock.id);
        }
      }
    };

    this.dialogRefConfirm.afterClosed().subscribe(closedDialog); 
  }

  async removeStock(stockId: number) {
    
    const stockRemoved = {
      next: (removedResponse) => {
        this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_REMOVED);
        this.reloadListOfItens();
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    }

    await this.stockService.removeStock(stockId)
      .pipe(tap(stockRemoved))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
