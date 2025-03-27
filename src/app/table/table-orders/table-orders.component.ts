import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
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

  products: any;
  visible: boolean = true;
  userMobile: any = null;
  isName!: boolean;

  constructor(private router: Router, private route: ActivatedRoute,
     private tableDataSharing: TableDataSharingService,
     private secureStoregeSerive:SecureLocalStorageService,
     private tableService:TableOrderService) { }

  ngOnInit(): void {
    this.getTableDetails();
    this.getTableOrdes();
  }

  getTableDetails() {
    this.table = this.tableDataSharing.getTable();
    this.secureStoregeSerive.encriptAndSave(this.products,StorageKey.TABLE_ORDER)

  }
  getTableOrdes(){
    if(this.table){
      this.tableService.getbyTableOrders(this.table?.vendorId , this.table?.tableId).subscribe((res:any)=>{
        if(res.status === RequestStatus.success){
          this.products = res?.data?.[0]
          this.secureStoregeSerive.encriptAndSave(this.products,StorageKey.TABLE_ORDER)
        }
      })
    }
  }

  redirectToMenu(table: any) {

    if(this.custName && this.userMobile){
      const data = {
        'custName':this.custName,
        'custMobile':this.userMobile,
        'custTable':this.table
      }
      this.secureStoregeSerive.encriptAndSave(data,StorageKey.CUST_DETAILS)
      this.router.navigate(['md','tableMenu']);
    }

    if(this.products){
      this.router.navigate(['md','tableMenu']);
    }
  }

  ganrateInvoice() {

    if(this.products){
      this.router.navigate(['md','ganrateInvoice'] , { queryParams: { data: this.products?.orderId } });
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


}
