import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private venderObject: any;
  private getInvoice: any;
  totalAmount!: number;
  mainAmount: any;
  constructor() { }

  setVendorObject(data: any) {
    this.venderObject = data;
  }

  ganareteBill(items: any, vender: any) {

    this.venderObject = vender

    if (this.venderObject !== null && items.length > 0) {
      this.totalAmount = 0

      // step:1 totalAmount of all items
      items.forEach((obj: any) => {
        let xAmt = obj?.amount * obj?.itemQty;
        this.totalAmount = this.totalAmount + xAmt;
      })

      // step:2 calculate gst from total amount;
      const gst = (this.venderObject?.gstCharge / 100) * this.totalAmount;

      // step:3 calculate sgst from total amount;
      const sgst = (this.venderObject?.sgstCharge / 100) * this.totalAmount;

      // step:4 calculate ResturentCharge from total amount;
      const restoCharge = (this.venderObject?.ResturentCharge / 100) * this.totalAmount;

      this.mainAmount = 0

      if (this.totalAmount > 0) {
        this.mainAmount = this.totalAmount;
      }
      if (gst > 0) {
        this.mainAmount = this.mainAmount + gst
      }

      if (sgst > 0) {
        this.mainAmount = this.mainAmount + sgst
      }

      if (restoCharge > 0) {
        this.mainAmount = this.mainAmount + restoCharge
      }

      const json = {
        'orderValue': this.totalAmount,
        'gstCharge': this.venderObject?.gstCharge,
        'gstValue': gst,
        'sgstCharge': this.venderObject?.sgstCharge,
        'sgstValue': sgst,
        'restoCharge': this.venderObject?.ResturentCharge,
        'restoChargeValue': restoCharge,
        'totalAmount': this.mainAmount
      }

      return json

    } else {
      return null
    }
  }

}
