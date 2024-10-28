import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanarateInvoiceComponent } from './ganarate-invoice.component';

describe('GanarateInvoiceComponent', () => {
  let component: GanarateInvoiceComponent;
  let fixture: ComponentFixture<GanarateInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GanarateInvoiceComponent]
    });
    fixture = TestBed.createComponent(GanarateInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
