import { GoalTrackService } from '../../services/goal-track.service';
import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { Goal } from '../../goal';
import { TimeObject } from '../../timeObject';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-output',
  templateUrl: './app-output.component.html',
  styleUrls: ['./app-output.component.css']
})
export class AppOutputComponent implements OnInit, AfterContentInit {

  timeFrom: string;
  dailyMinutes: number = null;
  dailyPercentage: number = null;
  todayCheckbox: object;
  percentageDone: number = null;
  public timePeriod = 'progress today';
  public completed = ' today';
  dailyRecordedTimes: Array<any> = [];
  isMonthView: boolean;
  isYearView: boolean;
  dayOfMonth: Array<any>;
  noTracks = false;
  mostTime: any;
  public track = this.goalTrackService.track;

  constructor(private goalTrackService: GoalTrackService, private router: Router) {

    const track = this.goalTrackService.track;
    if (!track) {
      this.noTracks = true;
    } else {
      const sumInInterval = this.goalTrackService.timeInInterval(track['name'], 0, 0);
      this.dailyMinAndPerc(track, sumInInterval, 1);
    }
  }

  ngOnInit() {}

  ngAfterContentInit() {
    this.dailyRecordedTimes = this.populateProgressBars(7);
  }

  /**
   *
   * @param interval: number
   * @param timeFrame
   *
   * The interval param is the same as the one in this.percentCompleted(interval).
   * The timeFrame param is the range, or the total number of days we use to 
   * divide the sum of the times we collected since the date we provided above.
   */
  dailyMinAndPerc(track, sumInInterval, daysInInterval) {
    this.dailyMinutes = this.goalTrackService.dailyMinutes(sumInInterval, daysInInterval);
    this.dailyPercentage = this.goalTrackService.dailyPercentage(track['name'], sumInInterval, daysInInterval);
    this.dailyPercentage = this.dailyPercentage / 60;
    this.dailyRecordedTimes = this.goalTrackService.findRecentTime(track['name'], 1);
    this.percentageDone = this.goalTrackService.percentOfEntireGoal(track['name'], sumInInterval);
  }

  addDayOfMonth(index) {
    let date: any = this.goalTrackService.dateOfNthDaysAgo(index);
    date = date.split('-');
    date = date[2];
    this.dayOfMonth = date;
    return date;
  }

  // Check to see if user is selecting checkboxes
  changeTimeFrame($event) {
    const timeValue = $event.target.id;
    try {
      this.isMonthView = false;
      this.isYearView = false;

      switch (timeValue) {
        case 'week':
            let sumInInterval = this.goalTrackService.timeInInterval(this.track['name'], 0, 6);
            this.dailyMinAndPerc(this.track, sumInInterval, 7);
            this.timePeriod = 'daily average this week';
            this.completed = ' this week';
            this.dailyRecordedTimes = this.populateProgressBars(7);
            break;
        case 'month':
            sumInInterval = this.goalTrackService.timeInInterval(this.track['name'], 0, 29);
            this.dailyMinAndPerc(this.track, sumInInterval, 30);
            this.timePeriod = 'daily average this month';
            this.completed = ' this month';
            this.dailyRecordedTimes = this.populateProgressBars(30);
            this.isMonthView = true;
            break;
        case 'year':
            sumInInterval = this.goalTrackService.timeInInterval(this.track['name'], 0, 364);
            this.dailyMinAndPerc(this.track, sumInInterval, 365);
            this.timePeriod = 'daily average this year';
            this.completed = ' this year';
            this.dailyRecordedTimes = this.populateProgressBars(365);
            this.isYearView = true;
            break;
      }
    } catch (error) {
      console.log('Changing time frame via checkbox is not working ' + error.message);
    }
  }

  /**
   *
   * @param time: number
   *
   * Take a date with format YYYY-MM-DD and reformat it to M/DD
   */

  trimmedDate(time) {
    time = time.split('-');
    let trimmedDayDate = time[1];
    let trimmedMonthDate = time[2];
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
   * @param track: object
   * @param datePlaceholder
   *
   * This simply loops thru a track's dates property for matching dates provided from
   * the populateProgressBars function below and returns the time from that date.
   */

  timeFinder(track, datePlaceholder) {
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
   * @param timeInterval: number
   *
   * Pass the number of date objects you want returned in a new progress bar array.
   * If time already exists inside the dates property of the track object for the
   * dates created in this function, they'll will added to the object with the appropriate
   * date. This func just returns date objects equal to the number of progress bars
   * you want created.
   */

  populateProgressBars(timeInterval) {
    try {
      // create new array
      const progressArray: Array<any> = [];
      // create objects to populate new array (equal to number passed as arg)
      for (let i = 0; i < timeInterval; i++) {
        // create new date object for comparison
        const datePlaceholder = this.goalTrackService.dateOfNthDaysAgo(i);
        const progressBarObject: any = {
          'date' : this.trimmedDate(datePlaceholder),
          'time' : this.timeFinder(this.track, datePlaceholder)
        };
        progressArray.push(progressBarObject);
      }
      this.findMostTime(progressArray);
      // this.bottomTime = this.findBottomTime(progressArray);
      return progressArray.reverse();
    } catch (error) {
      console.log('Unable to populate progress bar array ' + error.message);
    }
  }

  compareFunction(a, b) {
    return a - b;
  }

  findMostTime(progressArray) {
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
