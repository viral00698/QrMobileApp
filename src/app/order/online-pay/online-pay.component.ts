import { Component, OnInit } from '@angular/core';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { PaymentService } from 'src/app/services/payment.service';
import { PlaceOrderService } from 'src/app/services/place-order.service';

@Component({
  selector: 'app-online-pay',
  templateUrl: './online-pay.component.html',
  styleUrls: ['./online-pay.component.css']
})
export class OnlinePayComponent implements OnInit {
  constructor(private paymentService: PaymentService, private placed: PlaceOrderService , private dataShraing:DataSharingService) { }
  ngOnInit(): void {

    const data = this.placed.getBillingObject();
    if (data?.order) {
      this.placed.orderPlaced(data?.order).subscribe((res: any) => {
        if (res?.status === RequestStatus.success) {

          const order_id = res?.data?.razorpayOrder.orderId;
          if (order_id) {
            this.dataShraing.setResponse(res.data);
            this.paymentService.makePayment(res.data);
          }else{
            //throw erorr page
          }

          localStorage.removeItem(StorageKey.ITEMS)
          localStorage.removeItem(StorageKey.MENU)
          this.placed.setBillingObject(null)
          localStorage.removeItem(StorageKey.ITEMS)
        } else {
          //  localStorage.removeItem(StorageKey.ITEMS)
          localStorage.removeItem(StorageKey.MENU)
          this.placed.setBillingObject(null)
        }
      })
    }
  }


}
