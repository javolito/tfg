import {Component, ViewChild} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  Slides
} from 'ionic-angular';
import {Product} from "../home-waiter/product";
import {RestfulProvider} from "../../providers/restful/restful";
import {CartServiceProvider} from "../../providers/cart-service/cart-service";

/**
 * Generated class for the BarServicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bar-service',
  templateUrl: 'bar-service.html',
})
export class BarServicePage {

  @ViewChild(Slides) slides: Slides;

  alcoholList: Product[] = [];
  noAlcoholList: Product[] = [];
  list: Product[] = [];
  total: any;
  serviceId: any;
  drinks: string = "alcohol";
  private selectionable: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public restful: RestfulProvider,
              public loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              public cartService: CartServiceProvider) {
    this.total = 0;
    this.serviceId = this.navParams.get('service').id;
    this.cartService.getProducts(this.serviceId);
  }

  clearAll(){
    let alert = this.alertCtrl.create({
      title: 'OJO',
      message: "¿Quieres borrar el pedido?",
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Borrar',
          handler: () => {
            this.cartService.clearAll();
          }
        }
      ],
      enableBackdropDismiss: false
    });
    alert.present();
  }

  addSoda(alcoholDrink: Product, drink: Product) {
    this.cartService.addSoda(alcoholDrink,drink)
    this.selectionable = "";
  }

  addProductPopUp(product: Product){
    if(this.selectionable == product.name){
      this.selectionable = "";
    }else{
      this.selectionable = product.name;
    }
  }

  searchAlcoholic(ev: any, list: Product[]) {
    this.initializeItems("");

    const val = ev.target.value;

    if (val && val.trim() != '') {
      this.cartService.setAlcoholList(this.cartService.alcoholList().filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      }));
    }
  }

  searchNoAlcoholic(ev: any, list: Product[]) {
    this.initializeItems("");

    const val = ev.target.value;

    if (val && val.trim() != '') {
      this.cartService.setNoAlcoholList(this.cartService.noAlcoholList().filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      }))
    }
  }

  private initializeItems(slide) {
    this.cartService.setAlcoholList(this.cartService.alcoholListSearch());
    this.cartService.setNoAlcoholList(this.cartService.noAlcoholListSearch());
    if(slide == "notAlcohol"){
      if(this.slides.getActiveIndex() != 1){
        this.slides.slideTo(1,100);
        this.drinks = "alcohol";
      }
    }else if(slide == "alcohol"){
      if(this.slides.getActiveIndex() != 0){
        this.slides.slideTo(0,100);
        this.drinks = "notAlcohol";
      }
    }
  }

  slideChanged() {
    this.cartService.setAlcoholList(this.cartService.alcoholListSearch());
    this.cartService.setNoAlcoholList(this.cartService.noAlcoholListSearch());
    if(this.drinks == "alcohol" ){
      this.drinks = "notAlcohol";
    }else if((this.drinks == "notAlcohol") && this.slides.getActiveIndex() == 2){
      this.slides.slideTo(1,100);
    }else if(this.slides.getPreviousIndex() == 1 ){
      this.drinks = "alcohol";
    }
  }

  doRefresh(refresher){
    this.cartService.getProducts(this.serviceId);
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

}
