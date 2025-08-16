import { Injectable } from '@angular/core';
import { OfferType } from '../constent/offer-type';
import { HttpClient } from '@angular/common/http';
import { SecureLocalStorageService } from './secure-local-storage.service';
import { StorageKey } from '../constent/storage-key';
import { BOGO } from '../model/bogo';
import { FlatDiscount } from '../model/flat-discount';
import { ByXGetY } from '../model/by-xget-y';
import { DataSharingService } from './data-sharing.service';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  offerData: any;

  constructor(private http: HttpClient, private localSecureStorage: SecureLocalStorageService ,  private userSelectItems: DataSharingService) { }
  // applyOffer(items:any): any {
  //   for(let i = 0; i < items.length; i++){
  //     const item = items[i];
  //     if(item?.offer && item?.offer?.offerType === OfferType.BOGO){
  //          items[i] = this.BOGOOffer(item);
  //     }

  //   }
  //   return items;
  // }


  private BOGOOffer(item: any) {


    const quantity = item.itemQty || 0;
    const unitPrice = item.amount || 0;

    const paidQty = Math.ceil(quantity / 2); // Buy 1 Get 1 = pay for half (rounded up)
    const totalPrice = paidQty * unitPrice;

    item.amount = totalPrice;
    item.itemQty = paidQty;
    return item;

  }

  async applyOffer(items: any): Promise<any> {
    try {
      const newList: any[] = [];

      items.forEach(async (orderDetails: any) => {
        const offer = orderDetails?.offer?.offerType
        if (offer === 'BOGO') {
          let obj = new BOGO();
          const t = await obj.applyBogo(orderDetails);
          newList.push(t);
        } else if (offer === 'FLAT_DISCOUNT') {
          let obj = new FlatDiscount();
          const t = obj.applyFlatDiscount(orderDetails);
          newList.push(t);
        } else if (offer === 'BUY_X_GET_Y') {
          newList.push(orderDetails)
          const obj = new ByXGetY(this.localSecureStorage , this.userSelectItems)
          const t = obj.applyBuyXGetY(orderDetails);
          if (t) {
            newList.push(t);
          }

        } else {
          newList.push(orderDetails);
        }
      });

      return newList;

    } catch (e: any) {
      console.error(e.message);
      return null;
    }
  }






}
