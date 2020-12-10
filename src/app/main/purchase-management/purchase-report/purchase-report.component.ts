import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { tap } from 'rxjs/operators';
import { PurchaseStatistic } from 'src/app/core/models/purchase/purchase-statistic.model';
import { Purchase } from 'src/app/core/models/purchase/purchase.model';
import { PurchaseService } from 'src/app/core/service/purchase/purchase.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';

@Component({
  selector: 'es-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css'],
  providers: [PurchaseService]
})
export class PurchaseReportComponent implements OnInit {
  monthNames = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];

  purchaseStatistics: PurchaseStatistic[] = [];
  purchasePerMonths: any[] = [];

  barChartOptions: ChartOptions;

  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataSets[] = [];

  constructor(private purchaseServive: PurchaseService,
    private utilsService: UtilsService,
    private snackBarService: SnackbarService) { }

  async ngOnInit() {
    this.setBarChartProperties();
    await this.loadStatistics();
  }

  async loadStatistics() {

    const purchaseDataReceived = {
      next: async (purchaseStatistics: PurchaseStatistic[]) => {
        if(purchaseStatistics.length) {
          this.purchaseStatistics = purchaseStatistics;
          await this.configureBarChartData();
          await this.loadBarChartInfo();
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

  async configureBarChartData(statistics?: []) {
    const purchaseStatistics = statistics ? statistics : this.purchaseStatistics;
    purchaseStatistics.forEach(statistic => {
      let purchaseDate = statistic.purchase.date;
      if (purchaseDate && !this.findPurchaseMonths(statistic.purchase.date[1])) {
        this.setPurchasePerMonthsValues(statistic.purchase.date[1], statistic.purchase);
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
        total: 0
     });
    }
  }

  findPurchaseMonths = (dateParam: number) => this.purchasePerMonths.find(purchase => purchase['date'][1] == dateParam);

  async loadBarChartInfo() {
    this.barChartData = [];
    this.barChartLabels.push('Vendas no mês');
    this.purchasePerMonths.forEach(purchase => {
      let month = this.monthNames[purchase.date - 1];
      this.barChartData.push(
        {
          data: [purchase.total], 
          label: month,
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 1,
          hoverBorderWidth: 1,
          hoverBorderColor: 'rgba(0,0,0,1)'
        });
      });
  }

  setBarChartProperties() {
    this.barChartOptions = {
      responsive: true,
      showLines: true,
      legend: {
        display: true
      },
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            const label = ctx.chart.data.labels[ctx.dataIndex];
            return label;
          },
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            stepSize: 0.5,
            min: 0
          }
        }],
        gridLines: {
          display: true,
          circular: true
        }
      }
    };
  }
}
