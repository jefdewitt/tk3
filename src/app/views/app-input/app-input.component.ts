import { CalendarService } from './../../services/calendar.service';
import { GoalTrackService } from '../../services/goal-track.service';
import { Component, OnInit } from '@angular/core';
import { Goal } from '../../goal';
import { TimeObject } from '../../timeObject';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-input',
  templateUrl: './app-input.component.html',
  styleUrls: ['./app-input.component.css']
})

export class AppInputComponent implements OnInit {

  selected: Object = this.goalTrackService.findSelectedTrack();
  minutes: number;
  timeObject: TimeObject;
  routeFromCal: string;
  minutesAlreadyEntered: string;
  increment: string;
  noTracks = false;
  public hoursOrMinutes;
  public toggle = true;

  constructor(
    private goalTrackService: GoalTrackService,
    private calendarService: CalendarService,
    private router: Router
    ) {

    this.router.events.subscribe((event: any) => {
      try {
        if (event.url) {
          if (event.url === '/Input' && this.calendarService.dateFromCal) {
              const routeFromCal = this.calendarService.dateFromCal;
              this.setRouteTrigger(routeFromCal);
              if (this.calendarService.hoursSelected) {
                this.increment = 'hours';
              } else {
                this.increment = 'minutes';
              }
          }
        }
      } catch (error) {
        console.log('Unable to display time overwrite message ' + error.message);
      }
    });
  }

  ngOnInit() {}

  // ngAfterContentInit() {
  //   let track = this.goalTrackService.findSelectedTrack();
  //   if (!track) {
  //     this.noTracks = true;
  //   }
  //   return;
  // }

  setRouteTrigger(routeFromCal) {
    this.minutesAlreadyEntered = this.calendarService.minutesFromCal;
    this.routeFromCal = routeFromCal;
  }
  
  disableRouteTrigger() {
    this.calendarService.dateFromCal = '';
    this.routeFromCal = '';
    this.calendarService.minutesFromCal = '';
    this.minutesAlreadyEntered = '';
  }

  // Just changes the placeholder string in the input field
  hours() {
    if (this.hoursOrMinutes === 'minutes') {
      this.hoursOrMinutes = 'hours';
    } else {
      this.hoursOrMinutes = 'minutes'
    }
  }

  /** 
   * Check to see if user is inputting time in hours.
   * We declares these as lets instead of class properties cuz they aren't 
   * loaded in time for Angular to find them in the DOM otherwise. 
   */

  minutesOrHours() {
    if (this.hoursOrMinutes === 'hours') {
      return this.minutes * 60;
    } else {
      return this.minutes;
    }
  }

  // Have previous times been entered for the date being checked?
  sameDateCheck() {
    for (var i=0; i<this.selected['dates'].length; i++) {
      if (this.selected['dates'][i].recordedDate === this.timeObject.recordedDate) {
        let oldMinutes = this.selected['dates'][i].recordedMinutes;
        let newMinutes = this.timeObject.recordedMinutes;
        this.selected['dates'][i].recordedMinutes = +oldMinutes + +newMinutes;
        return;
      }
    }
    this.selected['dates'].push(this.timeObject);
  }

  /**
   * 
   * @param providedDate 
   * 
   * Sets time object minutes key from input field
   */

  setTimeObject(providedDate) {
    this.timeObject = {
      recordedMinutes : +this.minutes,
      recordedDate : providedDate
    }
  }

  /**
   * Confirms that a valid time was entered & whether any previous
   * times were entered on that date.
   */

  checkForValidMinAndDate() {
    try {
      if (this.timeObject.recordedMinutes > 0) {
        if (this.selected['dates'].length >= 1) {
          // Check for same date entries
          this.sameDateCheck();
        } else {
          this.selected['dates'].push(this.timeObject)
        }
      } else {
        alert('Please provide a time greater than 0.');
        return;
      }
    }
    catch(error) {
      console.log('Minutes & dates validation failed ' + error.message);
    }
  }
  
  // Adds minutes to local storage for submit button clicks
  addMinutes() {
    try {
      // Check if minutes or hours
      this.minutes = this.minutesOrHours();

      if (this.routeFromCal) {
        this.editTimeFromCal(this.routeFromCal);
      } else {
        console.log('this.minutes', this.minutes)
        // Create new time object for the dates array
        this.setTimeObject(this.goalTrackService.createDateObject());
        // Check if min > 0 and if there are prev. date entries in dates array
        this.checkForValidMinAndDate();
      }
    }
    catch(error) {
      console.log('Dates array is unavailable ' + error.message);
    }

    localStorage.setItem(this.selected['name'], JSON.stringify(this.selected));
    this.minutes = null;
    this.routeFromCal = '';
    this.router.navigateByUrl('/Track Output');
  }

  /**
   * 
   * @param routeFromCal 
   * 
   * routeFromCal is the id value of the calendar cell that was clicked
   * 
   * Preloads the time completed (if any) for the date clicked on from 
   * the calendar view & triggers a message to be displayed re: that any
   * new submit button clicks will overwrite any previous time entered 
   * for that date.
   */

  editTimeFromCal(routeFromCal) {
    try {
      alert('Overwrite the ' + this.minutesAlreadyEntered + ' ' + this.increment + ' you already have saved for ' + this.routeFromCal + '?');
      for (let i=0; i<this.selected['dates'].length; i++) {
        var storeDate = this.selected['dates'][i].recordedDate;
        var storeTime = this.selected['dates'][i].recordedMinutes;
        if (routeFromCal === storeDate) {
          this.selected['dates'][i].recordedMinutes = +this.minutes;
          this.disableRouteTrigger();
          return;
        }
      }
      this.setTimeObject(routeFromCal);
      this.checkForValidMinAndDate();
      this.disableRouteTrigger();
    }
    catch(error) {
      console.log('Unable to add time from calendar cell click ' + error.message);
    }
  }

  public openCal() {
    console.log('open calendar.';
  }
}