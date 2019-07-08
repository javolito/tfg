 import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
 import * as firebase from 'firebase';

/**
 * Generated class for the ChatSessionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-session',
  templateUrl: 'chat-session.html',
})
export class ChatSessionPage {
  @ViewChild("contentBody") contentBody: any;
  inputMessage: string;
  messages = [];
  roomNumberCustomer: any;
  customerEmail: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.roomNumberCustomer = this.navParams.get('customerChat').roomNumber;
    this.customerEmail = this.navParams.get('customerChat').email;
    this.getMessages();
    //this.contentBody.scrollToBottom();
  }

  IonViewDidEnter(){
    //this.contentBody.scrollToBottom();
  }
  getMessages(){
    var messagesRef = firebase.database().ref().child("messages");
    messagesRef.on("value", (snap) => {
      var data= snap.val();
      this.messages = [];
      for(var key in data){
        this.messages.push(data[key]);
      }
      this.scrollToBottom();
    });
  }

  scrollToBottom(){
    this.contentBody.scrollToBottom(1500);
  }
  sendMessage(){
    var messagesRef = firebase.database().ref().child("messages");
    messagesRef.push({
      roomNumber: 0,
      message: this.inputMessage,
      customerRoom: this.roomNumberCustomer,
      customerEmail: this.customerEmail
    });
    this.inputMessage = "";
  }
}
