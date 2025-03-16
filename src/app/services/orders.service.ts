import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http:HttpClient) { }
  getOrdersByCustomerId(id:any){
    return this.http.get('product/getByOrderBy/'+id);
  }

  getOrdersByTokenAndVendor(vendorId:string , token:string){
    return this.http.get('Orders/getOrdersByTokenAndVendor/'+vendorId+'/'+token)
  }

  getOrders(vendorId:string): any {
    return this.http.get('Orders/getLastTwoDayOrder/' + vendorId);
  }
}
