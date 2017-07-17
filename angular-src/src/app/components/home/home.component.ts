import {Component, OnInit, ViewChild} from '@angular/core';
import Typed from 'typed.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  @ViewChild('typed') typed;

  constructor() { }

  ngOnInit() {
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
