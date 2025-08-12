import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-loader',
  templateUrl: './custom-loader.component.html',
  styleUrls: ['./custom-loader.component.css']
})
export class CustomLoaderComponent {
   @Input() isLoading: boolean = false;

}
