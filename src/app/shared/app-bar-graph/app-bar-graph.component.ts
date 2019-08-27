import {Component, Input, OnInit} from '@angular/core';
import { Track } from '../../interfaces/track.interface';
import {TimeManagerService} from '../../services/time-manager.service';
import {TrackManagerService} from '../../services/track-manager.service';

@Component({
  selector: 'app-bar-graph',
  templateUrl: './app-bar-graph.component.html',
  styleUrls: ['./app-bar-graph.component.css']
})
export class AppBarGraphComponent implements OnInit {

  public dailyMinutes: number = null;
  public dailyPercentage: number = null;
  public percentageDone: number = null;
  public timePeriod = 'Today\'s';
  public totalMinutes: number;
  public progressBarArray: Array<any> = [];
  public showTotalCompleted = false;
  public barWidth: number;
  public showDate: boolean;
  public frequency: number;
  public mostTime: any;
  public hasTime: boolean;
  public hours = false;

  @Input() public track;

  private dailyAverageMinutesAndIntervalArray: Array<number>;
  private mobileDeviceWidth = 300;
  private isMonthView: boolean;
  private isThreeMonthView: boolean;
  private isSixMonthView: boolean;
  private intervalOfDays: number;

  constructor(
    private _trackManagerService: TrackManagerService,
    private _timeManagerService: TimeManagerService
    ) { }

  public ngOnInit() {

    this.timePeriod = 'Today\'s';
    this.showTotalCompleted = false;

    this.dailyAverageMinutesAndIntervalArray =
      this._trackManagerService.averageDailyCompletedMinutesByInterval(this.track, 1);
    this.dailyMinAndPerc(this.track, 1);

    this.intervalOfDays = this.dailyAverageMinutesAndIntervalArray[1];

    if (this.intervalOfDays > 30) {
      this.progressBarArray = this.populateProgressBars(30);
    } else if (this.intervalOfDays > 0) {
      this.progressBarArray = this.populateProgressBars(this.intervalOfDays);
    }

    this.barWidth = this.intervalOfDays >= 29 ? 10 : this.mobileDeviceWidth / this.intervalOfDays;
    this.frequency = this.determineFrequencyOfDateElements(this.progressBarArray);

    this.hasTime = !!this._trackManagerService.sumTrackObjectTimesByInterval(this.track);
  }

  /**
   *
   * @param numberOfBars Array<objects>
   *
   * Determines equal spacing for date elements as they appear beneath progress bars.
   */
  private determineFrequencyOfDateElements(numberOfBars: any): number {

    let amount: number;

    if (numberOfBars.length < 11) {
      amount = 1;
    } else {
      amount = Math.ceil(numberOfBars.length / 10);
    }

    return amount;
  }

  /**
   *
   * @param track Track
   * @param sumInInterval number
   * @param daysInInterval number
   */
  private dailyMinAndPerc(track: Track, daysInInterval: number): void {

    this.totalMinutes = this._trackManagerService.totalMinutesInInterval(track, daysInInterval);

    this.percentageDone = this._trackManagerService.percentOfTrackCompletedInInterval(track, daysInInterval);

    this.dailyMinutes = this._trackManagerService.averageDailyCompletedMinutesByInterval(track, daysInInterval)[0];

    this.dailyPercentage = this._trackManagerService.dailyPercentage(track, daysInInterval);

    this.progressBarArray = this._trackManagerService.listTimesEnteredByInterval(daysInInterval);

  }

  /**
   *
   * @param timeInterval string
   * @param numberOfDays number
   * @param barSize number
   *
   * Set the amounts and percentages displayed in the table above the bar chart.
   * Set width of individual bars in bar chart.
   */
  private setTableAndChart(timeInterval: string, numberOfDays: number, barSize: number) {
    this.timePeriod = timeInterval;
    this.dailyMinAndPerc(this.track, numberOfDays);
    this.progressBarArray = this.intervalOfDays > (numberOfDays + 1) ?
                            this.populateProgressBars(numberOfDays + 1) :
                            this.populateProgressBars(this.intervalOfDays);
    this.barWidth = this.intervalOfDays >= numberOfDays ? barSize : this.mobileDeviceWidth / this.intervalOfDays;
    this.frequency = this.determineFrequencyOfDateElements(this.progressBarArray);
  }

  // Check to see if user is selecting checkboxes
  public changeTimeFrame($event: any): void {
    const timeValue = $event.target.attributes[2].nodeValue;
    try {
      this.isMonthView = false;
      this.isThreeMonthView = false;
      this.isSixMonthView = false;
      this.showTotalCompleted = true;

      if (this.progressBarArray.length < 30) {
        this.showDate = true;
      }

      switch (timeValue) {
        case '1-month':
          this.setTableAndChart('30 day', 29, 10);
          break;
        case '3-month':
          this.setTableAndChart('90 day', 89, 3.33);
          break;
        case '6-month':
          this.setTableAndChart('6 month', 179, 1.66);
          break;
      }
    } catch (error) {
      console.log('Changing time frame via buttons is not working ' + error.message);
    }
  }

  /**
   *
   * @param timeInterval
   *
   * Pass the number of date objects you want returned in a new progress bar array.
   * If time already exists inside the dates property of the track object for the
   * dates created in this function, they'll be added to the object with the appropriate
   * date. This func just returns date objects equal to the number of progress bars
   * you want created.
   */
  private populateProgressBars(timeInterval: number): Array<Object> {
    try {
      // create new array
      const progressArray: Array<Object> = [];
      // create objects to populate new array (equal to number passed as arg)
      for (let i = 0; i < timeInterval; i++) {
        // create new date object for comparison
        const datePlaceholder = this._timeManagerService.stringDateOfNthDaysAgo(i);
        const progressBarObject = {
          'date' : this._timeManagerService.trimmedDate(datePlaceholder),
          'time' : this._timeManagerService.stringMinutesOfTimeEnteredNthDayAgo(this.track, datePlaceholder)
        };
        progressArray.push(progressBarObject);
      }
      this.mostTime = this._timeManagerService.findMostTime(progressArray);

      // for (let i = progressArray.length - 1 ; i < progressArray.length; i--) {
      //   if ( progressArray[i]['time'] === 0 || progressArray[i]['time'] === '0' && i === 0 ) {
      //     progressArray.splice(progressArray.length - 1, 1);
      //     i--;
      //   } else {
      //     break;
      //   }
      // }

      progressArray.reverse();

      return progressArray;
    } catch (error) {
      console.log('Unable to populate progress bar array ' + error.message);
    }
  }

  /**
   *
   * @param hours boolean
   */
  public toggleMinutesOrHours(hours: boolean) {
    this.hours = !this.hours;
    this.totalMinutes = this._trackManagerService.changeTimeFrame(this.totalMinutes, !hours);
    this.dailyMinutes = this._trackManagerService.changeTimeFrame(this.dailyMinutes, !hours);
  }

}
