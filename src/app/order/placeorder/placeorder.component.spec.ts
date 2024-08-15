import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceorderComponent } from './placeorder.component';

describe('PlaceorderComponent', () => {
  let component: PlaceorderComponent;
  let fixture: ComponentFixture<PlaceorderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlaceorderComponent]
    });
    fixture = TestBed.createComponent(PlaceorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
