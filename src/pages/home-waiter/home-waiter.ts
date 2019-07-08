import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {RestfulProvider} from "../../providers/restful/restful";
import {HandleErrorProvider} from "../../providers/handle-error/handle-error";
import {ServicePage} from "../service/service";
import {BarServicePage} from "../bar-service/bar-service";
import {CartServiceProvider} from "../../providers/cart-service/cart-service";

/**
 * Generated class for the HomeWaiterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-waiter',
  templateUrl: 'home-waiter.html',
})
export class HomeWaiterPage {

  servicesList: any = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private restful: RestfulProvider,
              private loadingCtrl: LoadingController,
              private errorService: HandleErrorProvider,
              private cartService: CartServiceProvider
  ) {
    this.getServices();
  }

  getServices(){
    let loading = this.loadingCtrl.create({
      content: 'Cargando servicios...'
    });

    loading.present();
    this.restful.getBarServices(JSON.parse(localStorage.getItem("staff")).sessionToken).then(
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
    this.navCtrl.push(BarServicePage, {service: service});
    this.cartService.setBarService(service.id);
  }

}
