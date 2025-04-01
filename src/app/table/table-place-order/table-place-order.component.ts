import {  Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppType } from 'src/app/constent/app-type';
import { OrderStatus } from 'src/app/constent/order-status';
import { PaymentMode } from 'src/app/constent/payment-mode';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { OrderDetails } from 'src/app/model/order-details';
import { Orders } from 'src/app/model/orders.model';
import { BillingService } from 'src/app/services/billing.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { PlaceOrderService } from 'src/app/services/place-order.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-table-place-order',
  templateUrl: './table-place-order.component.html',
  styleUrls: ['./table-place-order.component.css'],
})
export class TablePlaceOrderComponent {
  
  items: any = []
  bilingObject: any;
  userMobile!: string
  isValid!: boolean;
  vender: any;
  custName:any
  custMobile:any
  custTable:any;
  tableOrder:any
  constructor(private router: Router, private userSelectItems: DataSharingService,
    private localStorageSecureService: SecureLocalStorageService,
    private billingService: BillingService,
    private venderService: VendorService,
    private placeOrder: PlaceOrderService,
    private messageService: MessageService,
  ) { }

  // ngDoCheck() {
  //   // this.mapStoreOnDestory()
  //   // this.billGanaretor()
  // }

  ngOnInit(): void {
    this.getItems();
    this.getVenderDetails()
    this.billGanaretor()
    this.getCustDetails()
    this.getTableOrder()

  }

  getTableOrder(){
   const tmp = this.localStorageSecureService.decryptAndGet(StorageKey.TABLE_ORDER);
   if(tmp){
    this.tableOrder = JSON.parse(tmp)
   }
  }

getCustDetails(){
  const data = this.localStorageSecureService.decryptAndGet(StorageKey.CUST_DETAILS);
  if(data){
    const tmp = JSON.parse(data)
    this.custMobile = tmp.custMobile
    this.custName = tmp.custName
    this.custTable = tmp.custTable
  }else{
    // logout 
  }
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

 

  CreateOrder() {

    // let orderDetail : OrderDetails = new OrderDetails();


    if (!this.items || this.items.length === 0) {
      console.error('No items selected.');
      this.messageService.add({ key: 'tl', severity: 'error', summary: 'Info', detail: 'Invalid Request' });
      return;
    }
    if (!this.custMobile || !this.custName) {
      this.messageService.add({ key: 'tl', severity: 'error', summary: 'Info', detail: 'Invalid Mobile Number' });
      return;
    }

    if (!this.vender) {
      console.error('Billing object or vendor information is missing.');
      this.messageService.add({ key: 'tl', severity: 'error', summary: 'Info', detail: 'Invalid Vendor Details' });
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

    if(this.tableOrder){
      customerOrder.orderId = this.tableOrder.orderId
    }
    customerOrder.orderStatus = OrderStatus.Ongoing 
    customerOrder.customerMobileNo = this.custMobile
    customerOrder.customerName = this.custName
    customerOrder.payment_mode = PaymentMode.CASH
    // customerOrder.totelAmount = this.bilingObject?.totalAmount
    customerOrder.vendorId = this.vender?.vendorId
    customerOrder.appType = AppType.TABLE
    customerOrder.restroName = this.vender?.storeName

    const tableOrder = {
      'tableId':this.custTable.tableId
    }
   
    customerOrder.tableOrder = tableOrder

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

    this.placeOrder.tableOrderPlace(customerOrder).subscribe((res:any)=>{ 
      if(res.status === RequestStatus.success){
 
        localStorage.removeItem(StorageKey.MENU);
        localStorage.removeItem(StorageKey.ITEMS);
        localStorage.removeItem(StorageKey.TABLE_ORDER)
        this.userSelectItems.clearItem();

        this.messageService.add({life:8000, key: 'tl', severity: 'success', summary: 'success', detail: res.message });
        this.router.navigate(['vendorTable']);
      }else{

        localStorage.removeItem(StorageKey.MENU);
        localStorage.removeItem(StorageKey.ITEMS);
        localStorage.removeItem(StorageKey.TABLE_ORDER)
        this.userSelectItems.clearItem();


        this.messageService.add({ key: 'tl', severity: 'error', summary: 'error', detail: res.message });
      }
    })

   
    // const data = { 'order': customerOrder, 'bill': this.bilingObject }

    // if (data) {

    //   this.placeOrder.setBillingObject(data);
    //   this.router.navigate(['conformation'])
    // }

  }

  navigateOrderHistory() {
    this.router.navigate(['OrderHistory']);
  }


}
