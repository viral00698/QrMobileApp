import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription, take } from 'rxjs';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { PlaceOrderService } from 'src/app/services/place-order.service';

@Component({
  selector: 'app-conformation',
  templateUrl: './conformation.component.html',
  styleUrls: ['./conformation.component.css']
})
export class ConformationComponent {
  countdown: number = 10;  // Start from 60 seconds
  private timerSubscription!: Subscription;  // To store the subscription

  constructor(private placed: PlaceOrderService, private router: Router) { }

  ngOnInit(): void {

    this.timerSubscription = interval(1000).pipe(
      take(this.countdown)
    ).subscribe((value) => {
      this.countdown = 10 - value - 1;

      if (this.countdown === 1) {
        const data = this.placed.getBillingObject();
        if (data.order) {
          this.placed.orderPlaced(data.order).subscribe((res: any) => {
            if (res.status === RequestStatus.success) {
               localStorage.removeItem(StorageKey.ITEMS)
               localStorage.removeItem(StorageKey.MENU)
              //  localStorage.removeItem(StorageKey.)
            }
          })
        }
      }
    });

  }

  ngOnDestroy(): void {

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
