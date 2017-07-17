import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class APICallService {
  authToken: any;

  constructor(
    private http: Http,
  ) { }

  // Weather API
  getWeather(location) {
    const headers = this.appendHeaders();
    return this.http.get(`/api/weather?location=${location}`, {headers: headers}).map(res => res.json()).toPromise().then(data => data);
  }

  // News API
  getNews(source) {
    const headers = this.appendHeaders();
    return this.http.get(`/api/news?source=${source}`, {headers: headers}).map(res => res.json()).toPromise().then(data => data);
  }

  // Directions API
  getTravel(homeAddress, workAddress) {
    const headers = this.appendHeaders();
    return this.http.get(`/api/travel?origin=${homeAddress}&destination=${workAddress}`, {headers: headers}).map(res => res.json()).toPromise().then(data => data);
  }

  // Quotes API
  getQuote() {
    const headers = this.appendHeaders();
    return this.http.get('/api/quote', {headers: headers}).map(res => res.json()).toPromise().then(data => data);
  }

  // Messaging API
  sendSMS(phoneNum, text) {
    const headers = this.appendHeaders();
    return this.http.get(`/api/sendsms?phone_num=${phoneNum}&text=${text}`, {headers: headers}).map(res => res.json()).toPromise().then(data => data);
  }

  setTimedSMS(phoneNum, text, timeObj, id) {
    const headers = this.appendHeaders();
    return this.http.get(`/api/timedsms/?phone_num=${phoneNum}&text=${text}&min=${timeObj.min}&hour=${timeObj.hour}&_id=${id}`, {headers: headers}).map(res => res.json()).toPromise().then(data => data);
  }

  cancelMsgs(_id) {
    return this.http.post('/api/cancelsms', {_id: _id}).map(res => res.json());
  }

  // helper function to fetch token from localStorage
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  appendHeaders() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return headers;
  }
}
