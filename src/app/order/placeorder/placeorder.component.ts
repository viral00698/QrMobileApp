import { AfterViewInit, ChangeDetectorRef, Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppType } from 'src/app/constent/app-type';
import { OrderStatus } from 'src/app/constent/order-status';
import { PaymentMode } from 'src/app/constent/payment-mode';
import { StorageKey } from 'src/app/constent/storage-key';
import { OrderDetails } from 'src/app/model/order-details';
import { Orders } from 'src/app/model/orders.model';
import { BillingService } from 'src/app/services/billing.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { PaymentService } from 'src/app/services/payment.service';
import { PlaceOrderService } from 'src/app/services/place-order.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';
import { VendorService } from 'src/app/services/vendor.service';
declare var Razorpay: any;

@Component({
  selector: 'app-placeorder',
  templateUrl: './placeorder.component.html',
  styleUrls: ['./placeorder.component.css']
})
export class PlaceorderComponent implements OnInit, DoCheck, AfterViewInit{


  cardStyles = {
    margin: "2rem",
    padding:'0.5rem',
    borderRadius: "10px",
    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
   
  };
  
  menuMap: Map<any, any> = new Map()
  items: any = []
  bilingObject: any;
  userMobile!: string
  isValid!: boolean;
  vender: any;
  paymentOptions!: {
    key: string; // Replace with your Razorpay key
    amount: number; // Amount in paise (e.g., 10000 = ₹100)
    currency: string; name: string; description: string; image: string; // Logo URL
    handler: any; // Callback on payment success
    prefill: { name: string; email: string; contact: string; }; theme: { color: string; };
  };

  constructor(private router: Router, protected userSelectItems: DataSharingService,
    private localStorageSecureService: SecureLocalStorageService,
    private changeDetectorRef: ChangeDetectorRef,
    private billingService: BillingService,
    private venderService: VendorService,
    private placeOrder: PlaceOrderService,
    private paymentService:PaymentService,
  ) { }
  ngAfterViewInit(): void {
    let data = this.userSelectItems.getFreeItem();
      for(let i of data){
        this.items.push(i);
      }
 
  }

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

  async billGanaretor() {
    const listofItems = this.userSelectItems.getItemsArray();
    // this.vender = this.venderService.getVenderObject();
    if (this.vender && listofItems.length > 0) {
      // If vendor is not available, fetch it asynchronously
      // this.venderService.getVenderById().subscribe((res: any) => {
      // this.vender = res.data; // Update vendor
      this.bilingObject = await this.billingService.ganareteBill(listofItems, this.vender) // Generate bill after fetching vendor
      // });
    } else {
      // If vendor already exists, generate the bill immediately
      this.bilingObject = await this.billingService.ganareteBill(listofItems, this.vender) // Generate bill after fetching vendor
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

  getInfo(paymentType:string) {

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

    if(paymentType === 'CASH'){
      customerOrder.payment_mode = PaymentMode.CASH
      customerOrder.orderStatus = OrderStatus.WaitForApprove
    }

    if(paymentType === 'ONLINE'){
      customerOrder.payment_mode = PaymentMode.ONLINE
      customerOrder.orderStatus = OrderStatus.Placed
    }

    customerOrder.customerMobileNo = this.userMobile
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
      orderDetail.foodCategory = item?.foodCategory;
      orderDetail.offerId = item?.offer?.offerId,
      orderDetail.offerType = item?.offer?.offerType,
      orderDetail.OfferApplied = false;
      orderDetail.isDelivered = false

      array.push(orderDetail)
    });

    customerOrder.orderDetails = array ?? [];

    const data = { 'order': customerOrder, 'bill': this.bilingObject }

    if(data  && paymentType === 'ONLINE'){
      this.placeOrder.setBillingObject(data);
      this.router.navigate(['online_pay'])
    }
    if(data && paymentType === 'CASH') {
      this.placeOrder.setBillingObject(data);
      this.router.navigate(['conformation'])
    }

  }

  navigateOrderHistory() {
    this.router.navigate(['OrderHistory']);
  }


  getImageSrc(image: string | null | undefined): string {
    return image ? image : 'assets/samosa1.jpg';
  }

  onImageError(event: any) {
    event.target.src = 'assets/samosa1.jpg';
  }

  hasOffer(item: any): boolean {

    if (!item?.offer || !item?.offer?.isActive) {
      return false;
    }


    const offerExpiry = item?.offer?.expireDate
    const now = new Date();

    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const endOfTodayMillis = endOfToday.getTime();

    return offerExpiry > endOfTodayMillis;
  }

}
