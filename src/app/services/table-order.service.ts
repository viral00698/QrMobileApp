import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableOrderService {

  constructor(private http: HttpClient) { }

  addTable(data: any) {
    return this.http.post('api/v1/tableOrder/addTable', data);
  }

  getTableByVendor(vendorId: any) {
    return this.http.get('api/v1/tableOrder/getTableByVendor/' + vendorId)
  }

  deleteTableByVendor(tableId: any) {
    return this.http.get('api/v1/tableOrder/deleteTable/' + tableId)
  }

  getbyTableOrders(vid:any,tid:any){
    return this.http.get('Orders/getbyTableOrder/' + vid+ '/' +tid)
  }

  createRozerpayOrderForTable(order:any , vendor:any){

    const json = {
      vendor:vendor,
      order:order,
    }
    return this.http.post('api/v1/tableOrder/createRozerPayOrder' ,json)
  }

  updateTableStatus(table:any){
    return this.http.post('api/v1/tableOrder/updateTableStatus' , table);
  }

  genrateInvoice(order:any ,vendor:any ){
    const json = {
      order:order,
      vendor:vendor
    }
    return this.http.post('api/v1/tableOrder/genrateInvoice' , json);
  }

  getOfferByVendor(vendorId:any){
    return this.http.get('offer/getOfferByVendor/'+vendorId);
  }
}
