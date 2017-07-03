import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http: Http) { }

  registerUser(user) {
    let headers = new Headers();
    // add a value to headers
    headers.append('Content-Type', 'application/json');
    // return observable
    return this.http.post('http://localhost:4000/users/register', user, {headers: headers})
      .map(res => res.json());
  }

  authenticateUser(user) {
    let headers = new Headers();
    // add a value to headers
    headers.append('Content-Type', 'application/json');
    // return observable
    return this.http.post('http://localhost:4000/users/authenticate', user, {headers: headers})
      .map(res => res.json());
  }

  storeUserData(token, user) {
    // angular-jwt looks for this path 'id_token' automatically
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
