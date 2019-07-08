import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatSessionPage } from './chat-session';

@NgModule({
  declarations: [
    ChatSessionPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatSessionPage),
  ],
})
export class ChatSessionPageModule {}
