import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './qr/menu/menu.component';
import { PlaceorderComponent } from './order/placeorder/placeorder.component';
import { ConformationComponent } from './order/conformation/conformation.component';
import { OrderHistoryComponent } from './order/order-history/order-history.component';

const routes: Routes = [
{path:'menu/:ugygewncuirhijd', component:MenuComponent}, // vender id pass here
{path:'placeorder' , component:PlaceorderComponent},
{path:'conformation',component:ConformationComponent},
{path:'OrderHistory',component:OrderHistoryComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
