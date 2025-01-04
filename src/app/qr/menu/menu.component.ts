
import { ChangeDetectorRef, Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { Orders } from 'src/app/model/orders.model';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { MenuService } from 'src/app/services/menu.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})

export class MenuComponent implements OnInit, OnDestroy, DoCheck {
  orderQty: number = 1;
  searchByItem: any;

  productList: any = [];
  tmpMenuList: any = []
  palaceOrderBtnFlag = false;
  venderId: any;
  venderDetails: any;
  customerUUId!: string
  dynamicId: any;

  constructor(private router: Router, private productService: MenuService, private userSelectItems: DataSharingService,
    private localStorageSecureService: SecureLocalStorageService,
    private changeDetectorRef: ChangeDetectorRef,
    private vendorService: VendorService,
    private route: ActivatedRoute
  ) { }
  ngDoCheck(): void {
    this.mapStoreOnDestory()
    // this.setItemsFromLocalStorage()
  }
  ngOnDestroy(): void {
    // this.mapStoreOnDestory()
  }
  ngOnInit(): void {


    // Access the query parameters when the app loads
    this.route.queryParams.subscribe(params => {
      this.dynamicId = params['ugygewncuirhij']; // Get the 'id' parameter
      // console.log('Dynamic ID:', this.dynamicId);
      if (this.dynamicId) {
        this.venderId = this.dynamicId
      }

    });

    this.setCustomerUUID();
    this.getVendorDetails()
    this.getInlocalStorgae(StorageKey.MENU)
    // this.setItemsFromLocalStorage()
  }

  setCustomerUUID() {

    this.customerUUId = this.localStorageSecureService.decryptAndGet(StorageKey.USERID);
    if (!this.customerUUId) {
      this.customerUUId = this.generateCustomUUID();
      this.localStorageSecureService.encriptAndSave(this.customerUUId, StorageKey.USERID);
    }

  }



  getVendorDetails() {

    if (!this.dynamicId) {

      this.route.params.subscribe(params => {
        const venderUUID = params['ugygewncuirhijd']; // Get the dynamic id parameter
        if (venderUUID) {
          this.venderId = venderUUID
        }
      });
    }
    this.vendorService.getVenderById(this.venderId).subscribe((res: any) => {
      if (res?.status === RequestStatus.success) {
        this.venderDetails = res?.data;
        this.localStorageSecureService.encriptAndSave(res?.data, StorageKey.VENDER)
      } else {
        // redirect error page or Home page
      }
    })
  }

  mapStoreOnDestory() {
    const tmp = this.userSelectItems.getMap()
    if (tmp.size !== 0) {
      this.localStorageSecureService.encriptAndSave(JSON.stringify(Array.from(tmp.entries())), StorageKey.ITEMS);
    }
  }
  getMunuFromDatabase(id: any) {

    this.productService.getMenuList(id).subscribe((res: any) => {
      if (res.status === RequestStatus.success) {
        this.productList = res.data;
        this.tmpMenuList = res.data;

        this.localStorageSecureService.encriptAndSave(this.productList, StorageKey.MENU)
        this.changeDetectorRef.detectChanges();
      }
    })
  }



  getInlocalStorgae(key: any) {

    const menuData = this.localStorageSecureService.decryptAndGet(StorageKey.MENU);
    if (menuData === '[]' || menuData === null) {
      this.getMunuFromDatabase(this.venderId);
    } else {
      this.productList = JSON.parse(menuData)
      // this.tmpMenuList = JSON.parse(menuData)
      const tmp = this.userSelectItems.getItemsArray();

      if (tmp.length > 0) {
        const tmpMap = this.productList.reduce((map: any, item: any) => {
          map.set(item?.productId, item);
          return map;
        }, new Map());

        tmp.forEach(item => {
          if (tmpMap.has(item?.productId)) {
            tmpMap.set(item?.productId, item);
          }
        })

        this.tmpMenuList = Array.from(tmpMap.values())
        this.productList = this.tmpMenuList;

      } else {
        this.tmpMenuList = [...this.productList];
      }
    }
  }

  setItemsFromLocalStorage() {

    const tmp = JSON.parse(this.localStorageSecureService.decryptAndGet(StorageKey.ITEMS))
    if (tmp !== null) {
      const map = new Map(tmp);
      this.userSelectItems.setMap(map);
    }

  }
  updateItems(data: any) {

    // const tmp =  this.userSelectItems.getItemsArray(); 
    this.tmpMenuList.forEach((obj: any, index: number) => {
      if (obj?.productId === data?.productId && data?.itemQty > 0) {
        this.tmpMenuList[index] = data; // Replacing the object in the array
      }
    });
    this.changeDetectorRef.detectChanges(); // Trigger change detection
  }


  itemAdd(item: any) {
    let tmpItem = null
    if (!this.userSelectItems.itemExists(item?.productId)) {
      item.itemQty = 1;
      tmpItem = this.userSelectItems.addItem(item);
    }
    if (tmpItem !== null) {
      this.updateItems(tmpItem);
    }
  }

  orderQtyInc(item: any) {
    let tmpItem = null
    if (!this.userSelectItems.itemExists(item?.productId)) {
      tmpItem = this.userSelectItems.addItem(item);
      item.itemQty = 1;
    } else {
      tmpItem = this.userSelectItems.incQty(item);
    }
    if (tmpItem !== null) {
      this.updateItems(tmpItem);
    }

  }
  ororderQtyDec(item: any) {
    let tmpItem = null
    if (item?.itemQty > 0) {
      tmpItem = this.userSelectItems.decQty(item);
    }
    if (item !== null && item.itemQty === 0) {
      this.userSelectItems.remove(item?.productId)
      item.itemQty = 0
    }
    if (tmpItem !== null) {
      this.updateItems(tmpItem);
    }

  }

  searchInmenu() {
    if (this.searchByItem) {
      const searchByItem = this.searchByItem.toLowerCase();
      this.tmpMenuList = this.productList.filter((item: any) =>
        item.itemName.toLowerCase().includes(searchByItem)
      );

    } else {
      this.tmpMenuList = this.productList
    }
    this.changeDetectorRef.detectChanges();

  }

  generateCustomUUID(): string {
    const segments = [
      this.generateRandomHex(8), // 8 characters
      this.generateRandomHex(4), // 4 characters
      '4002',                     // fixed to indicate version
      this.generateRandomHex(4),  // 4 characters
      this.generateRandomHex(12)   // 12 characters
    ];

    return segments.join('-');
  }

  private generateRandomHex(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomHex = Math.floor(Math.random() * 16).toString(16);
      result += randomHex;
    }
    return result;
  }

  redirectToPage() {
    this.router.navigate(['placeorder']); // Replace with your target route
  }

  navigateOrderHistory() {
    this.router.navigate(['OrderHistory']);
  }
}




