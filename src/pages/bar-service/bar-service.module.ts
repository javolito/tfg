import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarServicePage } from './bar-service';

@NgModule({
  declarations: [
    BarServicePage,
  ],
  imports: [
    IonicPageModule.forChild(BarServicePage),
  ],
})
export class BarServicePageModule {}
