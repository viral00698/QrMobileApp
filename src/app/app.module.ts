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
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { ConformationComponent } from './order/conformation/conformation.component';
import { DialogModule } from 'primeng/dialog';
import { KnobModule } from 'primeng/knob';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UrlFilterInterceptor } from './filter/url-filter.interceptor';
import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpeedDialModule } from 'primeng/speeddial';
import { RxStompService } from './services/rx-stomp.service';
import { SocketConfigService } from './services/socket-config.service';
import { OrderHistoryComponent } from './order/order-history/order-history.component';
import { VendorTableComponent } from './table/vendor-table/vendor-table.component';
import { LoginComponent } from './table/login/login.component';
import { TableOrdersComponent } from './table/table-orders/table-orders.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { TableMenuComponent } from './table/table-menu/table-menu.component';
import { TablePlaceOrderComponent } from './table/table-place-order/table-place-order.component';
import { GanarateInvoiceComponent } from './table/ganarate-invoice/ganarate-invoice.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    PlaceorderComponent,
    ConformationComponent,
    OrderHistoryComponent,
    VendorTableComponent,
    LoginComponent,
    TableOrdersComponent,
    TableMenuComponent,
    TablePlaceOrderComponent,
    GanarateInvoiceComponent,
  
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
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
    DialogModule,
    KnobModule,
    HttpClientModule,
    BadgeModule,
    ProgressSpinnerModule,
    SpeedDialModule,
    TableModule,
    DropdownModule
    
    
  ],
  providers: [
    RxStompService,
    SocketConfigService,
    {provide: HTTP_INTERCEPTORS,useClass: UrlFilterInterceptor,multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
