import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeWaiterPage } from './home-waiter';

@NgModule({
  declarations: [
    HomeWaiterPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeWaiterPage),
  ],
})
export class HomeWaiterPageModule {}
