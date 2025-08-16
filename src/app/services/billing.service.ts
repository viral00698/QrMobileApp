import { Injectable } from '@angular/core';
import { OfferService } from './offer.service';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private venderObject: any;
  totalAmount!: number;
  mainAmount: any;
  constructor(private offerService: OfferService) { }

  setVendorObject(data: any) {
    this.venderObject = data;
  }

  async ganareteBill(items: any, vender: any) {

    this.venderObject = vender

    if (this.venderObject !== null && items.length > 0) {
      this.totalAmount = 0

      let itemsAfterOffer = await this.offerService.applyOffer(items)
      // step:1 totalAmount of all items
      // items.forEach((obj: any) => {
      //   let xAmt = obj?.amount * obj?.itemQty;
      //   this.totalAmount = this.totalAmount + xAmt;
      // })

      // Step 1: Total amount of all items
      itemsAfterOffer.forEach((obj: any) => {
        let tmp = 0;
        const offer = obj?.offer?.offerType
        if (offer === 'BOGO') {
          tmp = obj.amount * Math.ceil(obj.itemQty / 2); // 1 free per 1 bought
        } else if (offer === 'FLAT_DISCOUNT') {
          tmp = obj.amount * obj.itemQty; // Discount logic can be handled separately if needed
        } else {
          tmp = obj.amount * obj.itemQty;
        }

        this.totalAmount += tmp;
      });

      // step:2 calculate gst from total amount;
      const gst = (this.venderObject?.gstCharge / 100) * this.totalAmount;

      // step:3 calculate sgst from total amount;
      const sgst = (this.venderObject?.sgstCharge / 100) * this.totalAmount;

      // step:4 calculate ResturentCharge from total amount;
      const restoCharge = (this.venderObject?.resturentCharge / 100) * this.totalAmount;
      console.log(restoCharge);

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
        'restoCharge': this.venderObject?.resturentCharge,
        'restoChargeValue': restoCharge,
        'totalAmount': this.mainAmount
      }

      return json

    } else {
      return null
    }
  }

}
