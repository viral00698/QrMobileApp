import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  private vender: any;
  constructor(private http: HttpClient) { }

  getVenderById(id:any) {
    return this.http.get('vendor/qr/getVendor/'+id);
  }

  setVenderObject(data: any) {
    this.vender = data
  }

  getVenderObject() {
    return this.vender
  }

  getTables(vendorId:any){
    return this.http.get('api/v1/tableOrder/getTableByVendor/'+vendorId)
  }

  
}
