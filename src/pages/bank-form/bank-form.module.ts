import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BankFormPage } from './bank-form';

@NgModule({
  declarations: [
    BankFormPage,
  ],
  imports: [
    IonicPageModule.forChild(BankFormPage),
  ],
})
export class BankFormPageModule {}
