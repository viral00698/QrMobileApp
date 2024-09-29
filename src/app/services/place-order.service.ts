import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaceOrderService {

  private billObject:any;
  constructor(private http:HttpClient) { }

  orderPlaced(data:any){
    return this.http.post('api/v1/qr/order/placeOrder',data);
  }

  setBillingObject(data:any){
    this.billObject = data
  }

  getBillingObject(){
    return this.billObject
  }
}
