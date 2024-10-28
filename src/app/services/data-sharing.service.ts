import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageKey } from '../constent/storage-key';
import { SecureLocalStorageService } from './secure-local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  constructor(private localStorageSecureService: SecureLocalStorageService) { }
  private map: Map<string, any> = new Map();

  addItem(item: any) {
    this.map.set(item.productId, item);
    this.localStorageSecureService.encriptAndSave(JSON.stringify(Array.from(this.map.entries())), StorageKey.ITEMS);
  }

  remove(productId: any) {
    this.map.delete(productId)
    this.localStorageSecureService.encriptAndSave(JSON.stringify(Array.from(this.map.entries())), StorageKey.ITEMS);
  }

  clearItem() {
    this.map.clear()
    this.localStorageSecureService.encriptAndSave(JSON.stringify(Array.from(this.map.entries())), StorageKey.ITEMS);
  }

  itemExists(productId: any): boolean {
    return this.map.has(productId);
  }

  incQty(obj: any): any {
    const tmpItem = this.map.get(obj.productId);
    if (tmpItem) {
      tmpItem.itemQty++;
      this.map.set(tmpItem.productId, tmpItem);
      this.localStorageSecureService.encriptAndSave(JSON.stringify(Array.from(this.map.entries())), StorageKey.ITEMS);
      return tmpItem
    }
    return null
  }

  decQty(obj: any): any {
    const tmpItem = this.map.get(obj.productId);
    if (tmpItem) {
      tmpItem.itemQty--;
      if (tmpItem.itemQty === 0) {
        this.remove(tmpItem.productId);
        return null
      }
      this.map.set(tmpItem.productId, tmpItem);
      this.localStorageSecureService.encriptAndSave(JSON.stringify(Array.from(this.map.entries())), StorageKey.ITEMS);

      return tmpItem
    }
    return null
  }

  getItemsArray() {
    if (this.map.size === 0) {
      try {
        const tmp = JSON.parse(this.localStorageSecureService.decryptAndGet(StorageKey.ITEMS));
        const t: Map<string, any> = new Map(JSON.parse(tmp));
        if (t.size > 0) {
          this.map = t;
          return Array.from(t.values())
        }
      } catch (error) {
        return []
      }

    }

    return Array.from(this.map.values())
  }

  setMap(data: any) {
    this.map = data;
  }

  getMap(): Map<string, any> {
    return this.map;
  }

}
