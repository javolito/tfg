import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HTTP} from "@ionic-native/http/ngx";
import {LoginPage} from "../login/login";
import {HandleErrorProvider} from "../../providers/handle-error/handle-error";
import {RestfulProvider} from "../../providers/restful/restful";
import {ListServicesPage} from "../list-services/list-services";


declare var Stripe;

@IonicPage()
@Component({
  selector: 'page-bank-form',
  templateUrl: 'bank-form.html',
})
export class BankFormPage {

  stripe = Stripe('pk_test_AdBnTbVtuV97ZCcysFVIgVbS00IXoCqyis');
  card: any;
  userId: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: HTTP,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public handlerError: HandleErrorProvider,
              public restful: RestfulProvider) {
    if(JSON.parse(localStorage.getItem("customer")).stripeId != null){
      this.navCtrl.setRoot(ListServicesPage);
    }
  }

  ionViewDidLoad(){
    this.setupStripe();
  }

  setupStripe(){

    let elements = this.stripe.elements();
    var style = {
      base: {
        color: 'white',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: 'white'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    this.card = elements.create('card', { style: style });

    this.card.mount('#card-element');

    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });


    var form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();

      this.stripe.createToken(this.card).then(result => {

        let loading = this.loadingCtrl.create({
          content: 'Creando método de pago'
        });
        loading.present();

        this.restful.createStripeToken(JSON.parse(localStorage.getItem("customer")).sessionToken, result.token.id, JSON.parse(localStorage.getItem("customer")).email )
            .then(res =>{
          loading.dismiss();
          localStorage.setItem("customer", res.data);
          let alert;
          alert = this.alertCtrl.create({
            title: "Correcto",
            subTitle: "Se ha configurado correctamente su método de pago",
            buttons: ["Aceptar"],
            enableBackdropDismiss: false
          });
          alert.present();
          this.navCtrl.setRoot(ListServicesPage);
        }).catch(error =>{
            this.handlerError.handleError(error);
            loading.dismiss();
          }
        );
      });
    });
  }
}

