import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { OrdersService } from 'src/app/services/orders.service';
import { RxStompService } from 'src/app/services/rx-stomp.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  searchByItem: any;
  customerId: any;
  ordersList: any = []
  constructor(private stompService: RxStompService,
    private OrderService: OrdersService,
    private localStorageSecureService: SecureLocalStorageService,
    private router: Router) { }
  ngOnInit(): void {
    this.getCurrentOrderStatus()
    this.getHistoryOrderFromDB()
    
    this.stompService.watch('/queue/' + JSON.parse(this.customerId)+ '/messages').subscribe((res: any) => {
      this.updateStatus(JSON.parse(res.body))
      // this.stompService.deactivate();
  })

  }

  getHistoryOrderFromDB() {
    this.customerId = this.localStorageSecureService.decryptAndGet(StorageKey.USERID);
    if (this.customerId) {
      this.OrderService.getOrdersByCustomerId(JSON.parse(this.customerId)).subscribe((res: any) => {
        if (res?.status === RequestStatus.success) {
          this.ordersList = res?.data;
        }
      })
      
    }
  }


  updateStatus(data: any) {

    // const tmp =  this.userSelectItems.getItemsArray(); 
    this.ordersList.forEach((obj: any, index: number) => {
      if (obj?.orderId === data?.orderId) {
        this.ordersList[index].orderStatus = data.orderStatus; // Replacing the object in the array
      }
    });
  
  }

  getCurrentOrderStatus() {
     
  }

goToHome() {
  let vid =localStorage.getItem(StorageKey.VID);
  if (!vid) {
    console.error('VendorId is missing!');
    return;
  }
  this.router.navigate(['menu', vid]);
}

}
