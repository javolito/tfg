import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {RestfulProvider} from "../../providers/restful/restful";
import {HandleErrorProvider} from "../../providers/handle-error/handle-error";
import {ServicePage} from "../service/service";
import {OneSignal} from "@ionic-native/onesignal/ngx";
import {ReceptionistChatPage} from "../receptionist-chat/receptionist-chat";
import {NFC} from "@ionic-native/nfc/ngx";
import {BarcodeScanner,BarcodeScannerOptions} from "@ionic-native/barcode-scanner/ngx";
import * as $ from 'jquery';

/**
 * Generated class for the ListServicesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-services',
  templateUrl: 'list-services.html',
})
export class ListServicesPage {

  servicesList: any = [];
  nfcAvailable: string = "false";
  myListener: any;
  barcodeScannerOptions: BarcodeScannerOptions;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private restful: RestfulProvider,
              private loadingCtrl: LoadingController,
              private errorService: HandleErrorProvider,
              private oneSignal: OneSignal,
              private alertCtrl: AlertController,
              private nfc: NFC,
              private barcodeScanner: BarcodeScanner
              ) {
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
    this.handlerNotifications();
    this.getLinkAvailability();
    this.getServices();

  }

  getServices(){
    let loading = this.loadingCtrl.create({
      content: 'Cargando servicios...'
    });

    loading.present();
    this.restful.getServices(JSON.parse(localStorage.getItem("customer")).sessionToken).then(
      res =>{
        loading.dismiss();
        this.servicesList = JSON.parse(res.data);
      }
    ).catch(
      error => {
        loading.dismiss();
        this.errorService.handleError(error);
      }
    );
  }

  goToService(service){
    this.navCtrl.push(ServicePage, {
      service: service,
      isQR: false
    });
  }

  private handlerNotifications(){
    this.oneSignal.startInit('3ce76e66-7146-48c0-a4c7-3a22d53088ca', '711089774396');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.handleNotificationOpened()
      .subscribe(jsonData => {
        let alert = this.alertCtrl.create({
          title: jsonData.notification.payload.title,
          subTitle: jsonData.notification.payload.body,
          message:'<i class="alert-icon" text-center></i>',
          buttons: ['Aceptar'],
          enableBackdropDismiss: false
        });
        alert.present();
      });
    this.oneSignal.endInit();
    this.oneSignal.getIds().then((id) => {
      if(id != null){
        localStorage.setItem("oneSignalUserId", id.userId);
        this.restful.updateOneSignalId(JSON.parse(localStorage.getItem("customer")).sessionToken, id.userId).then(
          res =>{
            localStorage.setItem("customer", res.data);
          }
        ).catch(
          error => {
            this.errorService.handleError(error);
          }
        );
      }
    });
  }
  openChat(){
    this.navCtrl.push(ReceptionistChatPage);
  }
  linkBracelete(){
    /*this.nfc.enabled().
    then(() => {*/

      let loading = this.loadingCtrl.create({
        content: "LEA LA PULSERA",
        enableBackdropDismiss: true
      });
      loading.onDidDismiss(data => {
        this.myListener.unsubscribe();
      });
      loading.present();

      /*this.myListener = this.nfc.addNdefListener(() => {}, (err) => {}).
      subscribe((event) => {*/
        loading.dismiss();
        //this.myListener.unsubscribe();
        let nfcTag = "4,112,-68,-102,-86,74,-127";
        //let nfcTag = event.tag.id;
        let loading2 = this.loadingCtrl.create({
          content: "Vinculando..."
        });
        loading2.present();

        this.restful.linkNFC(JSON.parse(localStorage.getItem("customer")).sessionToken,
          JSON.parse(localStorage.getItem("customer")).id,
          nfcTag).
        then(res => {
          loading2.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Hecho',
            subTitle: 'Pulsera vinculada correctamente',
            buttons: ['Aceptar']
          });
          alert.present();
          this.getLinkAvailability();
        }).catch(error=>{
          loading2.dismiss();
          this.errorService.handleError(error);
        });
      //});
    /*},error => {
      let alert = this.alertCtrl.create({
        title: 'Ups',
        subTitle: 'NFC desactivado',
        buttons: [
          {
            text: "Activar NFC",
            handler: () => {
              this.nfc.showSettings();
            }
          }],
        enableBackdropDismiss: false
      });
      alert.present();
    });*/
  }

  getLinkAvailability(){
    this.restful.getLinkAvailability(JSON.parse(localStorage.getItem("customer")).sessionToken).then(
      res =>{
        this.nfcAvailable = res.data;
      }
    ).catch(
      error => {
        this.errorService.handleError(error);
      }
    );
  }

  qrScan() {
      this.barcodeScanner
        .scan()
        .then(barcodeData => {
          this.navCtrl.push(ServicePage, {
            serviceId: barcodeData.text,
            isQR: true
          });
        })
        .catch(err => {
          console.log("Error", err);
        });
  }
}
