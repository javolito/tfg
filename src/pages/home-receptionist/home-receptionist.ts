import {Component, Input, ViewChild} from '@angular/core';
import {AlertController, Button, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {RegisterPage} from "../register/register";
import {HandleErrorProvider} from "../../providers/handle-error/handle-error";
import {RestfulProvider} from "../../providers/restful/restful";
import {ChatSessionPage} from "../chat-session/chat-session";

/**
 * Generated class for the HomeReceptionistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-receptionist',
  templateUrl: 'home-receptionist.html',
})
export class HomeReceptionistPage {

  activeChats: any;
  checkOutActivated: boolean = false;
  inputValue: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private restful: RestfulProvider,
              private errorService: HandleErrorProvider,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,) {
    this.getCustomerChats();
  }

  ionViewDidLoad() {


  }

  addCustomer(){
    this.navCtrl.push(RegisterPage);
  }

  getCustomerChats(){
    let loading = this.loadingCtrl.create({
      content: 'Obteniendo Chats'
    });
    loading.present();
    this.restful.getChats(JSON.parse(localStorage.getItem("staff")).sessionToken).then(
      res =>{
        loading.dismiss();
        this.activeChats = JSON.parse(res.data);
      }
    ).catch(error => {
      loading.dismiss();
      this.errorService.handleError(error);
    });
  }

  goToChatPage(customerChat){
    this.navCtrl.push(ChatSessionPage, {'customerChat': customerChat})
  }

  checkOut(){
    if(this.checkOutActivated){
      if(this.inputValue == null){
        alert("Introduzca número de habitación");
      }else{
        let loading = this.loadingCtrl.create({
          content: 'Realizando Check Out'
        });
        loading.present();
        this.restful.checkOut(JSON.parse(localStorage.getItem("staff")).sessionToken, this.inputValue).then(res=>{
          loading.dismiss();
          let alert = this.alertCtrl.create({
            title: '¡Correcto!',
            subTitle: 'Operación realizada con éxito',
            buttons: ['OK'],
            enableBackdropDismiss: false
          });
          alert.present();
          this.getCustomerChats();
        }).catch(error=>{
          loading.dismiss();
          this.errorService.handleError(error);
        })
        document.getElementById("buttonCheckOut").classList.remove("checkOutActButton");
        document.getElementById("buttonCheckOut").classList.add("checkOutInActButton");
        document.getElementById("inputCheckOut").classList.remove("checkOutActInput");
        document.getElementById("inputCheckOut").classList.add("checkOutInActInput");
        this.checkOutActivated = false;
      }
    }else{
      document.getElementById("buttonCheckOut").classList.remove("checkOutInActButton");
      document.getElementById("buttonCheckOut").classList.add("checkOutActButton");
      document.getElementById("inputCheckOut").classList.remove("checkOutInActInput");
      document.getElementById("inputCheckOut").classList.add("checkOutActInput");
      this.checkOutActivated = true;
    }
  }

  doRefresh(event) {
    setTimeout(() => {
      event.complete();
    }, 1000);
    this.getCustomerChats();
  }

}
