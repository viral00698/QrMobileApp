import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SecureLocalStorageService {

  private secretKey: string = 'jhqekjlhfnkewnhkhncmlrugierljfgdoierlug98798742($8594$^%TBHGJHGJR$RYTFGBGHVFGGJBGNJHG #$%EYghfhgfghfhgfhgfvghfff!!^&%@)(+__'; // Use a strong key

  constructor() { }

  encriptAndSave(data: any, key: any) {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    localStorage.setItem(key, encryptedData)
  }
  
  decryptAndGet(key: any) {
    const encryptedData = localStorage.getItem(key)
    if (encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedData
    }
    return null;
  }


}
