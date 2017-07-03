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
}
