import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {TimeObject} from '../../timeObject';
import {AppCalendarComponent} from '../app-calendar/app-calendar.component';
import {TimeManagerService} from '../../services/time-manager.service';
import {TrackManagerService} from '../../services/track-manager.service';
import {LocalStorageService} from '../../services/local-storage.service';

@Component({
  selector: 'app-input-field',
  templateUrl: './app-input-field.component.html',
  styleUrls: ['./app-input-field.component.css']
})
export class AppInputFieldComponent {

  public minutes: number;
  public hours = false;
  public toggle = true;
  public dateFromCal: string;

  @ViewChild(AppCalendarComponent) public calendar: AppCalendarComponent;
  @Output() public notifyIOComp: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public changeTimeFrame: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() public track;


  constructor(
    private _timeManagerService: TimeManagerService,
    private _trackManagerService: TrackManagerService,
    private _localStorageService: LocalStorageService
  ) { }

  /**
   *
   * @param message array
   *
   * Add minutes to a date selected from the calendar
   */
  public onNotifyClicked(dataFromCal: Array<any>): void {
    this.minutes = dataFromCal[0].minutes;
    this.dateFromCal = dataFromCal[1];
  }

  public updateCalAndCharts(hours: boolean): void {
    this.calendar.changeTimeFrame(hours);
    this.changeTimeFrame.emit(hours);
  }

  public refreshCal(): void {
    this.calendar.resetAndChecks();
    this.calendar.loadNewCalendar();
  }

// Adds minutes to local storage for submit button clicks
  public addMinutes(): void {
    try {

      if (typeof this.minutes === 'string') {
        const parsedMinutes = parseInt(this.minutes, 10);
        this.minutes = parsedMinutes;
      }

      if (this.minutes != null && !Number.isNaN(this.minutes)) {


        // Check if minutes or hours
        this.minutes = this._trackManagerService.minutesOrHours(this.hours, this.minutes);

        let timeObject: TimeObject = new TimeObject();
        if (!this.dateFromCal) {
          timeObject = this.setTimeObject(this.minutes, this._timeManagerService.formatDateObjectToString());
        } else {
          timeObject = this.setTimeObject(this.minutes, this.dateFromCal);
        }
        // Check if min > 0 and if there are prev. date entries in dates array
        this.sameDateCheck(timeObject);

        this._localStorageService.saveTrack(this.track);

        this.minutes = null;
        this.dateFromCal = null;
        this.notifyIOComp.emit(this.hours);
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
        this.track['dates'][i].recordedMinutes = this.dateFromCal ? +newMinutes : +oldMinutes + +newMinutes;
        return;
      }
    }
    this.track['dates'].push(timeObject);
  }

}
