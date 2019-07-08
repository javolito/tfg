import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeReceptionistPage } from './home-receptionist';

@NgModule({
  declarations: [
    HomeReceptionistPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeReceptionistPage),
  ],
})
export class HomeReceptionistPageModule {}
