import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RestfulProvider} from "../../providers/restful/restful";
import {HandleErrorProvider} from "../../providers/handle-error/handle-error";
import {LoginStaffPage} from "../login-staff/login-staff";
import {BankFormPage} from "../bank-form/bank-form";
import {HomeReceptionistPage} from "../home-receptionist/home-receptionist";
import {HomeWaiterPage} from "../home-waiter/home-waiter";
import {MenuServiceProvider} from "../../providers/menu-service/menu-service";
import {ListServicesPage} from "../list-services/list-services";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              public restful: RestfulProvider,
              public errorService: HandleErrorProvider,
              public menuService: MenuServiceProvider
              ){
    this.loginForm = this.createMyForm();
  }

  ionViewDidLoad() {
    this.checkSessionStatus();
  }

  createMyForm(){
    return this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  checkSessionStatus(){
    if(localStorage.getItem("customer") != null){
      if(JSON.parse(localStorage.getItem("customer")).stripeId != null){
        this.navCtrl.setRoot(ListServicesPage);
      }else{
        this.navCtrl.push(BankFormPage);
      }
    }else if(localStorage.getItem("staff") != null){
      let staffObject = JSON.parse(localStorage.getItem("staff"));
      if(staffObject.isReceptionist == true){
        this.navCtrl.push(HomeReceptionistPage);
      }else{
        this.navCtrl.push(HomeWaiterPage);
      }
    }
  }
  changeShowPassword(){
    if(this.showPassword){
      this.showPassword = false;
    }else{
      this.showPassword = true;
    }
  }
  login(){
      let loading = this.loadingCtrl.create({
        content: 'Comprobando credenciales...'
      });

      loading.present();

      this.restful.logIn(this.loginForm.value).then(
      res => {
        loading.dismiss();
        localStorage.setItem("customer", res.data);
        this.menuService.setMenuDisplay();
        this.navCtrl.push(BankFormPage);
      }).catch(
        error => {
          loading.dismiss();
          this.errorService.handleError(error);
        }
      );
  }

  goToLogInStaff(){
    this.navCtrl.push(LoginStaffPage);
  }
}
