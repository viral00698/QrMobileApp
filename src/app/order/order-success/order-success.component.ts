import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent {

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any): void {
    // Handle the back button press
    console.log('Back button pressed');
    history.pushState(null, '', window.location.href);
  }


}
