import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartItemsComponent } from './shopping-cart-items.component';

describe('ShoppingCartItemsComponent', () => {
  let component: ShoppingCartItemsComponent;
  let fixture: ComponentFixture<ShoppingCartItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingCartItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
