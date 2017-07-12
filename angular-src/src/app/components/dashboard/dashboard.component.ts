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
  client: Object;

  hasWeather: Boolean = false;
  hasNews: Boolean = false;
  hasPositivity: Boolean;
  hasTravel: Boolean = false;
  isActive: Boolean = false;

  newsSource = 'CNN';
  zipCode: String;
  msgTime: String;
  // User's mongodb id
  _id: String = localStorage.user.split('"')[3];

  constructor(
    private apiCallService: APICallService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.settingsService.getSettings(this._id).subscribe(data => {
      this.client = data;
      console.log('data', data);
      if (data.user.settings) {
        this.hasWeather = data.user.settings.hasWeather;
        this.hasNews = data.user.settings.hasNews;
        this.hasTravel =data.user.settings.hasTravel;
      }
    });
  }

  onNewsChange(source) {
    this.newsSource = source;
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
      hasNews: this.hasNews,
      hasTravel: this.hasTravel
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
                this.apiCallService.getWeather(this.zipCode).then(data => {
                  console.log('temp', data);
                  var temperature = data.main.temp;
                  var forecast = data.weather[0].main + ', ' + data.weather[0].description;
                  resolve("Today's Temperature: " + temperature + ' Degrees F \n' + forecast);
                });
              });
              promiseArr.push(weatherPromise);
            }
            break;
          case 'hasNews':
            if (userSelections[property] === true) {
              var newsPromise = new Promise((resolve, reject) => {
                // Object to map news source names to their API valid keys
                var newsObj = {
                  "The New York Times": "the-new-york-times",
                  "CNN": "cnn",
                  "Google News": "google-news"
                };

                var sourceAPI = newsObj[this.newsSource];
                console.log('sourceAPI', sourceAPI);

                this.apiCallService.getNews(sourceAPI).then(articlesArr => {
                  var headline = "";
                  for(var i = 0; i < 3; i++) {
                    headline += articlesArr[i].title + '\n' + articlesArr[i].url + '\n';
                  }
                  console.log('headline before enocoding', headline);
                  headline = encodeURIComponent(headline);
                  console.log('headline AFTER encoding', headline);
                  resolve(headline);
                });
              });
              promiseArr.push(newsPromise);
            }
            break;
          case 'hasTravel':
            if (userSelections[property] === true) {
              var travelPromise = new Promise((resolve, reject) => {
                this.apiCallService.getTravel('71 Quitman St Newark, NJ', '1225 Raymond Blvd Newark, NJ').then(travel_time => {
                  console.log('TRAVEL_TIME before encoding', travel_time);
                  travel_time = encodeURIComponent(travel_time);
                  console.log('travel_time AFTER encoding', travel_time);
                  resolve(travel_time);
                });
              });
              promiseArr.push(travelPromise);
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

    // Stop cron job
    this.apiCallService.cancelMsgs(this._id).subscribe(data => {
      if (data) {
        console.log('after message canceled', data);
      }
    });

    // Update isActive status on user object in database
    // this.settingsService.setTopics(this.client).subscribe(data => {
    //   if (data) {
    //     console.log('after isActive updated to false', data);
    //     this.client = data;
    //   }
    // });
  }



  onMsgSubmit() {
    // Grab the user's input
    var hour = parseInt(this.msgTime.slice(0, 2));
    var minute = parseInt(this.msgTime.slice(3, 5));
    var ampm = this.msgTime.slice(6, 8).toLowerCase();

    // Convert it a time cron can use
    if(ampm == "pm" && hour<12) hour = hour+12;
    if(ampm == "am" && hour==12) hour = hour-12;

    var timeObj = {
      hour: hour,
      min: minute
    };

    var promiseArr = this.setUserSelections();
    Promise.all(promiseArr).then((results) => {
      var formattedURL =  encodeURIComponent(results.join('\n \n'));

      this.apiCallService.setTimedSMS('19734946092', formattedURL, timeObj, this._id);
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


