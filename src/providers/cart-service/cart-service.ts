import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Product} from "../../pages/home-waiter/product";
import {AlertController, App, LoadingController} from "ionic-angular";
import {RestfulProvider} from "../restful/restful";
import {LoginPage} from "../../pages/login/login";
import {HandleErrorProvider} from "../handle-error/handle-error";
import {OneSignal} from "@ionic-native/onesignal/ngx";
import {NFC} from "@ionic-native/nfc/ngx";

@Injectable()
export class CartServiceProvider {

  private _listCart: Product[] = [];
  private _total: number = 0;
  private _productsList: any = [];
  private _list: Product[] = [];
  private _alcoholDrinkWithSoda: any = null;

  private _alcoholList: Product[] = [];
  private _noAlcoholList: Product[] = [];

  private _alcoholListSearch: Product[] = [];
  private _noAlcoholListSearch: Product[] = [];
  private nfcTag: any;
  private myListener: any;
  private clientNotificationId: any;
  private barServiceId: any;

  constructor(public http: HttpClient,
              public restful: RestfulProvider,
              public loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private errorService: HandleErrorProvider,
              public oneSignal: OneSignal,
              /*public app: App,*/
              private nfc: NFC) {
  }

  private addProductLists(product: Product) {
    if (product.type == 0) {
      const indexAlcohol = this._alcoholList.indexOf(product);
      this._alcoholList[indexAlcohol] = product;
    }
    if (product.type == 1) {
      const indexNoAlcohol = this._noAlcoholList.indexOf(product);
      this._noAlcoholList[indexNoAlcohol] = product;
    }
    this.modifyTotal();
  }

  addProduct(product: Product) {

    const index = this._listCart.indexOf(product);

    product.amount++;
    product.total = product.amount * product.price;

    if (index > -1) {
      this._listCart[index] = product;
    } else this._listCart.push(product);

    this.addProductLists(product);
  }

  decreaseProduct(product: Product) {

    product.amount--;
    product.total = product.amount * product.price;

    if (product.amount == 0) {
      const index = this._listCart.indexOf(product);
      this._listCart.splice(index, 1);
    }

    this.addProductLists(product);
  }

  decreaseSoda(alcoholDrink: Product, drink: Product) {
    alcoholDrink.decreaseSoda(drink);
    this.decreaseProduct(alcoholDrink);
    this.decreaseProduct(drink);
  }

  decreaseAlcoholDrink(alcoholDrink: Product) {
    if (alcoholDrink.sodaList.length > 0) {
      this.decreaseProduct(alcoholDrink.sodaList[alcoholDrink.sodaList.length - 1]);
      alcoholDrink.decreaseSoda(alcoholDrink.sodaList[alcoholDrink.sodaList.length - 1]);
    }
    this.decreaseProduct(alcoholDrink);
  }

  isSoda(product: Product) {
    if (product.type == 1) {
      for (let alcoholDrink of this._listCart) {
        if (alcoholDrink.type == 0) {
          let indexSoda = alcoholDrink.sodaList.lastIndexOf(product);
          if (indexSoda > -1) {
            this._alcoholDrinkWithSoda = alcoholDrink;
            return true;
          }
        }
      }
    }
    return false;
  }

  decreaseSodaCart(drink: Product) {
    if (this._alcoholDrinkWithSoda != null) {
      this._alcoholDrinkWithSoda.decreaseSoda(drink);
      this.decreaseProduct(drink);
    }
  }

  modifyTotal() {
    this._total = 0;
    for (let i = 0; i < this._listCart.length; i++) {
      this._total += this._listCart[i].total;
    }
  }

  addSoda(alcoholDrink: Product, drink: Product) {
    alcoholDrink.addSoda(drink);
    this.addProduct(alcoholDrink);
    if (drink == null) {
      return;
    }
    this.addProduct(drink);
  }

  getAmount() {
    let amount = 0;
    for (let product of this._listCart) {
      if (product.price > 0) {
        amount += product.amount;
      }
    }
    return amount;
  }

  clearAll() {
    this._listCart.splice(0);
    this._list.splice(0);
    this.fillList();
    this._total = 0;
  }

  getProducts(serviceId) {
    let loading = this.loadingCtrl.create({
      content: "Cargando productos",
      enableBackdropDismiss: true
    });
    loading.present();
    this.restful.getServiceCatalogue(JSON.parse(localStorage.getItem("staff")).sessionToken, serviceId).then(
      res => {
        loading.dismiss();
        this._productsList = JSON.parse(res.data);
        this.fillList();
      }).catch(error => {
      loading.dismiss();
      this.errorService.handleError(error);
    });
  }

  fillList() {
    this._list = [];
    this._alcoholList = [];
    this._noAlcoholList = [];
    this._productsList.forEach(element => {
      this._list.push(new Product(element.price, 0, 0, 0, element.productName, element.id, element.productImageURL, element.productType, [], []));
      if (element.productType == 0) {
        this._alcoholList.push(new Product(element.price, 0, 0, 0, element.productName, element.id, element.productImageURL, element.productType, [], []));
      } else {
        this._noAlcoholList.push(new Product(element.price, 0, 0, 0, element.productName, element.id, element.productImageURL, element.productType, [], []));
      }
    });
    this._noAlcoholList.push(new Product(0, 0, 0, 0, "Sin refresco", "0", "https://storage.googleapis.com/tfg-javier.appspot.com/nothing.png", 1, [], []));
    this._alcoholListSearch = this._alcoholList;
    this._noAlcoholListSearch = this._noAlcoholList;
  }

  setBarService(barService){
    this.barServiceId = barService;
  }
  registerTransaction() {
    if (this._total == 0) {
      let alert = this.alertCtrl.create({
        title: '¡Error!',
        subTitle: 'Selecciona algún producto',
        buttons: ['OK'],
        enableBackdropDismiss: false
      });
      alert.present();
      return;
    } else {
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
              let loading = this.loadingCtrl.create({
                content: "LEA LA PULSERA",
                enableBackdropDismiss: true
              });
              loading.present();

              var products = "";
              for (let i = 0; i < this._listCart.length; i++) {
                if (this._listCart[i].id != "0") {
                  products += this._listCart[i].id + ":" + this._listCart[i].amount + ";";
                }
              }

              loading.onDidDismiss(data => {
                this.myListener.unsubscribe();
              });

              this.myListener = this.nfc.addNdefListener(() => {
              }, (err) => {
              }).subscribe((event) => {
                loading.dismiss();
                this.nfcTag = event.tag.id;
                alert(this.nfcTag);
                this.myListener.unsubscribe();
                let loading2 = this.loadingCtrl.create({
                  content: "Registrando transacción"
                });
                loading2.present();
                this.restful.getUserIdWithNFCId(JSON.parse(localStorage.getItem("staff")).sessionToken,
                  this.nfcTag).then(res => {

                  this.clientNotificationId = JSON.parse(res.data).oneSignalId;
                  this.restful.registerTransaction(this.barServiceId,
                    products,
                    JSON.parse(localStorage.getItem("staff")).id,
                    JSON.parse(res.data).id,
                    JSON.parse(localStorage.getItem("staff")).sessionToken,
                    this._total,
                    JSON.parse(res.data).stripeId).then(
                    (res) => {
                      loading2.dismiss();
                      let notificationObj:any = {
                        headings: {
                          en: "!!Compra realizada!!",
                        },
                        contents: {
                          en: "Ha hecho una compra por un total de "+this._total+"euros",
                        },
                        app_id: "3ce76e66-7146-48c0-a4c7-3a22d53088ca",
                        include_player_ids: [this.clientNotificationId]
                      };
                      this.oneSignal.postNotification(notificationObj).then((success) => {
                      }).catch((error)=>{

                      });

                      loading.dismiss();
                      this.clearAll();
                      let alert = this.alertCtrl.create({
                        title: '¡Correcto!',
                        subTitle: 'Operación realizada con éxito',
                        buttons: ['OK'],
                        enableBackdropDismiss: false
                      });
                      alert.present();
                    }
                  ).catch(error => {
                    loading.dismiss();
                    this.errorService.handleError(error);
                    this.clearAll();
                  });
                }).catch(
                  error =>{
                    loading2.dismiss();
                    this.errorService.handleError(error);
                  }
                );
              });
            }
          }
        ],
        enableBackdropDismiss: false
      });
      alert1.present();
    }
  }

  listCart(): Product[] {
    return this._listCart;
  }

  total(): number {
    return this._total;
  }

  productsList(): any {
    return this._productsList;
  }

  list(): Product[] {
    return this._list;
  }

  alcoholList(): Product[] {
    return this._alcoholList;
  }

  noAlcoholList(): Product[] {
    return this._noAlcoholList;
  }

  alcoholListSearch(): Product[] {
    return this._alcoholListSearch;
  }

  noAlcoholListSearch(): Product[] {
    return this._noAlcoholListSearch;
  }

  setAlcoholList(products: Product[]) {
    this._alcoholList = products;
  }

  setNoAlcoholList(products: Product[]) {
    this._noAlcoholList = products;
  }
}
