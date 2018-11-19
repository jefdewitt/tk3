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

  minutes: number;
  timeObject: TimeObject;
  routeFromCal: string;
  minutesAlreadyEntered: string;
  increment: string;
  noTracks = false;
  public hoursOrMinutes;
  public toggle = true;
  public hours = false;
  public track = this.goalTrackService.track;

  constructor(
    private goalTrackService: GoalTrackService,
    private router: Router
    ) {}

  ngOnInit() { }

  disableRouteTrigger() {
    this.minutesAlreadyEntered = '';
  }

  /**
   * Check to see if user is inputting time in hours.
   * We declares these as lets instead of class properties cuz they aren't
   * loaded in time for Angular to find them in the DOM otherwise.
   */
  public minutesOrHours() {
    if (this.hours === true) {
      return this.minutes * 60;
    } else {
      return this.minutes;
    }
  }

  // Have previous times been entered for the date being checked?
  sameDateCheck() {
    for (let i = 0; i < this.track['dates'].length; i++) {
      if (this.track['dates'][i].recordedDate === this.timeObject.recordedDate) {
        const oldMinutes = this.track['dates'][i].recordedMinutes;
        const newMinutes = this.timeObject.recordedMinutes;
        this.track['dates'][i].recordedMinutes = +oldMinutes + +newMinutes;
        return;
      }
    }
    this.track['dates'].push(this.timeObject);
  }

  /**
   *
   * @param providedDate
   *
   * Sets time object minutes key from input field
   */

  public setTimeObject(providedDate) {
    this.timeObject = {
      recordedMinutes : +this.minutes,
      recordedDate : providedDate
    };
  }

  /**
   * Confirms that a valid time was entered & whether any previous
   * times were entered on that date.
   */
  checkForValidMinAndDate() {
    try {
      if (this.timeObject.recordedMinutes > 0) {
        if (this.track['dates'].length >= 1) {
          // Check for same date entries
          this.sameDateCheck();
        } else {
          this.track['dates'].push(this.timeObject);
        }
        return true;
      } else {
        alert('Please provide a time greater than 0.');
        return false;
      }
    } catch (error) {
      console.log('Minutes & dates validation failed ' + error.message);
    }
  }

  // Adds minutes to local storage for submit button clicks
  addMinutes() {
    try {
      // Check if minutes or hours
      this.minutes = this.minutesOrHours();
      // Create new time object for the dates array
      this.setTimeObject(this.goalTrackService.createDateObject());
      // Check if min > 0 and if there are prev. date entries in dates array
      const timeCheck = this.checkForValidMinAndDate();

      if (timeCheck) {
        localStorage.setItem(this.track['name'], JSON.stringify(this.track));
        this.minutes = null;
        this.router.navigateByUrl('/Track Output');
      }

    } catch (error) {
      console.log('Dates array is unavailable ' + error.message);
    }
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
      alert('Overwrite the ' + this.minutesAlreadyEntered
       + ' ' + this.increment + ' you already have saved for ' + this.routeFromCal + '?');
      for (let i = 0; i < this.track['dates'].length; i++) {
        const storeDate = this.track['dates'][i].recordedDate;
        const storeTime = this.track['dates'][i].recordedMinutes;
        if (routeFromCal === storeDate) {
          this.track['dates'][i].recordedMinutes = +this.minutes;
          this.disableRouteTrigger();
          return;
        }
      }
      this.setTimeObject(routeFromCal);
      this.checkForValidMinAndDate();
      this.disableRouteTrigger();
    } catch (error) {
      console.log('Unable to add time from calendar cell click ' + error.message);
    }
  }

  public openCal() {
    console.log('open calendar.');
  }
}