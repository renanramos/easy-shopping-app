import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockItemReportComponent } from './stock-item-report.component';

describe('StockItemReportComponent', () => {
  let component: StockItemReportComponent;
  let fixture: ComponentFixture<StockItemReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockItemReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockItemReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
