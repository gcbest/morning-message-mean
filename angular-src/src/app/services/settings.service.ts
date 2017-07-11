import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SettingsService {
  user: any;

  constructor(private http: Http) {}

  setTopics(user) {
    let headers = new Headers();
    // add a value to headers
    headers.append('Content-Type', 'application/json');
    return this.http.post('/users/settings', user, {headers: headers}).map(res => res.json());
  }
}
