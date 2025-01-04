import { AppType } from "../constent/app-type";
import { OrderStatus } from "../constent/order-status";
import { PaymentMode } from "../constent/payment-mode";
import { OrderDetails } from "./order-details";

export class Orders {

    orderId?: string;  // UUID represented as a string
    customerUUID?: string;  // UUID represented as a string
    customerMobileNo?: string;
    customerName?:string;
    token_no?: string;
    txid?: string;
    orderDetails?: OrderDetails[];  // PrimeNG Table or List Model
    orderAt?: Date;  // PrimeNG p-calendar component for dates
    payment_mode?: PaymentMode;
    vendorId?: string;  // UUID represented as a string
    totelAmount?: number;
    gst?: number;
    sgst?: number;
    restaurantsCharge?: number;
    orderStatus?: OrderStatus;
    appType?:AppType;
    restroName!:string;
    tableId?:string;
    tableOrder:any
  }
  
  

