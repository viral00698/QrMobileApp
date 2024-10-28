import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePlaceOrderComponent } from './table-place-order.component';

describe('TablePlaceOrderComponent', () => {
  let component: TablePlaceOrderComponent;
  let fixture: ComponentFixture<TablePlaceOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablePlaceOrderComponent]
    });
    fixture = TestBed.createComponent(TablePlaceOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
