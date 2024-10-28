import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-ganarate-invoice',
  templateUrl: './ganarate-invoice.component.html',
  styleUrls: ['./ganarate-invoice.component.css']
})
export class GanarateInvoiceComponent implements OnInit {

  products!: any[];

  constructor() { }
  ngOnInit(): void {

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
