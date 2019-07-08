import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListServicesPage } from './list-services';

@NgModule({
  declarations: [
    ListServicesPage,
  ],
  imports: [
    IonicPageModule.forChild(ListServicesPage),
  ],
})
export class ListServicesPageModule {}
