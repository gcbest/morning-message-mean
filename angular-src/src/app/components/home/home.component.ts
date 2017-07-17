import {Component, OnInit} from '@angular/core';
import Typed from 'typed.js';

import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  user;

  // Icons
  iconsPath: String = '../../../assets/images/';
  sunriseIcon: String = this.iconsPath + 'sunrise_icon.png';
  smsIcon: String = this.iconsPath + 'sms_icon.ico';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
        this.user = profile.user
      },
      err => {
        console.log(err);
        return false;
      });
  }

  ngAfterViewInit(){
    var options = {
      strings: ["Weather", "News Headlines", "Travel Time to Work", "Quote of the Day"],
      typeSpeed: 40,
      loop: true
    };

    var typing = new Typed(".typing", options);
  }

}
