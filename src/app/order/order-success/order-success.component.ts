import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent {
  @ViewChild('receipt', { static: false }) receiptElement!: ElementRef;


  qrData: string = 'http://192.168.81.204:4201/order_success';
  responseData: any;
  formattedDate!: string;

  constructor(private router: Router, private dataSharing: DataSharingService) { }

  ngOnInit() {
    this.responseData = this.dataSharing.getResponse();
    this.qrData = this.responseData?.token
  
    const date = new Date();

    const day = String(date.getDate()).padStart(2, '0'); // dd
    const month = date.toLocaleString('default', { month: 'short' }); // Jan, Feb, Mar ...
    const year = date.getFullYear(); // yyyy

    this.formattedDate = `${day}/${month}/${year}`;
  }

  downloadReceipt() {
    const receipt = this.receiptElement.nativeElement;

    // Hide download button before capturing
    const downloadBtn = receipt.querySelector('.ignore-btn');
    downloadBtn.style.display = 'none';

    // Capture screenshot
    html2canvas(receipt, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Restore button visibility
      downloadBtn.style.display = 'block';

      // Create a download link
      const link = document.createElement('a');
      link.href = imgData;


      link.download = 'order-receipt_'+this.formattedDate+'.png';
      link.click();
    });

    this.router.navigate(['OrderHistory']);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any): void {
    // Handle the back button press
    console.log('Back button pressed');
    history.pushState(null, '', window.location.href);
  }

}
