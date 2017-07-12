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
    return this.http.get(`https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood4&key=YOUR_API_KEY`)
  }

  // Messaging API
  sendSMS(phoneNum, text) {
    console.log('sms service called');
    return this.http.get(`/api/sendsms?phone_num=${phoneNum}&text=${text}`).map(res => res.json()).toPromise().then(data => data);
  }

  setTimedSMS(phoneNum, text, timeObj, isActive, id) {
    return this.http.get(`/api/timedsms/?phone_num=${phoneNum}&text=${text}&min=${timeObj.min}&hour=${timeObj.hour}&is_active=${isActive}&_id=${id}`).map(res => res.json()).toPromise().then(data => data);
  }

  cancelMsgs(_id) {
    return this.http.post('/api/cancelsms', {_id: _id}).map(res => res.json());
  }
}
