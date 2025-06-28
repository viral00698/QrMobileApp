import { Injectable } from '@angular/core';
import { OfferType } from '../constent/offer-type';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor() { }
  applyOffer(items:any): any {
    for(let i = 0; i < items.length; i++){
      const item = items[i];
      if(item?.offer && item?.offer?.offerType === OfferType.BOGO){
           items[i] = this.BOGOOffer(item);
      }

    }
    return items;
  }


 private BOGOOffer(item:any){
 

  const quantity = item.itemQty || 0;
  const unitPrice = item.amount || 0;

  const paidQty = Math.ceil(quantity / 2); // Buy 1 Get 1 = pay for half (rounded up)
  const totalPrice = paidQty * unitPrice;

  item.amount = totalPrice;
  item.itemQty = paidQty;
  return item;

  }



}
