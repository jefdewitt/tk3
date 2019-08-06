import { Component, OnInit } from '@angular/core';
import {GoalTrackService} from '../../services/goal-track.service';
import {TimeObject} from '../../timeObject';

@Component({
  selector: 'app-app-input-field',
  templateUrl: './app-input-field.component.html',
  styleUrls: ['./app-input-field.component.css']
})
export class AppInputFieldComponent implements OnInit {

  public minutes: number;
  public hours = false;
  public track = this.goalTrackService.track;
  public toggle = true;

  private timeObject: TimeObject;

  constructor( private goalTrackService: GoalTrackService ) { }

  ngOnInit() {
  }

  // Adds minutes to local storage for submit button clicks
  public addMinutes(): void {
    try {
      // Check if minutes or hours
      this.minutes = this.goalTrackService.minutesOrHours(this.hours, this.minutes);
      // Create new time object for the dates array
      this.setTimeObject(this.goalTrackService.createDateObject());
      // Check if min > 0 and if there are prev. date entries in dates array
      const timeCheck = this.checkForValidMinAndDate();

      if (timeCheck) {
        localStorage.setItem(this.track['name'], JSON.stringify(this.track));
        this.minutes = null;
        this.router.navigateByUrl('/Home');
      }

    } catch (error) {
      console.log('Dates array is unavailable ' + error.message);
    }
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
        alert('Please enter an actual amount of time, dummy.');
        return false;
      }
    } catch (error) {
      console.log('Minutes & dates validation failed ' + error.message);
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

}
