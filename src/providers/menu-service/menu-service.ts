import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {HomeWaiterPage} from "../../pages/home-waiter/home-waiter";
import {RegisterPage} from "../../pages/register/register";
import {HomeReceptionistPage} from "../../pages/home-receptionist/home-receptionist";
import {ReceptionistChatPage} from "../../pages/receptionist-chat/receptionist-chat";
import {ListServicesPage} from "../../pages/list-services/list-services";
import {LoginPage} from "../../pages/login/login";

/*
  Generated class for the MenuServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MenuServiceProvider {
  pages: Array<{title: string, component: any, icon: string}>;
  userObject: string = "";

  constructor(public http: HttpClient) {
    console.log('Hello MenuServiceProvider Provider');
  }
  getPages(){
    if(localStorage.getItem("customer") != null){
      this.pages = [
        { title: 'Home', component: ListServicesPage, icon: "ios-home" },
        { title: 'Chat', component: ReceptionistChatPage, icon: "ios-chatbubbles" }
      ];
    }else if(localStorage.getItem("staff") != null){
      let staffObject = JSON.parse(localStorage.getItem("staff"));
      if(staffObject.isReceptionist == true){
        this.pages = [
          { title: 'Home', component: HomeReceptionistPage, icon: "ios-home" },
          { title: 'Añadir Huésped', component: RegisterPage, icon: "md-person-add" }
        ];
      }else{
        this.pages = [
          { title: 'Home', component: HomeWaiterPage, icon: "ios-home"  }
        ];
      }
    }else{
      return null;
    }
    return this.pages;
  }


  setMenuDisplay(){
    if(localStorage.getItem("customer") != null){
      this.userObject = "customer";
    }else if(localStorage.getItem("staff") != null){
      let staffObject = JSON.parse(localStorage.getItem("staff"));
      if(staffObject.isReceptionist == true){
        this.userObject = "receptionist";
      }else{
        this.userObject = "waiter";
      }
    }
    return this.userObject;
  }
  resetUserMenu(){
    this.userObject = "";
    this.pages = null;
    localStorage.clear();
  }

}
