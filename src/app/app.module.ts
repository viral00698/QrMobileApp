import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MenuComponent } from './qr/menu/menu.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InplaceModule } from 'primeng/inplace';
import { PanelModule } from 'primeng/panel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlaceorderComponent } from './order/placeorder/placeorder.component';
import { AppRoutingModule } from './app-routing.module'; // Import your routing module
import { DataViewModule, DataViewLayoutOptions } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { GooglePayButtonModule } from '@google-pay/button-angular';
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    PlaceorderComponent
  ],
  imports: [
    BrowserModule,
    CardModule,
    ButtonModule,
    InplaceModule,
    PanelModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    DataViewModule,
    DividerModule,
    GooglePayButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
