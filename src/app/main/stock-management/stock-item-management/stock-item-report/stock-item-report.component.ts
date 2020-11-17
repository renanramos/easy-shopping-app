import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { StockItem } from 'src/app/core/models/stock-item/stock-item.model';
import { StockItemService } from 'src/app/core/service/stock-item/stock-item.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';

@Component({
  selector: 'es-stock-item-report',
  templateUrl: './stock-item-report.component.html',
  styleUrls: ['./stock-item-report.component.css'],
  providers: [StockItemService]
})
export class StockItemReportComponent implements OnInit {

  stockId: number = null;
  stockItemsNotFound: boolean;
  stockItems: StockItem[] = [];

  constructor(private dialog: MatDialog,
    private snackBarService: SnackbarService,
    private utilsService: UtilsService,
    private stockItemService: StockItemService,
    private activatedRoute: ActivatedRoute) { }

  async ngOnInit() {
    this.getItemPropertyId();
    await this.loadStockItems();
  }

  getItemPropertyId() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id && Number(id)) {
      this.stockId = Number(id);
    }
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

    await this.stockItemService.getStockItems(this.stockId, null, null, true)
      .pipe(tap(stockItemsReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
