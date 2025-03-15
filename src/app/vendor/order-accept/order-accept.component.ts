import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { OrdersService } from 'src/app/services/orders.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';


@Component({
  selector: 'app-order-accept',
  templateUrl: './order-accept.component.html',
  styleUrls: ['./order-accept.component.css']
})
export class OrderAcceptComponent implements OnInit, AfterViewInit {
  @ViewChild('readerRef') readerElement!: ElementRef;

  protected Order: any;
  private vendorDetails: any
  isScan: boolean = false;
  Orders: any;
  toggleBtn: boolean = true
  last24HourOrders: any
  selectedOrder: any
  viewOn: boolean = false;


  constructor(private orderService: OrdersService, private localStrorage: SecureLocalStorageService) { }
  ngAfterViewInit(): void {
    this.scanQr()
  }
  ngOnInit(): void {

    if (!this.vendorDetails) {
      const res = this.localStrorage.decryptAndGet(StorageKey.USER)
      this.vendorDetails = JSON.parse(res)
    }

  }

  acceptRequest() {
    this.isScan = false;
  }

  scanQr() {
    const scanner = new Html5QrcodeScanner(this.readerElement?.nativeElement?.id, { fps: 10, qrbox: 250 }, false); // 👈 Add `false` as the third argument
    this.isScan = false;
    this.viewOn = false;
    this.toggleBtn = true
debugger
    setTimeout(() => {
      scanner.render(
        (decodedText: string) => {
          console.log('Scanned:', decodedText);
          alert('QR Code: ' + decodedText);
          scanner.clear();
          this.orderService.getOrdersByTokenAndVendor(this.vendorDetails?.vendorId, decodedText).subscribe((res: any) => {
            console.log(res);
            if (res.status === RequestStatus.success) {
              this.Order = res.data
              this.isScan = true;
            } else {
              alert('recored not found');
            }
          })
        },
        (errorMessage: string) => {
          console.log('QR Error:', errorMessage);
        }
      );
    } ,1000 )
  }

  getOrders() {

    this.toggleBtn = false
    
    this.Orders = this.orderService.getOrders(this.vendorDetails?.vendorId).subscribe((res: any) => {
      if (res.status === RequestStatus.success) {
        this.last24HourOrders = res.data;
      }
    })
  }

  selectedOrderPrview(order: any) {
    this.selectedOrder = order
    // if(this.isScan)
    this.viewOn = true
  }
}
