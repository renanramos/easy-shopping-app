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

  async configureBarChartData() {
    this.purchasePerMonths = await this.purchaseStatistics.reduce((previous, current) => {
      if(current.purchase.date) {
        previous[current.purchase.date[1]] = [...previous[current.purchase.date[1]] || [], current.purchase.date[1]];
      }
      return previous;
    }, []);
  }

  async loadBarChartInfo() {
    await this.purchasePerMonths.map(purchase => {
      this.barChartData.push({
        data: purchase.length,
        label: this.monthNames[purchase[0] - 1]
      })
    });
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
    this.barChartData = [];
  }
}
