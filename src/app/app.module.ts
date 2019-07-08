import { MbscModule } from '@mobiscroll/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import {LoginPage} from "../pages/login/login";
import { RestfulProvider } from '../providers/restful/restful';
import { HandleErrorProvider } from '../providers/handle-error/handle-error';
import {HttpClientModule} from "@angular/common/http";
import {HTTP} from "@ionic-native/http/ngx";
import {ListServicesPage} from "../pages/list-services/list-services";
import {ServicePage} from "../pages/service/service";
import {RegisterPage} from "../pages/register/register";
import {LoginStaffPage} from "../pages/login-staff/login-staff";
import {HomeWaiterPage} from "../pages/home-waiter/home-waiter";
import { CartServiceProvider } from '../providers/cart-service/cart-service';
import {BarServicePage} from "../pages/bar-service/bar-service";
import {OneSignal} from "@ionic-native/onesignal/ngx";
import {NFC} from "@ionic-native/nfc/ngx";
import {BankFormPage} from "../pages/bank-form/bank-form";
import {HomeReceptionistPage} from "../pages/home-receptionist/home-receptionist";
import {ChatSessionPage} from "../pages/chat-session/chat-session";
import {ReceptionistChatPage} from "../pages/receptionist-chat/receptionist-chat";
import { MenuServiceProvider } from '../providers/menu-service/menu-service';
import {BarcodeScanner} from "@ionic-native/barcode-scanner/ngx";


@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    LoginPage,
    ListServicesPage,
    ServicePage,
    RegisterPage,
    LoginStaffPage,
    HomeWaiterPage,
    BarServicePage,
    BankFormPage,
    HomeReceptionistPage,
    ChatSessionPage,
    ReceptionistChatPage
  ],
  imports: [
    MbscModule,
    FormsModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    LoginPage,
    ListServicesPage,
    ServicePage,
    RegisterPage,
    LoginStaffPage,
    HomeWaiterPage,
    BarServicePage,
    BankFormPage,
    HomeReceptionistPage,
    ChatSessionPage,
    ReceptionistChatPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestfulProvider,
    HandleErrorProvider,
    HTTP,
    CartServiceProvider,
    OneSignal,
    NFC,
    MenuServiceProvider,
    BarcodeScanner,
  ]
})
export class AppModule {}
