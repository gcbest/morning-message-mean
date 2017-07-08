import { Component, OnInit } from '@angular/core';

import {APICallService} from '../../services/apiCall.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  hasWeather: Boolean = false;
  hasNews: Boolean = false;
  hasPositivity: Boolean;

  constructor(private apiCallService: APICallService) { }

  ngOnInit() {
  }

  onMsgChoiceSubmit() {
    // create an object with all the choices

    // iterate over the choices, if they are true make api call

    var userSelections = {
      hasWeather: this.hasWeather,
      hasNews: this.hasNews
    };

    var promiseArr = [];

    // add promises to promise array
    // promise.all()
    // .then() call send text message service and pass in data

    for (var property in userSelections) {
      console.log('property:  ', property, userSelections[property] === true);
      console.log(userSelections);
      if (userSelections.hasOwnProperty(property)) {
        switch(property) {
          case 'hasWeather':
            if (userSelections[property] === true) {
              var weatherPromise = new Promise((resolve, reject) => {
                this.apiCallService.getWeather('07103').then(temp => {
                  resolve("Today's Temperature: " + temp + ' Degrees F');
                });
              });
              promiseArr.push(weatherPromise);
            }
            break;
          case 'hasNews':
            if (userSelections[property] === true) {
              var newsPromise = new Promise((resolve, reject) => {
                this.apiCallService.getNews('cnn').then(articlesArr => {
                  var headline = articlesArr[0].title + '\n' + articlesArr[0].url;
                  resolve(headline);
                });
              });
              promiseArr.push(newsPromise);
            }
            break;
        }
      }
    }

    console.log('PROMISE ARR', promiseArr);
    Promise.all(promiseArr).then((results) => {
      console.log('results ', results);
      this.apiCallService.sendSMS('19734946092', results.join(', '));
    }).catch( err => {
      console.log(err);
    });


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


