import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';
import { TableDataSharingService } from 'src/app/services/table-data-sharing.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-vendor-table',
  templateUrl: './vendor-table.component.html',
  styleUrls: ['./vendor-table.component.css']
})
export class VendorTableComponent implements OnInit {

  vender: any
  tables: any = []
  tmpTables: any = []

  constructor(
    private storageService: SecureLocalStorageService,
    private router:Router,
    private vendorService: VendorService,
    private tableDataSharing:TableDataSharingService) { }
 
    ngOnInit(): void {
    this.getVenderDetails()
    this.getTables()
  }


  getVenderDetails() {
    const tmp = this.storageService.decryptAndGet(StorageKey.USER);
    if (tmp) {
      this.vender = JSON.parse(tmp)
    }
  }


  getTables() {
    if (this.vender) {
      this.vendorService.getTables(this.vender.vendorId).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {
          this.tables = res.data;
          this.tmpTables = res.data;
        }
      })
    }
  }

  onCardClick(table:any){

    this.tableDataSharing.setTable(table)
    this.router.navigate(['tableOrders']);

  }

  hasPrefix(str:any, prefix: string): boolean {
    return str.startsWith(prefix);
  }

}
