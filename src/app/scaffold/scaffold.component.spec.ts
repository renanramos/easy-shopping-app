import { Injector } from '@angular/core';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCategoryService } from '../core/service/productCategory/product-category.service';
import { SubcategoryService } from '../core/service/subcategory/subcategory.service';
import { ProductCategoryServiceMock } from '../core/shared/mocks/product-category.service.mock';

import { ScaffoldComponent } from './scaffold.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularMaterialModule } from '../shared/angular-material.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SharedComponentsModule } from '../core/shared/components/shared-components.module';
import { ScaffoldRoutingModule } from './scaffold-routing.module';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

describe('ScaffoldComponent', () => {
  let component: ScaffoldComponent;
  let fixture: ComponentFixture<ScaffoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CommonModule,
        SharedModule,
        AngularMaterialModule,
        ScaffoldRoutingModule,
        SharedComponentsModule,
        NgSlimScrollModule,
        InfiniteScrollModule,
      ],
      declarations: [ScaffoldComponent],
      providers: [
        MatSnackBar,
        {
          provide: ProductCategoryService,
          useClass: ProductCategoryServiceMock,
        },
        SubcategoryService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScaffoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get the first list of product categories', async(() => {
    const service: ProductCategoryServiceMock = TestBed.inject(
      ProductCategoryServiceMock
    );
    expect(service).toBeTruthy();
  }));
});
