
export class OrderDetails {
    orderDetailsId?: string; // UUID as string
    itemName!: string;
    productId!: string; // UUID as string
    amount!: number;
    isJain!: boolean;
    quntity!: number;
    orderId?: any; // Reference to Orders object
    foodCategory:any;
    offerId:any;
    offerType:any;
    OfferApplied:any;
    isDelivered!:boolean
}
