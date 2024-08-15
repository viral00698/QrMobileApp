import { Component } from '@angular/core';

@Component({
  selector: 'app-placeorder',
  templateUrl: './placeorder.component.html',
  styleUrls: ['./placeorder.component.css']
})
export class PlaceorderComponent {

  orderQty: number = 1;

  orderQtyInc() {
    this.orderQty = this.orderQty + 1;
  }
  ororderQtyDec() {
    if (this.orderQty > 0) {
      this.orderQty = this.orderQty - 1;
    }
  }
}
