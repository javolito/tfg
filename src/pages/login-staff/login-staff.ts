import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RestfulProvider} from "../../providers/restful/restful";
import {HandleErrorProvider} from "../../providers/handle-error/handle-error";
import {HomeWaiterPage} from "../home-waiter/home-waiter";
import {HomeReceptionistPage} from "../home-receptionist/home-receptionist";

/**
 * Generated class for the LoginStaffPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-staff',
  templateUrl: 'login-staff.html',
})
export class LoginStaffPage {

  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              public restful: RestfulProvider,
              public errorService: HandleErrorProvider
  ){
    this.loginForm = this.createMyForm();
  }

  ionViewDidLoad() {

  }

  createMyForm(){
    return this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
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

    this.restful.logInStaff(this.loginForm.value).then(
      res => {
        loading.dismiss();
        localStorage.setItem("staff", res.data);
        let staffResponse = JSON.parse(res.data);
        if(staffResponse.isReceptionist == true){
          this.navCtrl.setRoot(HomeReceptionistPage);
        }else if(staffResponse.isReceptionist == null){
          this.navCtrl.setRoot(HomeWaiterPage);
        }
      }).catch(
      error => {
        loading.dismiss();
        this.errorService.handleError(error);
      }
    );
  }

}
