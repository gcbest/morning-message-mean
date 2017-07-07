import { Component, OnInit } from '@angular/core';

import {APICallService} from '../../services/apiCall.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  hasWeather: Boolean;
  hasNews: Boolean;
  hasPositivity: Boolean;

  constructor(private apiCallService: APICallService) { }

  ngOnInit() {
  }

  onMsgChoiceSubmit() {
    // create an object with all the choices

    // iterate over the choices, if they are true make api call

    var userSelections = {
      hasWeather: this.hasWeather,
      hasPositivity: this.hasPositivity,
      hasNews: this.hasNews
    };

    for (var property in userSelections) {
      if (userSelections.hasOwnProperty(property)) {
        switch(property) {
          case 'hasWeather':
            if (userSelections[property] === true) {
              this.apiCallService.getWeather('07103').subscribe((weather) => {
                console.log(weather);
              });
            }
          case 'hasNews':
            if (userSelections[property] === true) {
              this.apiCallService.getNews('cnn').subscribe((news) => {
                console.log(news);
              });
            }
        }
      }


    }

    // // Twilio Credentials
    // const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    // const authToken = 'your_auth_token';
    //
    // // require the Twilio module and create a REST client
    // const client = require('twilio')(accountSid, authToken);
    //
    // client.messages
    //   .create({
    //     to: '+19734946092',
    //     from: '+12015711416',
    //     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
    //     mediaUrl: 'https://c1.staticflickr.com/3/2899/14341091933_1e92e62d12_b.jpg',
    //   })
    //   .then((message) => console.log(message.sid));




  }

}


