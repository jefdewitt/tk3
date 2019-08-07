import { GoalTrackService } from '../../services/goal-track.service';
import {Component, OnInit} from '@angular/core';
import { Track } from '../../interfaces/track.interface';

@Component({
  selector: 'app-bar-graph',
  templateUrl: './app-bar-graph.component.html',
  styleUrls: ['./app-bar-graph.component.css']
})
export class AppBarGraphComponent implements OnInit {

  // routeFromCal: string;
  // minutesAlreadyEntered: string;
  // increment: string;

  dailyMinutes: number = null;
  dailyPercentage: number = null;
  percentageDone: number = null;
  public timePeriod = 'progress today';
  public completed = ' today';
  public progressBarArray: Array<any> = [];
  isMonthView: boolean;
  isThreeMonthView: boolean;
  isSixMonthView: boolean;
  dayOfMonth: Array<any>;
  mostTime: any;
  public track = this.goalTrackService.track;
  public showTotalCompleted = false;
  public barWidth: number;
  public showDate: boolean;
  public frequency: number;

  private newerTrackCheckArray: Array<any>;
  private mobileDeviceWidth = 300;

  constructor( private goalTrackService: GoalTrackService ) { }

  public ngOnInit() {
    const track = this.goalTrackService.track;
    const sumInInterval = this.goalTrackService.timeInInterval(track['name'], 0, 0);
    this.newerTrackCheckArray = this.goalTrackService.verifyNewerTrackInfo();
    this.dailyMinAndPerc(track, sumInInterval, 1);
    if (this.newerTrackCheckArray[1] > 30) {
      this.progressBarArray = this.populateProgressBars(30);
    } else if (this.newerTrackCheckArray[1] > 0) {
      this.progressBarArray = this.populateProgressBars(this.newerTrackCheckArray[1]);
    } else {
      this.progressBarArray = this.populateProgressBars(1);
    }
    this.barWidth = this.newerTrackCheckArray[1] >= 29 ? 10 : this.mobileDeviceWidth / this.newerTrackCheckArray[1];
    this.frequency = this.determineFrequencyOfDateElements(this.progressBarArray);
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
  private dailyMinAndPerc(track: Track, sumInInterval: number, daysInInterval: number): void {
    this.dailyMinutes = this.newerTrackCheckArray[1] > daysInInterval ?
      this.goalTrackService.dailyMinutes(sumInInterval, daysInInterval) :
      this.newerTrackCheckArray[0];
    this.dailyPercentage = this.newerTrackCheckArray[1] > daysInInterval ?
      ( this.goalTrackService.dailyPercentage(track['name'], sumInInterval, daysInInterval) ) / 60 :
      this.newerTrackCheckArray[0];
    this.progressBarArray = this.goalTrackService.findRecentTime(track['name'], 1);
    this.percentageDone = this.goalTrackService.percentOfEntireGoal(track['name'], sumInInterval);
  }

  // Check to see if user is selecting checkboxes
  public changeTimeFrame($event: any): void {
    const timeValue = $event.target.id;
    try {
      this.isMonthView = false;
      this.isThreeMonthView = false;
      this.isSixMonthView = false;
      this.showTotalCompleted = true;
      this.timePeriod = 'daily average';

      if (this.progressBarArray.length < 30) {
        this.showDate = true;
      }

      switch (timeValue) {
        case '1-month':
          let sumInInterval = this.goalTrackService.timeInInterval(this.track['name'], 0, 29);
          this.completed = ' this month';
          this.dailyMinAndPerc(this.track, sumInInterval, 29);
          this.progressBarArray = this.newerTrackCheckArray[1] > 30 ?
            this.populateProgressBars(30) :
            this.populateProgressBars(this.newerTrackCheckArray[1]);
          this.barWidth = this.newerTrackCheckArray[1] >= 29 ? 10 : this.mobileDeviceWidth / this.newerTrackCheckArray[1];
          this.frequency = this.determineFrequencyOfDateElements(this.progressBarArray);
          break;
        case '3-month':
          sumInInterval = this.goalTrackService.timeInInterval(this.track['name'], 0, 89);
          this.completed = ' in the last 90 days';
          this.dailyMinAndPerc(this.track, sumInInterval, 89);
          this.progressBarArray = this.newerTrackCheckArray[1] > 89 ?
            this.populateProgressBars(90) :
            this.populateProgressBars(this.newerTrackCheckArray[1]);
          this.barWidth = this.newerTrackCheckArray[1] >= 89 ? 3.33 : this.mobileDeviceWidth / this.newerTrackCheckArray[1];
          this.frequency = this.determineFrequencyOfDateElements(this.progressBarArray);
          break;
        case '6-month':
          sumInInterval = this.goalTrackService.timeInInterval(this.track['name'], 0, 179);
          this.completed = ' in the last 6 months';
          this.dailyMinAndPerc(this.track, sumInInterval, 179);
          this.progressBarArray = this.newerTrackCheckArray[1] > 179 ?
            this.populateProgressBars(180) :
            this.populateProgressBars(this.newerTrackCheckArray[1]);
          this.barWidth = this.newerTrackCheckArray[1] >= 179 ? 1.66 : this.mobileDeviceWidth / this.newerTrackCheckArray[1];
          this.frequency = this.determineFrequencyOfDateElements(this.progressBarArray);
          break;
      }
    } catch (error) {
      console.log('Changing time frame via checkbox is not working ' + error.message);
    }
  }

  /**
   *
   * @param time
   *
   * Take a date with format YYYY-MM-DD and reformat it to M/DD
   */

  trimmedDate(time: string): string {
    const splitTime = time.split('-');
    let trimmedDayDate = splitTime[1];
    let trimmedMonthDate = splitTime[2];
    if (trimmedDayDate.startsWith('0')) {
      trimmedDayDate = trimmedDayDate[1];
    }
    if (trimmedMonthDate.startsWith('0')) {
      trimmedMonthDate = trimmedMonthDate[1];
    }
    const trimmedDate = trimmedDayDate + '/' + trimmedMonthDate;
    return trimmedDate;
  }

  /**
   *
   * @param track Track
   * @param datePlaceholder
   *
   * This simply loops thru a track's dates property for matching dates provided from
   * the populateProgressBars function below and returns the time from that date.
   */

  timeFinder(track: Track, datePlaceholder: string): string {
    let time;
    // loop thru selected track's dates property
    for (let i = 0; i < track['dates'].length; i++) {
      if (track['dates'][i].recordedDate === datePlaceholder) {
        time = track['dates'][i].recordedMinutes;
        time = time / 60;
        time = time.toFixed(1);
        return time;
      } else {
        time = 0;
      }
    }
    return time;
  }

  /**
   *
   * @param timeInterval
   *
   * Pass the number of date objects you want returned in a new progress bar array.
   * If time already exists inside the dates property of the track object for the
   * dates created in this function, they'll will added to the object with the appropriate
   * date. This func just returns date objects equal to the number of progress bars
   * you want created.
   */

  populateProgressBars(timeInterval: number): Array<Object> {
    try {
      // create new array
      const progressArray: Array<Object> = [];
      // create objects to populate new array (equal to number passed as arg)
      for (let i = 0; i < timeInterval; i++) {
        // create new date object for comparison
        const datePlaceholder = this.goalTrackService.dateOfNthDaysAgo(i);
        const progressBarObject = {
          'date' : this.trimmedDate(datePlaceholder),
          'time' : this.timeFinder(this.track, datePlaceholder)
        };
        progressArray.push(progressBarObject);
      }
      this.findMostTime(progressArray);
      return progressArray.reverse();
    } catch (error) {
      console.log('Unable to populate progress bar array ' + error.message);
    }
  }

  compareFunction(a: number, b: number): number {
    return a - b;
  }

  findMostTime(progressArray: Array<any>): void {
    try {
      const timeArray: Array<any> = [];
      for (let i = 0; i < progressArray.length; i++) {
        const time = progressArray[i].time;
        timeArray.push(time);
      }
      const sortedArray = timeArray.sort(this.compareFunction);
      // Find the most time in the array
      const mostTime = sortedArray.pop();
      if (mostTime) {
        this.mostTime = mostTime;
      } else {
        this.mostTime = 0;
      }
    } catch (error) {
      console.log('Unable to find top time' + error.message);
    }
  }

}
