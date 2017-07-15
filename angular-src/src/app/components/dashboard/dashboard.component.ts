import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import {FlashMessagesService} from 'angular2-flash-messages';

import {APICallService} from '../../services/apiCall.service';
import {SettingsService} from '../../services/settings.service';
import {ValidateService} from '../../services/validate.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // User Boolean Inputs
  hasWeather: Boolean = false;
  hasNews: Boolean = false;
  hasQuote: Boolean = false;
  hasTravel: Boolean = false;
  isActive: Boolean = false;

  // User String Inputs
  newsSource = "";
  homeAddress: String;
  workAddress: String;
  zipCode: String;
  msgTime: String;

  // String to store the quote of the day
  quoteOfTheDay: String;

  // User's mongodb id
  _id: String = localStorage.user.split('"')[3];
  // User object
  client;

  iconsPath: String = '../../../assets/images/';
  weatherIcon: String = this.iconsPath + 'weather_icon.png';
  quoteIcon: String = this.iconsPath + 'quote_icon.jpg';
  newsIcon: String = this.iconsPath + 'news_icon.jpg';
  travelIcon:  String = this.iconsPath + 'travel_icon.svg';

  constructor(
    private apiCallService: APICallService,
    private settingsService: SettingsService,
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
    this.settingsService.getSettings(this._id).subscribe(data => {
      this.client = data.user;
      console.log('data', data);
      if (data.user.settings) {
        this.hasWeather = data.user.settings.hasWeather;
        this.hasNews = data.user.settings.hasNews;
        this.hasTravel = data.user.settings.hasTravel;
        this.hasQuote = data.user.settings.hasQuote;
        this.newsSource = data.user.settings.newsSource;
        this.zipCode = data.user.settings.zipCode;
        this.homeAddress = data.user.settings.homeAddress;
        this.workAddress = data.user.settings.workAddress;
        this.msgTime = data.user.settings.msgTime;
      }
    });
  }

  onNewsChange(source) {
    this.newsSource = source;
  }

  toggleWeather() {
    return this.hasWeather = !this.hasWeather;
  }

  toggleQuote() {
    return this.hasQuote = !this.hasQuote;
  }

  toggleNews() {
    return this.hasNews = !this.hasNews;
  }

  toggleTravel() {
    return this.hasTravel = !this.hasTravel;
  }

  // Only display the form if the user has selected at least one option
  displayForm() {
    if (this.hasNews || this.hasQuote || this.hasTravel || this.hasWeather) {
      return true;
    } else {
      return false;
    }
  }

  setUserSelections() {
    // if(!this.validateInputs()) return;

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
      hasTravel: this.hasTravel,
      hasQuote: this.hasQuote,
      newsSource: this.newsSource,
      zipCode: this.zipCode,
      homeAddress: this.homeAddress,
      workAddress: this.workAddress,
      msgTime: this.msgTime
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
          case 'hasTravel':
            if (userSelections[property] === true) {
              var travelPromise = new Promise((resolve, reject) => {
                this.apiCallService.getTravel(this.homeAddress, this.workAddress).then(travel_time => {
                  console.log('TRAVEL_TIME before encoding', travel_time);
                  var travel_str = 'Estimated travel time to work: ' + travel_time;
                  travel_str = encodeURIComponent(travel_str).replace(/'/g, "%27");
                  console.log('travel_str AFTER encoding', travel_str);
                  resolve(travel_str);
                });
              });
              promiseArr.push(travelPromise);
            }
            break;
          case 'hasQuote':
            if (userSelections[property] === true) {
              var quotePromise = new Promise((resolve, reject) => {
                this.apiCallService.getQuote().then(quoteInfo => {
                  console.log('Quote before encoding', quoteInfo);
                  var formattedQuote = quoteInfo.quote + '\n -' + quoteInfo.author;
                  console.log('formattedQuote', formattedQuote);

                  formattedQuote = encodeURIComponent(formattedQuote);
                  this.quoteOfTheDay = formattedQuote;
                  if (quoteInfo.quote.length < 1) {
                    resolve(this.quoteOfTheDay);
                  }
                  resolve(formattedQuote);
                });
              });
              promiseArr.push(quotePromise);
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
                  // Convert left and right apostrophe's to regular apostrophes so they can be escaped
                  var escapedHeadline = headline.replace(/\u2019/g, "'").replace(/\u2018/g, "'");

                  console.log('headline before enocoding', escapedHeadline);
                  headline = encodeURIComponent(escapedHeadline);
                  console.log('headline AFTER encoding', headline);
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
        console.log('settingsService updated user', data);
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
  }

  validateInputs() {
    // Validate weather input
    if (this.hasWeather) {
      if(!this.validateService.validateAlphaNumeric(this.zipCode)) {
        this.flashMessage.show('Please use valid address/zip code for the weather input', {cssClass: 'alert-danger', timeout: 3000});
        return false;
      }
    }
    // Validate news input
    if (this.hasTravel) {
      if(!this.validateService.validateAlphaNumeric(this.homeAddress) && !this.validateService.validateAlphaNumeric(this.workAddress)) {
        this.flashMessage.show('Please use valid addresses for the travel time inputs', {cssClass: 'alert-danger', timeout: 3000});
        return false;
      }
    }
    // Validate travel time input
    if (this.hasNews) {
      if(!this.validateService.validateAlphaNumeric(this.newsSource)) {
        this.flashMessage.show('Please select a news source', {cssClass: 'alert-danger', timeout: 3000});
        return false;
      }
    }
    // Validate user's time input
    if (this.validateService.validateTime(this.msgTime)) {
      this.flashMessage.show('Message settings saved', {cssClass: 'alert-success', timeout: 3000});
      return true;
    } else {
      this.flashMessage.show('Please use valid time format', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

  }

  sendMessage() {
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
      const formattedURL =  encodeURIComponent(results.join('\n \n'));
      const phone = this.client.phone;

      console.log('this.client.phone', this.client.phone);
      this.apiCallService.setTimedSMS(this.client.phone, formattedURL, timeObj, this._id);
    }).catch( err => {
      console.log(err);
    });
  }

  // sendMessage2(promArr) {
  //   Promise.all(promiseArr).then((results) => {
  //     const formattedURL =  encodeURIComponent(results.join('\n \n'));
  //     const phone = this.client.phone;
  //
  //     console.log('this.client.phone', this.client.phone);
  //     this.apiCallService.setTimedSMS(this.client.phone, formattedURL, timeObj, this._id);
  //   }).catch( err => {
  //     console.log(err);
  //   });
  // }


  onMsgSubmit() {

    if (this.validateInputs()) {
      this.sendMessage();
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


