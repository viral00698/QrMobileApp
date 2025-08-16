import { StorageKey } from "../constent/storage-key";
import { SecureLocalStorageService } from "../services/secure-local-storage.service";

export class BOGO {
    constructor() { }

    async applyBogo(item: any): Promise<any> {

        try {
            // If offer is already applied, return item as is

            const tmp = item?.offer;
            if (item.oflineOffer || !this.hasOffer(tmp) || !tmp) {
                return item;
            }

            if (tmp.offerType && tmp.offerType.toString() === 'BOGO') {
                const originalQty = item.quantity;
                const freeQty = originalQty; // For BOGO, 1 free per 1 bought

                // Adjust total quantity
                item.itemQty = originalQty + freeQty;
                item.quantity = item.itemQty;
                item.oflineOffer = true;
                item.OfferApplied = true;
                
                return item
            }

        } catch (e: any) {
            console.error(`${e.message} Error at BOGO offer implementation`);
        }
        return item;
    }

    
  hasOffer(item: any): boolean {

    if (!item || !item?.isActive) {
      return false;
    }

    const offerExpiry = item?.expireDate
    const now = new Date();

    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const endOfTodayMillis = endOfToday.getTime();

    return offerExpiry > endOfTodayMillis;
  }
}
