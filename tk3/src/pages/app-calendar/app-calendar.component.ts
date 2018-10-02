import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';

@Component({
  selector: 'app-app-calendar',
  templateUrl: './app-calendar.component.html', 
  encapsulation: ViewEncapsulation.None
})

export class AppCalendarComponent implements OnInit {

  options : any;
  selector : any;
  routeFromCal : any;
  hoursSelected : boolean;
  month = this.calendarService.monthString;
  alreadyHours : boolean = false;
  public subscription: Subscription;
  public key: string = '';

  constructor(private calendarService : CalendarService ) { }
  
  ngOnInit() {
    this.calendarService.addCalendarToPage();
    this.options = this.calendarService.options;
  }

  onSelected($event) {
    this.calendarService.updateCalendarMonth($event);
    let minuteRadioButton = <HTMLInputElement> document.getElementById("minutes");
    minuteRadioButton.checked = true;
  }

  ngAfterContentInit() {
    /**
     * Listen for clicks that occur on calendar cells and move to the input view
     * with any completed time for that date already loaded to be overwritten.
     */

    const touchEvents$ = Observable.fromEvent(document, 'touchend');
    const clickEvents$ = Observable.fromEvent(document, 'click');
    const allEvents$ = Observable.merge(touchEvents$, clickEvents$);

    this.subscription = allEvents$.subscribe(event => {
      if (event['target']['className'] === 'days') {
        try {
          let multiEl = document.querySelectorAll('.days');
          let spanTime;
          let currentTime;
          if ( event['target']['children'].length > 0 && event['target'].firstElementChild.className != 'today') {
            currentTime = event['target']['firstElementChild'].innerHTML;
            spanTime = currentTime;
          // } else if ( event['target']['children'].length === 1 ) {
          //   currentTime = event['target']['firstElementChild'].innerHTML;
          //   spanTime = currentTime;
          } else {
            spanTime = 0;
          }
          this.calendarService.minutesFromCal = spanTime;
          if (multiEl.length > 0) {
            if (event['target']['id']) {
                this.calendarService.dateFromCal = event['target']['id'];
                // this.router.navigateByUrl('/Input');
            }
          }
        }
        catch(error) {
          console.log('Unable to find calendar cell id ' + error.message);
        }
      }
    })
  }

  changeToHours($event) {
    if (!this.alreadyHours) {
      this.hoursSelected = true;
      this.hoursToMinutes($event);
    }
  }

  changeToMinutes($event) {
    if (this.alreadyHours) {
      this.hoursSelected = false;
      this.hoursToMinutes($event);
    }
  }

  hoursToMinutes($event) {
    let multiSpans : any = document.querySelectorAll('span');
    for (var i=0; i<multiSpans.length; i++) {
      let spanTimeStamp : any = multiSpans[i].className.split('-');
      spanTimeStamp = spanTimeStamp[0];
      let savedTimeInMin = multiSpans[i].innerHTML;
      if (spanTimeStamp === 'timeStamp') {
        if (this.hoursSelected) {
          let singleSpan : number = multiSpans[i].innerHTML / 60;
          multiSpans[i].innerHTML = singleSpan.toFixed(2);
          this.alreadyHours = true;
        } else {
          let singleSpan : number = multiSpans[i].innerHTML * 60;
          multiSpans[i].innerHTML = singleSpan.toFixed(0);
          this.alreadyHours = false;
        }
      }
    }
  }
  
}
