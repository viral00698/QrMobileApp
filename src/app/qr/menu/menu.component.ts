import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  orderQty:number=1;

  constructor(private router:Router){}

  orderQtyInc(){
    this.orderQty=this.orderQty + 1;
  }
  ororderQtyDec(){
      if(this.orderQty>0){
        this.orderQty= this.orderQty-1;
      }
  }

  redirectToPage() {
    this.router.navigate(['placeorder']); // Replace with your target route
  }
}

