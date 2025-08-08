import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableDataSharingService {
 

  private table:any;
  private order:any;
  constructor() { }


  setTable(data:any){
    this.table = data 
  }

  getTable(){
    return this.table;
  }

  setTableOrder(products: any) {
    this.order = products;
  }
  getTableOrder() {
    return this.order
  }
}
