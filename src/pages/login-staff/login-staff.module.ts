import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginStaffPage } from './login-staff';

@NgModule({
  declarations: [
    LoginStaffPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginStaffPage),
  ],
})
export class LoginStaffPageModule {}
