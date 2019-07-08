import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';

/**
 * Generated class for the ReceptionistChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-receptionist-chat',
  templateUrl: 'receptionist-chat.html',
})
export class ReceptionistChatPage {
  @ViewChild("contentBody") contentBody: any;
  inputMessage: string;
  messages = [];
  roomNumberCustomer: any;
  customerEmail: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.roomNumberCustomer = JSON.parse(localStorage.getItem("customer")).roomNumber;
    this.customerEmail = JSON.parse(localStorage.getItem("customer")).email;
    this.getMessages();
  }

  ionViewDidLoad() {

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
      roomNumber: this.roomNumberCustomer,
      message: this.inputMessage,
      customerEmail: this.customerEmail
    });
    this.inputMessage = "";
  }
}
