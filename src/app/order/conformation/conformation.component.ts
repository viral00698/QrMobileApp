import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription, take } from 'rxjs';
import { OrderStatus } from 'src/app/constent/order-status';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { PlaceOrderService } from 'src/app/services/place-order.service';
import { RxStompService } from 'src/app/services/rx-stomp.service';

@Component({
  selector: 'app-conformation',
  templateUrl: './conformation.component.html',
  styleUrls: ['./conformation.component.css']
})
export class ConformationComponent {
  countdown: number = 10;  // Start from 60 seconds
  orderMessage: any;
  private timerSubscription!: Subscription;  // To store the subscription

  constructor(private placed: PlaceOrderService, private router: Router ,  private rxStompService:RxStompService , private dataSharing: DataSharingService) { }

  ngOnInit(): void {

    this.timerSubscription = interval(1000).pipe(
      take(this.countdown)
    ).subscribe((value) => {
      this.countdown = 10 - value - 1;

      if (this.countdown === 1) {
        const data = this.placed.getBillingObject();
        if (data?.order) {
          this.placed.orderPlaced(data?.order).subscribe((res: any) => {
            if (res?.status === RequestStatus.success) {
              this.dataSharing.setResponse(res?.data)
              // data.orders.orderStatus = OrderStatus.WaitForApprove
             
              this.rxStompService.publish({ destination: '/app/orderStatus', body: JSON.stringify(data?.orders) })
           
              localStorage.removeItem(StorageKey.ITEMS)
              localStorage.removeItem(StorageKey.MENU)
              this.orderMessage = res.message
              this.placed.setBillingObject(null)

            
              this.router.navigate(['order_success'], { state: { orderData: (res?.data as any) } });
              //  localStorage.removeItem(StorageKey.)
            } else {
              this.orderMessage = res.message;
              localStorage.removeItem(StorageKey.ITEMS)
              localStorage.removeItem(StorageKey.MENU)
              this.placed.setBillingObject(null)
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
