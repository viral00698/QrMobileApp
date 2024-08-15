import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './qr/menu/menu.component';
import { PlaceorderComponent } from './order/placeorder/placeorder.component';

const routes: Routes = [
{path:'menu', component:MenuComponent},
{path:'placeorder' , component:PlaceorderComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
