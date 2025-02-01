import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFaieldComponent } from './order-faield.component';

describe('OrderFaieldComponent', () => {
  let component: OrderFaieldComponent;
  let fixture: ComponentFixture<OrderFaieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderFaieldComponent]
    });
    fixture = TestBed.createComponent(OrderFaieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
