import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferType } from 'src/app/constent/offer-type';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { TableStatus } from 'src/app/constent/table-status';
import { PaymentService } from 'src/app/services/payment.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';
import { TableDataSharingService } from 'src/app/services/table-data-sharing.service';
import { TableOrderService } from 'src/app/services/table-order.service';

@Component({
  selector: 'app-table-orders',
  templateUrl: './table-orders.component.html',
  styleUrls: ['./table-orders.component.css'],
})
export class TableOrdersComponent implements OnInit {
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
    this.secureStoregeSerive.encriptAndSave(this.products, StorageKey.TABLE_ORDER)

  }
  getTableOrdes() {
    if (this.table) {
      this.tableService.getbyTableOrders(this.table?.vendorId, this.table?.tableId).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {
          this.products = res?.data
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
    let amount = "10.00"; // Change as needed
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
          this.router.navigate(['md', 'vendorTable']);
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

      console.log(this.offerMap);
      
    }
  }

}


