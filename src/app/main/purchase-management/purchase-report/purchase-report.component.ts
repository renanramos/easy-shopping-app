import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
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
  monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  purchaseStatistics: PurchaseStatistic[] = [];
  purchasePerMonths: any[] = [];

  barChartOptions: ChartOptions;

  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataSets[] = [];

  formFilter: FormGroup;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  constructor(
    private formBuilder: FormBuilder,
    private purchaseServive: PurchaseService,
    private utilsService: UtilsService,
    private snackBarService: SnackbarService) { }

  async ngOnInit() {
    this.setBarChartProperties();
    await this.loadStatistics();
    this.createFormFilter();
  }

  createFormFilter() {
    this.formFilter = this.formBuilder.group({
      month: ['']
    });
  }

  get month() {
    return this.formFilter.get('month');
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
    this.purchaseStatistics.forEach(statistic => {
      let purchaseDate = statistic.purchase.date;
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
        total: 0
     });
    }
  }

  findPurchaseMonths = (dateParam: number) => this.purchasePerMonths.find(purchase => purchase['date'] && purchase['date'][1] == dateParam);

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

  async onSelectMonth() {
    this.barChartData = [];
    this.purchasePerMonths = [];
    const monthSelectedIndex = this.monthNames.findIndex(month => month === this.month.value);
    this.purchaseStatistics = this.filterPurchaseStatisticByMonthId(monthSelectedIndex + 1);
    await this.configureBarChartData();
    await this.loadBarChartInfo();
  }

  filterPurchaseStatisticByMonthId = (monthId) => this.purchaseStatistics
    .filter(statistic => statistic.purchase.date && statistic.purchase.date[1] === monthId);

  async onClearSelectMonth(event: any) {
   event.preventDefault();
   this.month.setValue('');
  }
}
