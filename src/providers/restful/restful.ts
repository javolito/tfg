import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {HTTP} from "@ionic-native/http/ngx";


/*
  Generated class for the RestfulProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestfulProvider {

  private BASE_ENDPOINT = 'https://tfg-javier.appspot.com';

  constructor(public http: HTTP) {

  }

  logIn(loginForm){
    return this.http.post(this.BASE_ENDPOINT+"/LogInServlet", loginForm,
      {
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  }

  logInStaff(loginForm){
    return this.http.post(this.BASE_ENDPOINT+"/LogInStaffServlet", loginForm,
      {
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  }
  getServices(sessionToken){
    return this.http.get(this.BASE_ENDPOINT+"/GetServicesServlet", {},
      {
        'sessionToken': sessionToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  }

  getBarServices(sessionToken){
    return this.http.get(this.BASE_ENDPOINT+"/GetServicesServlet?barService=true", {},
      {
        'sessionToken': sessionToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  }

  getServiceCatalogue(sessionToken, serviceId){
    return this.http.get(this.BASE_ENDPOINT+"/GetServiceCatalogue?serviceId=" + serviceId, {},
      {
        'sessionToken': sessionToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  }
  registerCustomer(sessionToken, registerForm){
    return this.http.post(this.BASE_ENDPOINT+"/RegisterServlet", registerForm,
      {
        'sessionToken': sessionToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  }

  getUserIdWithNFCId(sessionToken, nfcTag){
    return this.http.get(this.BASE_ENDPOINT+"/GetUserIdWithNFCId?nfcTag=" + nfcTag, {},
      {
        'sessionToken': sessionToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  }

  registerTransaction(serviceId, products, waiterId, customerId, sessionToken, totalAmount, stripeId){
    return this.http.post(this.BASE_ENDPOINT+"/RegisterTransactionServlet", {
      "serviceId": serviceId,
      "products": products,
      "waiterId": waiterId,
      "customerId": customerId,
      "totalAmount": totalAmount,
      "stripeCustomerId": stripeId
      },
      {
        'sessionToken': sessionToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  }
  registerServiceSale(serviceId, catalogId, customerId, sessionToken, totalAmount, stripeId, bookHour){
    return this.http.post(this.BASE_ENDPOINT+"/RegisterServiceSale", {
        "serviceId": serviceId,
        "catalogId": catalogId,
        "customerId": customerId,
        "totalAmount": totalAmount,
        "stripeCustomerId": stripeId,
        "bookHour": bookHour
      },
      {
        'sessionToken': sessionToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  }
  createStripeToken(sessionToken, stripeToken, email){
    return this.http.post(this.BASE_ENDPOINT+"/AddBankDetails", {
        "stripeToken": stripeToken,
        "email": email
      },
      {
        'sessionToken': sessionToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  }

  updateOneSignalId(sessionToken, oneSignalId){
    return this.http.post(this.BASE_ENDPOINT+"/UpdateOneSignalIdServlet", {
        "oneSignalId": oneSignalId
      },
      {
        'sessionToken': sessionToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  }

  getChats(sessionToken){
    return this.http.get(this.BASE_ENDPOINT+"/GetActiveChats", {},
      {
        'sessionToken': sessionToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  }

  getLinkAvailability(sessionToken){
    return this.http.get(this.BASE_ENDPOINT+"/GetLinkAvailability", {},
      {
        'sessionToken': sessionToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  }
  linkNFC(sessionToken, customerId, nfcTag){
    return this.http.post(this.BASE_ENDPOINT+"/LinkNFCServlet", {
        "customerId": customerId,
        "nfcTag": nfcTag
      },
      {
        'sessionToken': sessionToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  }
  linkNFCReceptionist(sessionToken, roomNumber, nfcTag){
    return this.http.post(this.BASE_ENDPOINT+"/LinkNFCServlet", {
        "roomNumber": roomNumber,
        "nfcTag": nfcTag
      },
      {
        'sessionToken': sessionToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  }
  getServiceObject(sessionToken, serviceId){
    return this.http.get(this.BASE_ENDPOINT+"/GetServiceObject?serviceId=" + serviceId, {},
      {
        'sessionToken': sessionToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  }
  checkOut(sessionToken, roomNumber){
    return this.http.get(this.BASE_ENDPOINT+"/CheckOutServlet?roomNumber=" + roomNumber, {},
      {
        'sessionToken': sessionToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  }
}
