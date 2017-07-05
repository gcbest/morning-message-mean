import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

import axios from 'axios'; // ****** <----- remove

@Injectable()
export class APICallService {

  constructor(private http: Http) { }

  callWeatherAPI(location) {
    const OPEN_WEATHER_MAP_URL = 'http://api.openweathermap.org/data/2.5/weather?appid=7486057fd080d966249b2b5959530883&units=imperial';

    var encodedLocation = encodeURIComponent(location);
    var requestURL = `${OPEN_WEATHER_MAP_URL}&q=${encodedLocation}`;

    return this.http.get(requestURL).map(res => res.json());

      //   if (res.data.cod && res.data.message) {
    //     throw new Error(res.data.message);
    //   } else {
    //     return res.data.main.temp;
    //   }
    // }, function (err) {
    //   throw new Error(err.response.data.message);
    // });
  }
}
