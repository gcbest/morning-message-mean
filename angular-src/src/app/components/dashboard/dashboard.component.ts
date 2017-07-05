import { Component, OnInit } from '@angular/core';

import {APICallService} from '../../services/apiCall.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  hasWeather: Boolean;
  hasPositivity: Boolean;

  constructor(private apiCallService: APICallService) { }

  ngOnInit() {
  }

  onMsgChoiceSubmit() {
    // create an object with all the choices

    // iterate over the choices, if they are true make api call

    var userSelections = {
      hasWeather: this.hasWeather,
      hasPositivity: this.hasPositivity
    };

    for (var property in userSelections) {
      if (userSelections.hasOwnProperty(property)) {
        switch(property) {
          case 'hasWeather':
            if (userSelections[property] === true) {
              this.apiCallService.callWeatherAPI('07103').subscribe((weather) => {
                console.log(weather);
              });
            }
        }
      }
    }
  }

}
