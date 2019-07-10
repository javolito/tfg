import { Component, ViewChild } from '@angular/core';

import {Platform, MenuController, Nav, App} from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import {LoginPage} from "../pages/login/login";
import {CartServiceProvider} from "../providers/cart-service/cart-service";

import * as firebase from 'firebase';
import {MenuServiceProvider} from "../providers/menu-service/menu-service";
import {ServicePage} from "../pages/service/service";


var firebaseConfig = {
  apiKey: "",
  authDomain: "tfg-javier.firebaseapp.com",
  databaseURL: "https://tfg-javier.firebaseio.com",
  projectId: "tfg-javier",
  storageBucket: "tfg-javier.appspot.com",
  messagingSenderId: "711089774396",
  appId: "1:711089774396:web:b47a21cac5ba100d"
};


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage = LoginPage;
  pages: Array<{title: string, component: any, icon: string}>;
  serviceIdAux: String;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public cartService: CartServiceProvider,
    public menuService: MenuServiceProvider,
    public app: App
  ) {
    this.initializeApp();
    firebase.initializeApp(firebaseConfig);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if(localStorage.getItem('serviceIdlocal') != null){
        this.serviceIdAux = JSON.parse(localStorage.getItem('serviceIdlocal')).id;
      }
    });
  }

  openPage(page) {
    this.menu.close();
    this.nav.push(page.component);
  }
  logOut(){
    this.menu.close();
    this.menuService.resetUserMenu();
    this.nav.setRoot(LoginPage);
  }
}
