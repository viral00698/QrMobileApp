import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestStatus } from '../constent/request-status';
import { Router } from '@angular/router';
import { RxStompService } from './rx-stomp.service';
import { OrderStatus } from '../constent/order-status';
declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http:HttpClient , private router: Router , private rxStompService:RxStompService) { }

  makePayment(data:any) {
    debugger
    this.loadRazorpayScript().then(() => {
      const options = {
        key: 'rzp_test_gD5uJZvpUqS4ka', // Replace with Razorpay key
        // amount: 50000, // Example: 500.00 INR in paise
        currency: 'INR',
        name: 'Vitts.in',
        description: 'Enjoy a hassle-free dining experience with secure online payments at Vitts.in – Order, Pay, and Savor!',
        // description: 'Testing Razorpay',
        order_id: data?.razorpayOrder?.orderId,
        method: {
           // Enable UPI as a payment option
          card: true, // Enable card payments
          wallet: false, // Enable wallets
          emi:false,
          netbanking:false,
          upi: { intent: true },
        },
        handler: (response: any) => {
          console.log('Payment successful', response);
          
          if(response){

            data['razorpayResponse'] = response
            this.postVerificationObject(data).subscribe((res:any)=>{
             
              if(res.status === RequestStatus.success && res.data){
                data.orders.orderStatus = OrderStatus.Ongoing
                this.rxStompService.publish({ destination: '/app/orderStatus', body: JSON.stringify(data?.orders) })
                data['paymentStatus'] = true
                this.router.navigate(['order_success'] ,{ state: { orderData: (res?.data as any) } });
              }else{
                data['paymentStatus'] = false
                this.router.navigate(['order_field']);
              }
            })
          }else{
            this.router.navigate(['order_field']);
          }
        },
      };
  
      const razorpay = new Razorpay(options);
      razorpay.open();
    }).catch(() => {
      console.error('Failed to load Razorpay script');
    });
  }

  loadRazorpayScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });
  }


  postVerificationObject(data:any){
      return this.http.post('api/v1/qr/order/getSignuture' , data);
  }


}
