import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestStatus } from '../constent/request-status';
import { Router } from '@angular/router';
declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http:HttpClient , private router: Router) { }

  makePayment(data:any) {
    this.loadRazorpayScript().then(() => {
      const options = {
        key: 'rzp_test_Ega5AUS7osq9QI', // Replace with Razorpay key
        // amount: 50000, // Example: 500.00 INR in paise
        currency: 'INR',
        name: 'Vitts.in',
        description: 'Testing Razorpay',
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
