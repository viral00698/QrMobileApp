import { Component } from '@angular/core';
declare var Razorpay: any;
@Component({
  selector: 'app-placeorder',
  templateUrl: './placeorder.component.html',
  styleUrls: ['./placeorder.component.css']
})
export class PlaceorderComponent {

  orderQty: number = 1;

  orderQtyInc() {
    this.orderQty = this.orderQty + 1;
  }
  ororderQtyDec() {
    if (this.orderQty > 0) {
      this.orderQty = this.orderQty - 1;
    }
  }



  openRazorpay() {
    const options: any = {
      key: 'rzp_test_8Gk4nMFZwObs1V', // Replace with your Razorpay Key ID
      amount: 100, // Amount in paise (10000 paise = 100 INR)
      currency: 'INR',
      name: 'Your Company',
      description: 'Test Transaction',
      handler: function (response: any) {
        // Handle successful payment
        console.log('Payment successful:', response);
        // You can send `response.razorpay_payment_id` to your server for verification
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999'
      },
      notes: {
        address: 'Some address'
      },
      theme: {
        color: '#3399cc'
      },
      // Specify payment method options
      payment_methods: {
        upi: true,
        card: true,
      },
      // Optionally, you can configure additional settings
      modal: {
        ondismiss: function() {
          console.log('Payment form closed');
        }
      }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  }



}
