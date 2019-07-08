import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceptionistChatPage } from './receptionist-chat';

@NgModule({
  declarations: [
    ReceptionistChatPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceptionistChatPage),
  ],
})
export class ReceptionistChatPageModule {}
