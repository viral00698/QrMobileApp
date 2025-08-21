import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { OrderStatus } from 'src/app/constent/order-status';
import { PaymentMode } from 'src/app/constent/payment-mode';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { OrdersService } from 'src/app/services/orders.service';
import { RxStompService } from 'src/app/services/rx-stomp.service';
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
  selectPaymentUPI: boolean = false
  upiURL!: string;
  selectPaymentCASH: boolean = false
  onlinePaymentDisbale: boolean = false
  selectedPaymentMethod: string |null = null;

  constructor(private orderService: OrdersService,private localStrorage: SecureLocalStorageService) { }
  ngAfterViewInit(): void {
    this.scanQr()
  }
  ngOnInit(): void {

    if (!this.vendorDetails) {
      const res = this.localStrorage.decryptAndGet(StorageKey.USER)
      this.vendorDetails = JSON.parse(res)

    }

  }

  acceptRequest(order: any) {
    this.isScan = false;

    if(order?.payment_mode === PaymentMode.CASH && order?.paymentStatus !== 'SUCCESS'){
      order.orderStatus = OrderStatus.Ongoing;
      order.paymentStatus = 'SUCCESS'
      this.orderService.QrOrderAcceptOrPaymentConform(order).subscribe((res:any)=>{
          if(res?.status === RequestStatus.success){
            alert("Order Conform!")
          }
      })
      // this.rxStompService.publish({ destination: '/app/orderStatus', body: JSON.stringify(order) })
      
    }else{
      this.closeOrder(order)
    }
  }

  scanQr() {
    const scanner = new Html5QrcodeScanner(this.readerElement?.nativeElement?.id, { fps: 10, qrbox: 250 }, false); // 👈 Add `false` as the third argument
    this.isScan = false;
    this.viewOn = false;
    this.toggleBtn = true

    setTimeout(() => {
      scanner.render(
        (decodedText: string) => {
          console.log('Scanned:', decodedText);
          alert('QR Code: ' + decodedText);
          scanner.clear();
          this.orderService.getOrdersByTokenAndVendor(this.vendorDetails?.vendorId, decodedText).subscribe((res: any) => {
           
            if (res.status === RequestStatus.success) {
              this.Order = res.data

              if (this.vendorDetails.upa && this.Order?.billingDtos?.totalAmount > 0) {
                this.onlinePaymentDisbale = true;
              }

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
    }, 1000)
  }

  onPaymentChange(method: string , data:any) {
  this.selectedPaymentMethod = method
  if (method === 'UPI') {
    this.selectPaymentCASH = false;
    this.selectPaymentUPI = true;

    if(data){
      this.OpenPaymentGateway(data);
    }
    
  } else if (method === 'CASH') {
    this.selectPaymentUPI = false;
    this.selectPaymentCASH = true;
  }
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

  OpenPaymentGateway(order: any) {

    let upiID = this.vendorDetails?.upa // Replace with actual UPI ID
    let amount = order?.billingDtos?.totalAmount // Change as needed
    let name = order?.restroName;
    // let txnId = "TXN123456"; // Unique Transaction ID
    // let txnRef = "Ref123456"; // Transaction Reference ID
    let currency = "INR";
    this.upiURL = `upi://pay?pa=${upiID}&pn=${name}&tn=Payment&am=${amount}&cu=${currency}`;

  }

  closeOrder(order:any) {
      // this.rxStompService.publish({ destination: '/app/orderStatus', body: JSON.stringify(order) })

      order.orderStatus = OrderStatus.Complete
      this.orderService.closeOrder(order).subscribe((res:any)=>{
          if(res?.status === RequestStatus.success){
            alert("Order Close!")
          }
      })
  }
}
