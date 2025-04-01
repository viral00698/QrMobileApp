import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private router: Router, private route: ActivatedRoute,
    private tableDataSharing: TableDataSharingService,
    private secureStoregeSerive: SecureLocalStorageService,
    private tableService: TableOrderService,
    private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.getTableDetails();
    this.getTableOrdes();
    this.getVendorDetails()
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
      this.router.navigate(['tableMenu']);
    }

    if (this.products) {
      this.router.navigate(['tableMenu']);
    }
  }

  ganrateInvoice() {

    if (this.products) {
      this.router.navigate(['ganrateInvoice'], { queryParams: { data: this.products?.orderId } });
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

    const randomStr = Math.random().toString(36).substring(2, 12); // Generates a 10-char random string
    const txnRef = `Ref_${randomStr}`; // Transaction Reference
    const txnId = `TXN_${randomStr}`; // Transaction ID
    this.products.txnNo = txnId;
    this.products.refNo = txnRef

    let upiID = this.vendor?.upa // Replace with actual UPI ID
    let amount = "10.00"; // Change as needed
    let name = this.products?.restroName;
   
    // let txnId = "TXN123456"; // Unique Transaction ID
    // let txnRef = "Ref123456"; // Transaction Reference ID
    let currency = "INR";

    this.upiURL = `upi://pay?pa=${upiID}&pn=${name}&tr=${txnRef}&tn=Payment&am=${amount}&cu=${currency}`;

  }

  closeOrder(){

    if (this.products && this.vendor) {
      this.tableService.createRozerpayOrderForTable(this.products).subscribe((res: any) => {
        if (res?.status == RequestStatus.success) {
    
        }
      })
    }

    if(this.table){
      this.table.tableStatus = TableStatus.AVAILABLE
      this.tableService.updateTableStatus(this.table).subscribe((res:any)=>{
        this.router.navigate(['vendorTable']);
      })
    }
  
  }

}
