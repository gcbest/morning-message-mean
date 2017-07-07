import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class APICallService {
  apiCallsRemaining;
  returnedData: [String];

  constructor(private http: Http) { }

  // Weather API
  getWeather(location) {
    console.log('this.http.get(`/api/weather?location=${location}`):   ', this.http.get(`/api/weather?location=${location}`).toPromise().then((data) => {return data}));
    return this.http.get(`/api/weather?location=${location}`).map(res => res.json()).toPromise().then((data) => {return data});
  }

  // News API
  getNews(source) {
    source = 'cnn';
    console.log('CNN http.get: ', this.http.get(`/api/news?source=${source}`).toPromise().then((data) => {return data}));
    return this.http.get(`/api/news?source=${source}`).map(res => res.json()).toPromise().then((data) => {return data});
  }

  // Directions API
  getDirections(homeAddress, workAddress) {

  }

  // Messaging API
  sendSMS(phoneNum, text) {
    const MESSAGING_API_URL = `https://rest.nexmo.com/sms/json?api_key=9847decf&api_secret=c541e6fccef188fc&to=${phoneNum}&from=12035338496&text=${text}`
    return this.http.get(MESSAGING_API_URL).map(res => res.json());
  }
}
