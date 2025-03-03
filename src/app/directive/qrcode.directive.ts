import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import QRCode from 'qrcode';

@Directive({
  selector: '[appQrcode]'
})
export class QrcodeDirective implements OnChanges {


  @Input() qrData: string = '';

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    if (this.qrData) {
      this.generateQRCode();
    }
  }

  private async generateQRCode() {
    try {
      this.el.nativeElement.innerHTML = ''; // Clear previous QR code
      const canvas = document.createElement('canvas');
      debugger
      await QRCode.toCanvas(canvas, this.qrData, { width: 200 });
      this.el.nativeElement.appendChild(canvas);
    } catch (error) {
      console.error('QR Code generation failed:', error);
      debugger
    }
  }
}
