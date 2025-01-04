import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { StorageKey } from 'src/app/constent/storage-key';
import { PlaceOrderService } from 'src/app/services/place-order.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';

@Component({
  selector: 'app-ganarate-invoice',
  templateUrl: './ganarate-invoice.component.html',
  styleUrls: ['./ganarate-invoice.component.css'],
})
export class GanarateInvoiceComponent implements OnInit {

  products!: any;
  vendorDetails:any
  constructor(private router:Router , private route: ActivatedRoute , 
    private placeOrder:PlaceOrderService,
    private localSecureService:SecureLocalStorageService) { }
  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {
      const data = params.get('data');
      if (data) {
        const tmp = data;
        this.getOrderBill(tmp)
      }
    });
    this.getVendorDetail()
  }


  getVendorDetail(){
    if(!this.vendorDetails){
      const tmp = this.localSecureService.decryptAndGet(StorageKey.VENDER)
      debugger
    }
  }
  getOrderBill(data:any){
      this.placeOrder.invoice(data).subscribe((res:any)=>{
          console.log(res.data);
          this.products =  res.data;
          debugger
      })
  }


  totalAmount(): number {
    return this.products?.orderDetails.reduce((sum: number, item: { amount: number; quntity: number; }) => sum + (item.amount * item.quntity), 0);
  }
  generatePDF() {
    const data = document.getElementById('invoice'); // ID of the div containing the invoice content
    if (data) {
      html2canvas(data, { scale: 2 }).then(canvas => { // Increase scale for higher resolution
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        const contentDataURL = canvas.toDataURL('image/png');
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297; // A4 page height in mm

        // Add additional pages if needed
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= 297;
        }

        pdf.save('invoice.pdf');
      });
    }
  }
}
