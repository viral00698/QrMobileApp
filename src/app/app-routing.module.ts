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
import { authRollwiseChildGuard, authRollwiseGuard } from './guard/auth-rollwise.guard';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { FeedbackComponent } from './feedback/feedback.component';

const routes: Routes = [
{path:'',component:LoginComponent},   //http://localhost/?ugygewncuirhijd=d3456789-abcd-ef01-2345-6789abcdef01 it is working
{path:'menu/:ugygewncuirhijd', component:MenuComponent}, // vender id pass here

{path:'md' , component:ManagerDashboardComponent, canActivate:[authRollwiseGuard] ,data: { roles: ['MANAGER'] } , children:[
  {path:'vendorTable',component:VendorTableComponent, canActivate:[authRollwiseChildGuard] ,data: { roles: ['MANAGER'] }},
  {path:'tableOrders',component:TableOrdersComponent , canActivate:[authRollwiseChildGuard] ,data: { roles: ['MANAGER'] }},
  {path:'tableMenu',component:TableMenuComponent , canActivate:[authRollwiseChildGuard] ,data: { roles: ['MANAGER'] }},
  {path:'tablePlaceOrder',component:TablePlaceOrderComponent , canActivate:[authRollwiseChildGuard] ,data: { roles: ['MANAGER'] }},
  {path:'ganrateInvoice',component:GanarateInvoiceComponent , canActivate:[authRollwiseChildGuard] ,data: { roles: ['MANAGER'] }},
]},

{path:'feedback' , component:FeedbackComponent},
{path:'placeorder' , component:PlaceorderComponent},
{path:'conformation',component:ConformationComponent},
{path:'OrderHistory',component:OrderHistoryComponent},
{path:'login',component:LoginComponent},
// {path:'vendorTable',component:VendorTableComponent},

{path:'online_pay',component:OnlinePayComponent},
{path:'order_success' , component:OrderSuccessComponent},
{path:'order_field',component:OrderFaieldComponent},
{path:'order_accept',component:OrderAcceptComponent},
{path:'unauthorized',component:UnauthorizedComponent},

{ path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
