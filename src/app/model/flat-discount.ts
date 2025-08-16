
export class FlatDiscount {

    applyFlatDiscount(orderDetails: any): any {
        try {
            // If offer is already applied, return the item as-is

            const offer = orderDetails?.offer

            if (orderDetails.oflineOffer || !offer || !this.hasOffer(offer)) {
                return orderDetails;
            }
            if (offer.offerType === 'FLAT_DISCOUNT' && orderDetails.amount > offer.minOrderAmount) {
                const discount = offer.flatDiscount; // e.g., ₹50 off
                const totalPrice = orderDetails.amount * orderDetails.itemQty;

                // Apply flat discount per quantity
                let finalAmount = totalPrice - (discount * orderDetails.itemQty);

                // Ensure no negative prices
                if (finalAmount < 0) {
                    finalAmount = 0;
                }

                // Update the order details
                orderDetails.amount = finalAmount;
                // orderDetails.discount = discount; // Optional if you store discount separately
                orderDetails.oflineOffer = true;   
                orderDetails.OfferApplied = true            

            } else {
                return orderDetails;
            }
        } catch (e: any) {
            console.error(`Error while applying flat discount: ${e.message}`);
        }

        return orderDetails;
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

