import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {GoalTrackService} from '../../services/goal-track.service';
import {TimeObject} from '../../timeObject';
import {AppCalendarComponent} from '../app-calendar/app-calendar.component';

@Component({
  selector: 'app-input-field',
  templateUrl: './app-input-field.component.html',
  styleUrls: ['./app-input-field.component.css']
})
export class AppInputFieldComponent {

  public minutes: number;
  public hours = false;
  public track = this.goalTrackService.track;
  public toggle = true;

  private _dateFromCal: string;

  @ViewChild(AppCalendarComponent) calendar: AppCalendarComponent;
  @Output() notifyIOComp: EventEmitter<string> = new EventEmitter<string>();

  constructor( private goalTrackService: GoalTrackService ) { }

  /**
   *
   * @param message array
   *
   * Add minutes to a date selected from the calendar
   */
  public onNotifyClicked(dataFromCal: Array<any>): void {
    this.minutes = dataFromCal[0].minutes;
    this._dateFromCal = dataFromCal[1];
  }

  public updateCal(hours: boolean): void {
    this.calendar.changeTimeFrame(hours);
  }

  public refreshCal(): void {
    this.calendar.resetAndChecks();
    this.calendar.ngOnInit();
  }

// Adds minutes to local storage for submit button clicks
  public addMinutes(): void {
    try {
      if (this.minutes != null) {

        if (typeof this.minutes === 'string') {
          const parsedMinutes = parseInt(this.minutes, 10);
          this.minutes = parsedMinutes;
        }

        // Check if minutes or hours
        this.minutes = this.goalTrackService.minutesOrHours(this.hours, this.minutes);

        let timeObject: TimeObject = new TimeObject();
        if (!this._dateFromCal) {
          timeObject = this.setTimeObject(this.minutes, this.goalTrackService.createDateObject());
        } else {
          timeObject = this.setTimeObject(this.minutes, this._dateFromCal);
        }
        // Check if min > 0 and if there are prev. date entries in dates array
        this.sameDateCheck(timeObject);

        localStorage.setItem(this.track['name'], JSON.stringify(this.track));
        this.minutes = null;
        this._dateFromCal = null;
        this.notifyIOComp.emit('update');
      }

    } catch (error) {
      console.log('Dates array is unavailable ' + error.message);
    }
  }

  /**
   *
   * @param providedDate string
   *
   * Sets the timeObject needed to add to the track dates array
   */
  private setTimeObject(minutes: number, providedDate: string): TimeObject {
    const timeObject: TimeObject = {
      recordedMinutes : minutes,
      recordedDate : providedDate
    };

    return timeObject;
  }

  /**
   * Confirms that a valid time was entered & whether any previous
   * times were entered on that date.
   */
  // checkForValidMinAndDate() {
  //   try {
  //     if (this._timeObject.recordedMinutes > 0) {
  //       if (this.track['dates'].length >= 1 && !this._fromCal) {
  //         // Check for same date entries
  //         this.sameDateCheck();
  //       } else {
  //         this.track['dates'].push(this._timeObject);
  //       }
  //       return true;
  //     } else {
  //       alert('Please enter an actual amount of time, dummy.');
  //       return false;
  //     }
  //   } catch (error) {
  //     console.log('Minutes & dates validation failed ' + error.message);
  //   }
  // }

  // Have previous times been entered for the date being checked?
  private sameDateCheck(timeObject: TimeObject): void {
    for (let i = 0; i < this.track['dates'].length; i++) {
      if (this.track['dates'][i].recordedDate === timeObject.recordedDate) {
        const oldMinutes = this.track['dates'][i].recordedMinutes;
        const newMinutes = timeObject.recordedMinutes;
        this.track['dates'][i].recordedMinutes = this._dateFromCal ? +newMinutes : +oldMinutes + +newMinutes;
        return;
      }
    }
    this.track['dates'].push(timeObject);
  }

}
