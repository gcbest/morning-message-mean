import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';

import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;
  sub;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    };

    this.sub = this.authService.authenticateUser(user).subscribe(data => {
      if (data.success) {
        this.authService.storeUserData(data.token, data.user);
        this.flashMessage.show('You are now logged in', {cssClass: 'alert-success', timeout: 5000});
        this.router.navigate(['/dashboard'])
      } else {
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 5000});
        this.router.navigate(['/login'])
      }
    });
  }

  // ngOnDestroy() {
  //   this.sub.detach(); // try this
  //   // this.authService.unsubscribe(); // for me I was detect changes inside "subscribe" so was enough for me to just unsubscribe;
  // }
}
