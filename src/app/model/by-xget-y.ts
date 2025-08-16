 
import { StorageKey } from "../constent/storage-key";
import { DataSharingService } from "../services/data-sharing.service";
import { SecureLocalStorageService } from "../services/secure-local-storage.service";

export class ByXGetY {

    products: any;

    constructor(private localStorageSecureService: SecureLocalStorageService, private userSelectItems: DataSharingService) {

        const t = localStorageSecureService.decryptAndGet(StorageKey.MENU);
        this.products = JSON.parse(t);

    }

    applyBuyXGetY(orderDetails: any): any {
        try {

            const offer = orderDetails?.offer;

            if (orderDetails.oflineOffer || !offer || !this.hasOffer(offer)) {
                return null;
            }

            const minOrderAmount = offer.minOrderAmount ?? 0;

            // If order doesn't meet the minimum, return null (same as your Java code)
            if (orderDetails.amount < minOrderAmount) {
                return null;
            }

            // Get the free item from the product list
            let freeProduct = null;
            for (let i of this.products) {
                if (i.productId === offer.freeItem) {
                    freeProduct = i;
                    break;
                }
            }


            if (freeProduct) {
                // const freeItem = cloneDeep(freeProduct);
                const freeItem = structuredClone(freeProduct);
                freeItem.amount = 0.0;
                freeItem.quantity = 1;
                freeItem.itemQty = 1;

                this.itemAdd(freeItem)
                orderDetails.oflineOffer = true
                orderDetails.OfferApplied = true
                return freeItem;

            }

        } catch (e: any) {
            console.error(`${e.message} Error in BUY_X_GET_Y offer implementation`);
        }

        return null;
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

    itemAdd(item: any) {

        this.userSelectItems.setFreeItem(item)
        // if (!this.userSelectItems.itemExists(item?.productId)) {
        //     item.itemQty = 1;
        //     this.userSelectItems.addItem(item);
        // }

    }

}
