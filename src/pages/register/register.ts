import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, Slides} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RestfulProvider} from "../../providers/restful/restful";
import {HandleErrorProvider} from "../../providers/handle-error/handle-error";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  @ViewChild('slides') slides: Slides;
  actualSlide: number;
  passwordCorrect: String;
  registerForm: FormGroup;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private restful: RestfulProvider,
              private errorService: HandleErrorProvider,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private formBuilder: FormBuilder) {
    this.actualSlide = 0;
    this.passwordCorrect = "0";
    this.registerForm = this.createMyForm();
  }

  ionViewDidLoad() {
  }

  private createMyForm(){
    return this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      roomNumber: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      people: ['', Validators.required],
      passwordRetry: this.formBuilder.group({
        password: ['', Validators.required],
        passwordConfirmation: ['', Validators.required],
      })
    });
  }
  setPassword(pass){
    if(pass.length < 1){
      this.passwordCorrect = "0";
    }else{
      this.passwordCorrect = pass;
    }
  }

  next() {
    this.slides.slideNext();
    this.actualSlide = this.slides.getActiveIndex();
  }

  prev() {
    this.slides.slidePrev();
    this.actualSlide = this.slides.getActiveIndex();
  }

  controlSlide(){
    this.actualSlide = this.slides.getActiveIndex();
  }

  registerCustomer(){
    let loading = this.loadingCtrl.create({
      content: 'Creando usuario'
    });
    loading.present();
    this.restful.registerCustomer(JSON.parse(localStorage.getItem("staff")).sessionToken, this.registerForm.value).then(
      (res) => {
        let alert1 = this.alertCtrl.create({
          title: '¡HECHO!',
          subTitle: 'Se ha creado el usuario correctamente',
          buttons: ["Aceptar"],
          enableBackdropDismiss: false
        });
        loading.dismiss();
        alert1.present();
      }

    ).catch(error => {
      loading.dismiss();
      this.errorService.handleError(error);
    });
  }
}
