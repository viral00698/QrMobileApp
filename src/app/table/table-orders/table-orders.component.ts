import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferType } from 'src/app/constent/offer-type';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { TableStatus } from 'src/app/constent/table-status';
import { PaymentService } from 'src/app/services/payment.service';
import { RxStompService } from 'src/app/services/rx-stomp.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';
import { TableDataSharingService } from 'src/app/services/table-data-sharing.service';
import { TableOrderService } from 'src/app/services/table-order.service';

@Component({
  selector: 'app-table-orders',
  templateUrl: './table-orders.component.html',
  styleUrls: ['./table-orders.component.css'],
})
export class TableOrdersComponent implements OnInit {
  menuMap: Map<any, any> = new Map()
  custName: any = null;
  isValid!: boolean;
  formGroup!: FormGroup
  selectedItem: any;
  table: any;
  orderFinishFlag: boolean = false
  products: any;
  visible: boolean = true;
  userMobile: any = null;
  isName!: boolean;
  pytButton: boolean = false
  selectPaymentUPI: boolean = false
  selectPaymentCard: boolean = false
  selectPaymentCASH: boolean = false
  sendInvoiceByWhatsapp: boolean = false
  sendInvoiceBySMS: boolean = false
  upiURL!: string;
  vendor: any;
  offerMap: Map<any, any> = new Map<any, any>();
  onlinePaymentDisbale: boolean = false;
  

  constructor(private router: Router, private route: ActivatedRoute,
    private tableDataSharing: TableDataSharingService,
    private secureStoregeSerive: SecureLocalStorageService,
    private tableService: TableOrderService,
    private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.getTableDetails();
    this.getTableOrdes();
    this.getVendorDetails();
    this.getOfferByVendor();
    if(this.vendor.upa && this.products?.billingDtos?.totalAmount > 0){
      this.onlinePaymentDisbale = true;
    }
  }

  getVendorDetails() {
    if (!this.vendor) {
      const res = this.secureStoregeSerive.decryptAndGet(StorageKey.USER);
      let tmp = JSON.parse(res);
      this.vendor = tmp;
    
    }
  }

  getTableDetails() {
    this.table = this.tableDataSharing.getTable();
  }
  getTableOrdes() {
    if (this.table) {
      this.tableService.getbyTableOrders(this.table?.vendorId, this.table?.tableId).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {
          this.products = res?.data
          this.tableDataSharing.setTableOrder(res?.data)
          // this.secureStoregeSerive.encriptAndSave(this.products, StorageKey.TABLE_ORDER)
          for(let item of this.products){
              this.menuMap.set(item?.productId, item.itemName);
          }
          this.secureStoregeSerive.encriptAndSave(this.products, StorageKey.TABLE_ORDER)
        }
      })
    }
  }

  redirectToMenu(table: any) {

    if (this.custName && this.userMobile) {
      const data = {
        'custName': this.custName,
        'custMobile': this.userMobile,
        'custTable': this.table
      }
      this.secureStoregeSerive.encriptAndSave(data, StorageKey.CUST_DETAILS)
      this.router.navigate(['md', 'tableMenu']);
    }

    if (this.products) {
      this.router.navigate(['md', 'tableMenu']);
    }
  }



  validateCustName() {
    // Regex pattern to allow only alphabetic characters and ensure custName is not empty
    const pattern = /^[A-Za-z\s]+$/;
    // Test for both non-null and pattern match
    this.isName = !!this.custName && pattern.test(this.custName);
  }
  validateMobileNumber() {
    const pattern = /^\d{10}$/; // Adjust the regex as needed
    this.isValid = pattern.test(this.userMobile);
  }

  OpenPaymentGateway() {

    let upiID = this.vendor?.upa // Replace with actual UPI ID
    let amount = this.products?.billingDtos?.totalAmount // Change as needed
    let name = this.products?.restroName;

    // let txnId = "TXN123456"; // Unique Transaction ID
    // let txnRef = "Ref123456"; // Transaction Reference ID
    let currency = "INR";
    this.upiURL = `upi://pay?pa=${upiID}&pn=${name}&tn=Payment&am=${amount}&cu=${currency}`;

  }

  closeOrder() {

    if (this.products && this.vendor) {
      this.table.tableStatus = TableStatus.AVAILABLE
      this.products.tableOrder = this.table
      this.tableService.createRozerpayOrderForTable(this.products, this.vendor).subscribe((res: any) => {
        if (res?.status == RequestStatus.success) {
          // this.router.navigate(['feedback'] ,);
          // this.router.navigate(['md', 'vendorTable']);
          this.router.navigate(['feedback'], {
                state: { orderId: this.products?.orderId, }
          });
        }
      })
    }
  }

  getOfferByVendor() {
    if (this.table) {
      this.tableService.getOfferByVendor(this.table?.vendorId).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {
          for(let item of res?.data){
              this.offerMap.set(item?.offerId , item);
          }
        }
      })      
    }
  }

  hasOffer(item: any): boolean {

    if(!item?.offerId)
        return false

    const offer = this.offerMap.get(item?.offerId)

    if (!offer || !offer?.isActive) {
      return false;
    }

    const offerExpiry = offer?.expireDate
    const now = new Date();

    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const endOfTodayMillis = endOfToday.getTime();

    return offerExpiry > endOfTodayMillis;
  }

  getOfferTooltip(item: any): string {

  const offer = this.offerMap.get(item?.offerId)
  
  if (!offer || !this.hasOffer(offer)) return '';

  switch (offer?.offerType) {
    case 'FLAT_DISCOUNT':
      return `Flat ₹${offer?.flatDiscount} Off`;
    case 'BOGO':
      return 'Buy 1, Get 1 Free';
    case 'BUY_X_GET_Y':
      const freeItem = this.menuMap.get(offer?.freeItem) || 'another item';
      return `Buy 1, Get ${freeItem} Free`;
    default:
      return ''
  }
}




}


