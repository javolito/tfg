import {Component, ViewChild} from '@angular/core';
import {AlertController, DateTime, IonicPage, LoadingController, NavController, NavParams, Select} from 'ionic-angular';
import {RestfulProvider} from "../../providers/restful/restful";
import {HandleErrorProvider} from "../../providers/handle-error/handle-error";
import {OneSignal} from "@ionic-native/onesignal/ngx";
import {MbscCalendarOptions, mobiscroll} from "@mobiscroll/angular";

mobiscroll.settings = {
  theme: 'ios',
  display: 'bottom'
};


const now = new Date();

/**
 * Generated class for the ServicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-service',
  templateUrl: 'service.html',
})
export class ServicePage {
  /*settings: any = {
    onClose: (event, inst) => {
      alert(event.valueText);
    }
  }*/
  settings: any = {
    onInit: (event, inst) => {
      alert("hola");
    }
  }

  catalogue: any = [];
  serviceId: any;
  serviceObject: any;
  productObject: any;
  external = now;
  dateString: any;
  startHour: any;
  endHour: any;
  orange: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private restful: RestfulProvider,
              private errorService: HandleErrorProvider,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              public oneSignal: OneSignal) {
    if(this.navParams.get('isQR') == true){
      this.serviceId = this.navParams.get('serviceId');
      this.getServiceObject();
    }else if(this.navParams.get('isQR') == false){
      this.serviceObject = this.navParams.get('service')
      this.serviceId = this.serviceObject.id;
    }
    this.orange = 'secondary';
    this.startHour = this.serviceObject.startHour.toLocaleString();
    var sizeStart = this.startHour.length;
    this.startHour = this.startHour.substring(sizeStart-11, sizeStart);
    this.endHour = this.serviceObject.endHour.toLocaleString();
    var sizeEnd = this.endHour.length;
    this.endHour = this.endHour.substring(sizeEnd-11, sizeEnd);
    this.getCatalogue();
  }

  getCatalogue(){
    let loading = this.loadingCtrl.create({
      content: 'Cargando catálogo...'
    });

    loading.present();
    this.restful.getServiceCatalogue(JSON.parse(localStorage.getItem("customer")).sessionToken, this.serviceId).then(
      res => {
        loading.dismiss();
        this.catalogue = JSON.parse(res.data);
      }).catch(error => {
      loading.dismiss();
      this.errorService.handleError(error);
      this.navCtrl.pop();
    });
  }
  openCalendar(){
    this.registerSale(this.productObject);
  }
  setProductClick(product){
    this.productObject = product;
  }

  registerSale(product) {
    let alert1 = this.alertCtrl.create({
      title: 'CONFIRMAR PEDIDO',
      message: "¿Quieres realizar este pedido?",
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Sí',
          handler: () => {
            let loading2 = this.loadingCtrl.create({
              content: "Registrando transacción"
            });
            this.dateString = this.external.toLocaleString('en-GB');
            loading2.present();
            this.restful.registerServiceSale(this.serviceId,
              product.id,
              JSON.parse(localStorage.getItem("customer")).id,
              JSON.parse(localStorage.getItem("customer")).sessionToken,
              product.price,
              JSON.parse(localStorage.getItem("customer")).stripeId,
              this.dateString).then(
              (res) => {
                loading2.dismiss();
                let notificationObj: any = {
                  headings: {
                    en: "!!Compra realizada!!",
                  },
                  contents: {
                    en: this.serviceObject.name + ":" + product.price + " euros. Fecha: "+ this.dateString,
                  },
                  app_id: "3ce76e66-7146-48c0-a4c7-3a22d53088ca",
                  include_player_ids: [JSON.parse(localStorage.getItem("customer")).oneSignalId]
                };
                this.oneSignal.postNotification(notificationObj).then((success) => {
                }).catch((error) => {

                });
                let alert = this.alertCtrl.create({
                  title: '¡Correcto!',
                  subTitle: 'Operación realizada con éxito',
                  buttons: ['OK'],
                  enableBackdropDismiss: false
                });
                alert.present();
              }).catch(error=>{
              loading2.dismiss();
              this.errorService.handleError(error)
            });
          }
        }]
    });
    alert1.present();
  }
  getServiceObject(){
    this.restful.getServiceObject(JSON.parse(localStorage.getItem("customer")).sessionToken, this.serviceId).then(res=>{
      this.serviceObject = JSON.parse(res.data);
    }).catch(error=>{
      this.errorService.handleError(error);
    })
  }
  externalSettings: MbscCalendarOptions = {
    controls: ['calendar', 'time'],
    showOnTap: false,
    showOnFocus: false
  };

}
