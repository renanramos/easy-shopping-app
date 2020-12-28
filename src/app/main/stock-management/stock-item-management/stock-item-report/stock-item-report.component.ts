import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { tap } from 'rxjs/operators';

import { Product } from 'src/app/core/models/product/product.model';
import { StockItem } from 'src/app/core/models/stock-item/stock-item.model';
import { ProductService } from 'src/app/core/service/product/product.service';
import { StockItemService } from 'src/app/core/service/stock-item/stock-item.service';
import { SearchService } from 'src/app/core/shared/service/search-service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';

@Component({
  selector: 'es-stock-item-report',
  templateUrl: './stock-item-report.component.html',
  styleUrls: ['./stock-item-report.component.css'],
  providers: [StockItemService, ProductService]
})
export class StockItemReportComponent implements OnInit, OnDestroy {

  stockId: number = null;
  stockItemsNotFound: boolean = false;
  stockItems: StockItem[] = [];
  products: Product[] = [];

  reportForm: FormGroup;
  isBarChart: boolean = true;

  barChartOptions: ChartOptions;

  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataSets[] = [];

  pieChartOptions: ChartOptions= {
    responsive: true,
    legend: {
      position: 'top'
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };

  pieChartType: ChartType = 'pie';
  pieChartData: number[] = [];
  pieChartColors = [];
  pieChartLegend = true;
  pieChartLabels: Label[] = ['Saldo atual', 'Saldo máximo', 'Saldo mínimo'];

  totalCurrentAmount: number = 0;
  totalMaximumAmount: number = 0;
  totalMinimumAmount: number = 0;  

  constructor(
    private formBuilder: FormBuilder,
    private snackBarService: SnackbarService,
    private utilsService: UtilsService,
    private stockItemService: StockItemService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService) { }

  async ngOnInit() {
    this.setFilterForm();
    await this.initializeComponentsProperties();
    this.searchService.hideSearchField.next(true);
  }

  setFilterForm() {
    this.reportForm = this.formBuilder.group({
      product: [null],
      store: [null]
    });
  }

  async loadProducts() {
    const productsReceived = {
      next: (products: Product[]) => {
        if(products.length) {
          this.products = products;
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };

    await this.productService.getProducts()
      .pipe(tap(productsReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  ngOnDestroy(): void {
    this.searchService.hideSearchField.next(false);
  }

  setPieChartProperties() {
    this.pieChartColors =[
      {
        backgroundColor: ['rgb(255, 161, 181)', 'rgb(255, 226, 154)', '#86c7f3'],
      }
    ];
    this.pieChartLabels = ['Saldo atual', 'Saldo máximo', 'Saldo mínimo'];
  }

  setBarChartProperties() {
    this.barChartOptions = {
      responsive: true,
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        }
      }
    };
    this.barChartData = [
      {data: [], label: 'Atual'},
      {data: [], label: 'Mínimo'},
      {data: [], label: 'Máximo'}
    ];
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
          this.stockItems = stockItems;
          this.prepareChartData();
          this.generatePizzaData();
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

  prepareChartData() {
    this.stockItems.forEach(stockItem => {
      this.barChartLabels.push(stockItem['productName']);
      this.barChartData[0].data.push(stockItem['currentAmount']);
      this.barChartData[1].data.push(stockItem['minAmount']);
      this.barChartData[2].data.push(stockItem['maxAmount']);
    });
  }

  generatePizzaData() {
    if (this.stockItems.length) {
      this.totalCurrentAmount = this.stockItems.filter(stockItem => stockItem['currentAmount']).map( stockItem => stockItem['currentAmount']).reduce((a, b) => a + b);
      this.totalMaximumAmount = this.stockItems.filter(stockItem => stockItem['maxAmount']).map( stockItem => stockItem['maxAmount']).reduce((a, b) => a + b);
      this.totalMinimumAmount = this.stockItems.filter(stockItem => stockItem['minAmount']).map( stockItem => stockItem['minAmount']).reduce((a, b) => a + b);
    }
    this.pieChartData = [this.totalCurrentAmount, this.totalMaximumAmount, this.totalMinimumAmount];
  }

  get productId() {
    return this.reportForm.get('product');
  }

  get storeId() {
    return this.reportForm.get('store');
  }

  async onSelectProduct() {
    await this.initializeComponentsProperties();
    if (this.productId.value) {
      this.stockItems = this.stockItems.filter(prod => prod['productId'] === this.productId.value);
    }
    this.resetGraphicProperties();
    this.prepareChartData();
    this.generatePizzaData();
  }

  async removeFilter(){
    await this.initializeComponentsProperties();
    this.productId.setValue(null);
    this.storeId.setValue(null);
  }
  
  async initializeComponentsProperties() {
    this.resetGraphicProperties();
    this.getItemPropertyId();
    await this.loadStockItems();
    await this.loadProducts();
  }

  changeGraphicFormat() {
    this.isBarChart = !this.isBarChart;
  }

  resetGraphicProperties() {
    this.barChartData = [];
    this.barChartLabels = [];
    this.pieChartData = [];
    this.pieChartLabels = [];
    this.setBarChartProperties();
    this.setPieChartProperties();
  }
}
