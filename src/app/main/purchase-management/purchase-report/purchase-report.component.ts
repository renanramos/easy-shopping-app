import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { tap } from 'rxjs/operators';

import { OrderItem } from 'src/app/core/models/orderItem/order-item.model';
import { Product } from 'src/app/core/models/product/product.model';
import { PurchaseStatistic } from 'src/app/core/models/purchase/purchase-statistic.model';
import { Purchase } from 'src/app/core/models/purchase/purchase.model';
import { Customer } from 'src/app/core/models/registration/customer.model';
import { CustomerService } from 'src/app/core/service/customer/customer.service';
import { ProductService } from 'src/app/core/service/product/product.service';
import { PurchaseService } from 'src/app/core/service/purchase/purchase.service';
import { SearchService } from 'src/app/core/shared/service/search-service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';

@Component({
  selector: 'es-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css'],
  providers: [PurchaseService, ProductService, CustomerService]
})
export class PurchaseReportComponent implements OnInit {
  monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  products: Product[] = [];
  purchaseStatistics: PurchaseStatistic[] = [];
  purchasePerMonths: any[] = [];
  customers: Customer[] = [];

  barChartOptions: ChartOptions;

  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataSets[] = [];

  formFilter: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private purchaseServive: PurchaseService,
    private productService: ProductService,
    private utilsService: UtilsService,
    private snackBarService: SnackbarService,
    private searchService: SearchService,
    private customerService: CustomerService) { }

  async ngOnInit() {
    this.searchService.hideSearchFieldOption(true);
    this.setBarChartProperties();
    this.createFormFilter();
    await this.loadStatistics();
    await this.loadProducts();
    await this.configureBarChartData();
    await this.loadBarChartInfo();
    await this.loadCustomers();
  }

  async loadCustomers() {
    const customersReceived = {
      next: (customers: Customer[]) => {
        if (customers.length) {
          this.customers = customers;
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };

    await this.customerService.getCustomers(null, null, null)
      .pipe(tap(customersReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  async loadProducts() {
    const productsReceived = {
      next: (products: Product[]) => {
        if (products.length) {
          this.products = products;
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };

   await this.productService.getProducts(null, null, null, null, null)
      .pipe(tap(productsReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  createFormFilter() {
    this.formFilter = this.formBuilder.group({
      month: [''],
      product: [null],
      customerId: ['']
    });
  }

  get month() {
    return this.formFilter.get('month');
  }

  get product() {
    return this.formFilter.get('product');
  }

  get customer() {
    return  this.formFilter.get('customerId');
  }

  async loadStatistics() {

    const purchaseDataReceived = {
      next: async (purchaseStatistics: PurchaseStatistic[]) => {
        if(purchaseStatistics.length) {
          this.preparePurchaseList(purchaseStatistics);
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };

    await this.purchaseServive.getPurchaseStatistics()
      .pipe(tap(purchaseDataReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  preparePurchaseList(purchaseStatistics: PurchaseStatistic[]) {
    purchaseStatistics.forEach(purchaseStatistic => {
      if (this.purchaseStatistics.findIndex(statistic => statistic['order']['id'] === purchaseStatistic['order']['id']) === -1) {
        this.purchaseStatistics.push(purchaseStatistic);
      }
    });
  }

  async configureBarChartData() {
    this.purchaseStatistics.forEach(statistic => {
      let purchaseDate = statistic.purchase.purchaseDate;
      if (purchaseDate && !this.findPurchaseMonths(purchaseDate[1])) {
        this.setPurchasePerMonthsValues(purchaseDate[1], statistic.purchase);
      }
    });
  }

  setPurchasePerMonthsValues(monthId: number, purchase: Purchase) {
    if (this.purchasePerMonths.findIndex(value => value.date == monthId) != -1) {
      let index = this.purchasePerMonths.findIndex(value => value.date == monthId);
      this.purchasePerMonths[index].total += 1;
    } else {
      this.purchasePerMonths.push({
        date: monthId,
        purchase: purchase,
        total: 1
     });
    }
  }

  findPurchaseMonths = (dateParam: number) => this.purchasePerMonths.find(purchase => purchase['purchaseDate'] && purchase['purchaseDate'][1] == dateParam);

  async loadBarChartInfo() {
    this.barChartData = [];
    let data = [];
    this.purchasePerMonths.forEach(purchase => {
      let month = this.monthNames[purchase.date - 1];
      this.barChartLabels.push(month);
      data.push(purchase.total);
    });
    this.barChartData.push({data});
  }

  setBarChartProperties() {
    this.barChartOptions = {
      responsive: true,
      showLines: true,
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            stepSize: 1,
            min: 0
          }
        }],
        gridLines: {
          display: true
        }
      }
    };
  }

  async onSelectMonth() {
    this.product.setValue(null);
    this.customer.setValue('');
    await this.resetChartPropertiesFields();
    await this.loadStatistics();
    const monthSelectedIndex = await this.monthNames.findIndex(month => month === this.month.value);
    this.purchaseStatistics = await this.filterPurchaseStatisticByMonthId(monthSelectedIndex + 1);
    await this.configureBarChartData();
    await this.loadBarChartInfo();
  }

  filterPurchaseStatisticByMonthId = async (monthId) => this.purchaseStatistics
    .filter(statistic => statistic.purchase.purchaseDate && statistic.purchase.purchaseDate[1] === monthId);

  async resetChartPropertiesFields() {
    this.barChartData = [];
    this.barChartLabels = [];
    this.purchasePerMonths = [];
    this.purchaseStatistics = [];
  }

  async onClearSelectSelectField(event?: any) {
   event.preventDefault();
   this.formFilter.reset();
   await this.resetGraphic();
  }

  async resetGraphic() {
    await this.resetChartPropertiesFields();
    await this.loadStatistics();
    await this.configureBarChartData();
    await this.loadBarChartInfo();
  }

  async onSelectProduct() {
    this.month.setValue('');
    this.customer.setValue('');
    const productId = this.product.value;
    await this.resetChartPropertiesFields();
    await this.loadStatistics();
    this.purchaseStatistics = this.filterPurchaseStatisticsByProductId(productId);
    await this.configureBarChartData();
    await this.loadBarChartInfo();
  }

  filterPurchaseStatisticsByProductId(productId: number) {
    return this.purchaseStatistics
      .map(statistic => {
        let order = statistic.order;
        statistic.order['items'] = this.hasItemWithProductId(order['items'], productId);
        return statistic.order['items'].length ? statistic : null;
      })
      .filter(statistic => statistic != null);
  }

  hasItemWithProductId(items: OrderItem[], productId?: number) {
    return items && items.filter(item => item['productId'] == productId);
  }

  async onSelectCustomer() {
    this.month.setValue('');
    this.product.setValue(null);
    const customerId = this.customer.value;
    await this.resetChartPropertiesFields();
    await this.loadStatistics();
    this.purchaseStatistics = this.filterPurchaseStatisticByCustomerId(customerId);
    await this.configureBarChartData();
    await this.loadBarChartInfo();
  }

  filterPurchaseStatisticByCustomerId(customerId: string): PurchaseStatistic[] {
    return this.purchaseStatistics
      .filter(statistic => statistic['purchase']['customerId'] === customerId);
  }
}
