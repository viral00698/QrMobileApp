import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './qr/menu/menu.component';
import { PlaceorderComponent } from './order/placeorder/placeorder.component';
import { ConformationComponent } from './order/conformation/conformation.component';
import { OrderHistoryComponent } from './order/order-history/order-history.component';
import { LoginComponent } from './table/login/login.component';
import { VendorTableComponent } from './table/vendor-table/vendor-table.component';
import { TableOrdersComponent } from './table/table-orders/table-orders.component';
import { TableMenuComponent } from './table/table-menu/table-menu.component';
import { TablePlaceOrderComponent } from './table/table-place-order/table-place-order.component';
import { GanarateInvoiceComponent } from './table/ganarate-invoice/ganarate-invoice.component';
import { OnlinePayComponent } from './order/online-pay/online-pay.component';
import { OrderSuccessComponent } from './order/order-success/order-success.component';
import { OrderFaieldComponent } from './order/order-faield/order-faield.component';
import { OrderAcceptComponent } from './vendor/order-accept/order-accept.component';

const routes: Routes = [
{path:'',component:LoginComponent},   //http://localhost/?ugygewncuirhijd=d3456789-abcd-ef01-2345-6789abcdef01 it is working
{path:'menu/:ugygewncuirhijd', component:MenuComponent}, // vender id pass here
{path:'placeorder' , component:PlaceorderComponent},
{path:'conformation',component:ConformationComponent},
{path:'OrderHistory',component:OrderHistoryComponent},
{path:'login',component:LoginComponent},
{path:'vendorTable',component:VendorTableComponent},
{path:'tableOrders',component:TableOrdersComponent},
{path:'tableMenu',component:TableMenuComponent},
{path:'tablePlaceOrder',component:TablePlaceOrderComponent},
{path:'ganrateInvoice',component:GanarateInvoiceComponent},
{path:'online_pay',component:OnlinePayComponent},
{path:'order_success' , component:OrderSuccessComponent},
{path:'order_field',component:OrderFaieldComponent},
{path:'order_accept',component:OrderAcceptComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
