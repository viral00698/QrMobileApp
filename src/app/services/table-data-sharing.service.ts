import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableDataSharingService {

  private table:any;
  constructor() { }


  setTable(data:any){
    this.table = data 
  }

  getTable(){
    return this.table;
  }
}
