import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';

import {APICallService} from '../../services/apiCall.service';
import {SettingsService} from '../../services/settings.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  hasWeather: Boolean = false;
  hasNews: Boolean = false;
  hasPositivity: Boolean;
  msgTime: String;
  isActive: String;
  client: Object;
  _id: String = localStorage.user.split('"')[3];

  constructor(
    private apiCallService: APICallService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
  }


  setUserSelections() {
    // User selections
    var user = {
      _id: this._id,
      selections: {},
      isActive: this.isActive
    };

    // Create an object with all the selected choices for this user
    var userSelections = {
      hasWeather: this.hasWeather,
      hasNews: this.hasNews
    };

    // Add promises to promise array
    var promiseArr = [];

    // Iterate over the user's choices, if they are true make api call
    for (var property in userSelections) {
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
                  var headline = "";
                  for(var i = 0; i < 3; i++) {
                    headline += articlesArr[i].title + '\n' + articlesArr[i].url + '\n';
                  }
                  console.log('headline before enocoding', headline);
                  headline = encodeURIComponent(headline);
                  console.log('headline AFTER enocoding', headline);
                  resolve(headline);
                });
              });
              promiseArr.push(newsPromise);
            }
            break;
        }
      }
    }

    user.selections = userSelections;
    this.settingsService.setTopics(user).subscribe(data => {
      if (data) {
        console.log(data);
        this.client = data;
      }
    });
    return promiseArr;
  }

  // Resolve all the promises for the user's selections and send SMS
  sendTextMessage(promiseArr) {
    console.log('PROMISE ARR', promiseArr);
    Promise.all(promiseArr).then((results) => {
      console.log('results ', results);
      var formattedURL =  encodeURIComponent(results.join('\n \n'));
      this.apiCallService.sendSMS('19734946092', formattedURL);
    }).catch( err => {
      console.log(err);
    });
  }


  // Set the time when the message will be sent
  setMsgTime() {


  }

  // Stop sending daily text messages to user
  stopMsgs() {
    console.log('before this.isActive');

    this.isActive = 'false';
    // Stop cron job
    console.log('before setTimedSMS');
    // this.apiCallService.setTimedSMS("", "", "", this.isActive, this._id)
    //   .catch( err => {
    //   console.log(err);
    // });
    this.apiCallService.cancelMsgs(this._id).subscribe(data => {
      if (data) {
        console.log('after message canceled', data);
      }
    });

    console.log('before SetTopics');
    // Update isActive status on user object in database
    this.settingsService.setTopics(this.client).subscribe(data => {
      if (data) {
        console.log('after isActive updated to false', data);
        this.client = data;
      }
    });
  }



  onMsgSubmit() {
    // Set isActive to true
    this.isActive = 'true';
    var isActive = this.isActive;

    // Grab the user's input
    var hour = parseInt(this.msgTime.slice(0, 2));
    var minunte = parseInt(this.msgTime.slice(3, 5));
    var ampm = this.msgTime.slice(6, 8).toLowerCase();

    // Convert it a time cron can use
    if(ampm == "pm" && hour<12) hour = hour+12;
    if(ampm == "am" && hour==12) hour = hour-12;
    var strHours = hour.toString();
    var strMinutes = minunte.toString();
    if(hour<10) strHours = "0" + strHours;
    if(minunte<10) strMinutes = "0" + strMinutes;

    // Set cron to send message at specific time daily
    var cronFormattedStr = '00 ' + strMinutes + ' ' + strHours;
    console.log(cronFormattedStr);

    var promiseArr = this.setUserSelections();
    Promise.all(promiseArr).then((results) => {
      var formattedURL =  encodeURIComponent(results.join('\n \n'));

      this.apiCallService.setTimedSMS('19734946092', formattedURL, cronFormattedStr, isActive, this._id);
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

  onMsgSelectionSubmit() {
    // Set the time when the message will be sent

  }

}


