import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { TableStatus } from 'src/app/constent/table-status';
import { RxStompService } from 'src/app/services/rx-stomp.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';
import { TableDataSharingService } from 'src/app/services/table-data-sharing.service';
import { TableOrderService } from 'src/app/services/table-order.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-vendor-table',
  templateUrl: './vendor-table.component.html',
  styleUrls: ['./vendor-table.component.css'],
})
export class VendorTableComponent implements OnInit {
  
  formGroup!: FormGroup;
  vender: any
  tables: any = []
  tmpTables: any = []
  tmptb:any;
  tableTypes:any =[]
  selected_Type:any
  searchTerm:any
  selectedCityIds: any;

  constructor(
    private storageService: SecureLocalStorageService,
    private router:Router,
    private vendorService: VendorService,
    private tableDataSharing:TableDataSharingService,
    private rxStompService: RxStompService,
    private tableOrderService:TableOrderService,
    private messageService:MessageService,
    private changeDetectorRef:ChangeDetectorRef) { 

      this.tableTypes = [
        { name: 'AC', code: 'AC' },
        { name: 'Normal', code: 'NOR' },
        { name: 'Garden', code: 'GRD' },
        { name: 'Candle Light', code: 'CND' },
      ];
    }
    

    ngOnInit(): void {

    this.getVenderDetails()
    this.getTables()

    this.rxStompService.watch('/queue/'+ this.vender?.vendorId +'/tables').subscribe((res: any) => {
      this.tmptb = JSON.parse(res.body);
      // this.tmpcashOrderList = this.cashOrderList
    })
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

  onSubmit(): void {
    if (this.formGroup.valid) {
      console.log('Form Submitted', this.formGroup.value);
      if (this.vender) {
        const obj = {
          "tableName": this.formGroup.get('type')?.value?.code + "-" + this.formGroup.get('tableName')?.value,
          "vendorId": this.vender.vendorId,
          "tableStatus": TableStatus.CLOSED
        }

        this.tableOrderService.addTable(obj).subscribe((res: any) => {
          if (res.status === RequestStatus.success) {
            this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: res?.message });
          } else {
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: res?.message });
          }
        })
      }
    }
  }

  searchInTable() {
    if (this.searchTerm) {
      const searchByItem = this.searchTerm.toLowerCase();
      this.tmpTables = this.tables.filter((item: any) =>
        item.tableName.toLowerCase().includes(searchByItem)
      );

    } else {
      this.tmpTables = this.tables
    }
  
    this.changeDetectorRef.detectChanges();

  }
  onCardClick(table:any){

    this.tableDataSharing.setTable(table)
    this.router.navigate(['tableOrders']);

  }

  hasPrefix(str:any, prefix: string): boolean {
    return str.startsWith(prefix);
  }

 

}
