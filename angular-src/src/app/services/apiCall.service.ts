import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class APICallService {

  constructor(private http: Http) { }

  // Weather API
  getWeather(location) {
    return this.http.get(`/api/weather?location=${location}`).map(res => res.json()).toPromise().then(data => data);
  }

  // News API
  getNews(source) {
    source = 'cnn';
    return this.http.get(`/api/news?source=${source}`).map(res => res.json()).toPromise().then(data => data);
  }

  // Directions API
  getDirections(homeAddress, workAddress) {

  }

  // Messaging API
  sendSMS(phoneNum, text) {
    console.log('sms service called');
    return this.http.get(`/api/sendsms?phone_num=${phoneNum}&text=${text}`).map(res => res.json()).toPromise().then(data => data);
  }

  setTimedSMS(phoneNum,text) {
    return this.http.get(`/api/timedsms?phone_num=${phoneNum}&text=${text}`).map(res => res.json()).toPromise().then(data => data);

  }
}
