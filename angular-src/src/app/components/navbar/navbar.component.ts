import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';

import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isIn = false;   // store state

  constructor(
    public authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
  }

  toggleMenu() {
    let bool = this.isIn;
    this.isIn = bool === false;
  }
  onLogoutClick() {
    this.authService.logout();
    this.flashMessage.show('You are logged out', {cssClass: 'alert-success', timeout: 3000});
    this.router.navigate(['/login']);
    return false;
  }

}
