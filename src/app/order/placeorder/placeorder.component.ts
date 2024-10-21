import { ChangeDetectorRef, Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppType } from 'src/app/constent/app-type';
import { OrderStatus } from 'src/app/constent/order-status';
import { PaymentMode } from 'src/app/constent/payment-mode';
import { StorageKey } from 'src/app/constent/storage-key';
import { OrderDetails } from 'src/app/model/order-details';
import { Orders } from 'src/app/model/orders.model';
import { BillingService } from 'src/app/services/billing.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { PlaceOrderService } from 'src/app/services/place-order.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-placeorder',
  templateUrl: './placeorder.component.html',
  styleUrls: ['./placeorder.component.css']
})
export class PlaceorderComponent implements OnInit, DoCheck {

  items: any = []
  bilingObject: any;
  userMobile!: string
  isValid!: boolean;
  vender: any;

  constructor(private router: Router, private userSelectItems: DataSharingService,
    private localStorageSecureService: SecureLocalStorageService,
    private changeDetectorRef: ChangeDetectorRef,
    private billingService: BillingService,
    private venderService: VendorService,
    private placeOrder: PlaceOrderService
  ) { }

  ngDoCheck() {
    // this.mapStoreOnDestory()
    // this.billGanaretor()
  }

  ngOnInit(): void {
    this.getItems();
    this.getVenderDetails()
    this.billGanaretor()

  }

  getVenderDetails() {
    const tmp = this.localStorageSecureService.decryptAndGet(StorageKey.VENDER);
    this.vender = JSON.parse(tmp)
  }

  billGanaretor() {
    const listofItems = this.userSelectItems.getItemsArray();
    // this.vender = this.venderService.getVenderObject();
    if (this.vender && listofItems.length > 0) {
      // If vendor is not available, fetch it asynchronously
      // this.venderService.getVenderById().subscribe((res: any) => {
      // this.vender = res.data; // Update vendor
      this.bilingObject = this.billingService.ganareteBill(listofItems, this.vender) // Generate bill after fetching vendor
      // });
    } else {
      // If vendor already exists, generate the bill immediately
      this.bilingObject = this.billingService.ganareteBill(listofItems, this.vender) // Generate bill after fetching vendor
      // redirect to home ppage
    }
  }

  // mapStoreOnDestory() {
  //   const tmp = this.userSelectItems.getMap()
  //   if (tmp.size !== 0) {
  //     this.localStorageSecureService.encriptAndSave(JSON.stringify(Array.from(tmp.entries())), StorageKey.ITEMS);
  //   }
  // }

  setItemsFromLocalStorage() {

    const tmp = JSON.parse(this.localStorageSecureService.decryptAndGet(StorageKey.ITEMS))

    if (tmp !== null) {
      const map = new Map(JSON.parse(tmp));
      this.userSelectItems.setMap(map);
      this.items = Array.from(map.values());
      this.userSelectItems.setMap(map)

    }
  }

  getItems() {
    const tmp = this.userSelectItems.getItemsArray();
    if (tmp.length > 0) {
      this.items = tmp;
    } else {
      this.setItemsFromLocalStorage();
    }
  }
  orderQtyInc(item: any) {

    if (!this.userSelectItems.itemExists(item.productId)) {
      this.userSelectItems.addItem(item);
    } else {
      this.userSelectItems.incQty(item);
    }
    // item.itemQty++;
    this.billGanaretor()
  }

  ororderQtyDec(item: any) {

    if (item.itemQty > 0) {
      this.userSelectItems.decQty(item);
      // item.itemQty--;
    }
    if (item.itemQty == 0) {
      this.userSelectItems.remove(item.productId)
      const tmp = this.items.filter((obj: any) => {
        return obj.productId !== item.productId
      })
      this.items = tmp
    }

    this.billGanaretor()

  }

  deleteItem(item: any) {
    this.userSelectItems.remove(item.productId)
    const tmp = this.items.filter((obj: any) => {
      return obj.productId !== item.productId
    })
    this.items = tmp

    this.billGanaretor()

  }

  inputchange() {
    this.validateMobileNumber()
    if (this.isValid) {
    } else {
      console.log('Invalid mobile number');
    }
  }

  validateMobileNumber() {
    const pattern = /^\d{10}$/; // Adjust the regex as needed
    this.isValid = pattern.test(this.userMobile);
  }

  getInfo() {

    // let orderDetail : OrderDetails = new OrderDetails();

    if (!this.items || this.items.length === 0) {
      console.error('No items selected.');
      return;
    }

    if (!this.userMobile || !this.isValid) {
      console.error('Invalid mobile number.');
      return;
    }

    if (!this.bilingObject || !this.vender) {
      console.error('Billing object or vendor information is missing.');
      return;
    }

    let customerOrder: Orders = new Orders();
    let array: OrderDetails[] = [];

    // customer uuid
    // order.orderDetails = this.items

    const customerId = this.localStorageSecureService.decryptAndGet(StorageKey.USERID);
    if (customerId) {
      customerOrder.customerUUID = JSON.parse(customerId);
    }

    customerOrder.orderStatus = OrderStatus.WaitForApprove
    customerOrder.customerMobileNo = this.userMobile
    customerOrder.payment_mode = PaymentMode.CASH
    customerOrder.totelAmount = this.bilingObject?.totalAmount
    customerOrder.vendorId = this.vender?.vendorId
    customerOrder.appType = AppType.QR
    customerOrder.restroName = this.vender?.storeName


    this.items.forEach((item: any) => {
      let orderDetail: OrderDetails = new OrderDetails();
      orderDetail.amount = item?.amount ?? 0
      orderDetail.itemName = item?.itemName ?? 'AAA'
      orderDetail.isJain = item?.isJain ?? false
      orderDetail.productId = item?.productId ?? null
      orderDetail.quntity = item?.itemQty ?? 0
      orderDetail.orderId = null

      array.push(orderDetail)
    });

    customerOrder.orderDetails = array ?? [];

    const data = { 'order': customerOrder, 'bill': this.bilingObject }

    if (data) {
      this.placeOrder.setBillingObject(data);
      this.router.navigate(['conformation'])
    }

  }

  navigateOrderHistory() {
    this.router.navigate(['OrderHistory']);
  }


}



