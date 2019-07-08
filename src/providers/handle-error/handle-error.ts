import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AlertController, App} from "ionic-angular";
import {LoginPage} from "../../pages/login/login";


@Injectable()
export class HandleErrorProvider {

  constructor(public http: HttpClient,
              public alertCtrl: AlertController,
              public app: App) {
    console.log('Hello HandleErrorProvider Provider');
  }

  handleError(error){
    switch (error.status) {
      case 0:
        this.showAlert('Error','Fallo de conexión', ['Aceptar']);
        return
      case 402:
        this.showAlert('Sin servicios','No se ha encontrado catálogo del servicio', ['Aceptar']);
        return
      case 403:
        this.showAlert('Error','No se ha identificado un usuario vinculado a esta pulsera', ['Aceptar']);
        return
      case 401:
        this.showAlert('Error','Email o contraseña incorrectos', ['Aceptar']);
        return
      case 420:
        this.showAlert('Sesión caducada','Debe iniciar sesión de nuevo', ['Aceptar']);
        localStorage.clear();
        this.app.getActiveNav().setRoot(LoginPage);
        return
      case 425:
        this.showAlert('Error','No dispone de reserva activa', ['Aceptar']);
        return
      case 426:
        this.showAlert('Error','Pulsera ya vinculada a este usuario', ['Aceptar']);
        return
      case 427:
        this.showAlert('Error','Pulsera ya vinculada a otro usuario', ['Aceptar']);
        return
      case 430:
        this.showAlert('Error','Esta reserva no está activa', ['Aceptar']);
        return
      case 431:
        this.showAlert('Error','El cupo para el día de hoy ya está completo', ['Aceptar']);
        return
      case 499:
        this.showAlert('Error','Fallo de servidor', ['Aceptar']);
        return
      default:
        return;
    }
  }

  private showAlert(error1: string, message: string, buttons: string[]) {
    let alertError;
    alertError = this.alertCtrl.create({
      title: error1,
      subTitle: message,
      buttons: buttons,
      enableBackdropDismiss: false
    });
    alertError.present();
  }
}

