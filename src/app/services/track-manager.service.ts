import {EventEmitter, Injectable, Output} from '@angular/core';
import {Track} from '../interfaces/track.interface';
import {TimeManagerService} from './time-manager.service';
import {LocalStorageService} from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TrackManagerService {

  public track: Track;
  private oneDay = 86400000;
  @Output()
  public event = new EventEmitter();

  private example: Track = {
    dates: [],
    name: 'new track ',
    selected: true,
    time: 0,
    editName: false,
    editTime: false
  };

  constructor(
    private _timeManagerService: TimeManagerService,
    private _localStorageService: LocalStorageService
    ) {
    this._localStorageService.findSelectedTrack().subscribe((track: Track): Track => {
      this.track = track;
      return track;
    });
  }

  /**
   *
   * @param name string
   * @param time number
   *
   * Creates a new track, and updates localStorage to reflect the change.
   */
  public createNewTrack(): void {

    const tracks = this._localStorageService.getAllTracks();
    const newTrackName = 'new track ';

    // FYI -- .indexOf is an older/clunkier (ES5) version of .includes()
    const newTrackArray = tracks.filter( item =>
      item.name.includes(newTrackName)
    );

    let newestTrack: Track;

    if ( newTrackArray.length > 0 ) {
      newestTrack = newTrackArray.pop();
    }

    // .match() returns an array matching the regex; in this case, any numbers
    let number: any = newestTrack ? newestTrack.name.match(/\d/g) : null;

    // Is there a number in the track name?
    if ( newestTrack && number ) {
      // .join returns a string from the number array
      number = number.join('');
      // Get the number from the string
      number = parseInt(number, 10);
    }

    // If there's a number in the track name, iterate the number, else just create a 'new track'
    if (number || newestTrack) {
      this.example.name = 'new track ' + (number + 1);
    } else {
      this.example.name = 'new track ';
    }

    this._localStorageService.saveTrack(this.example);
    this.event.emit(this.example.name);
  }

  public sortTrackObjectTimesByDate(track: Track): Track {
    const sortedTrack = track;
    return sortedTrack;
  }

  /**
   *
   * @param trackName Track
   * @param interval number
   *
   * interval is number of days back in time from today
   *
   * Example: this.goalTrackService.timeInInterval('firstTrack', 0); // Returns today's time
   * Example: this.goalTrackService.timeInInterval('firstTrack', 6); // Returns last week's sum of time
   */
  public sumTrackObjectTimesByInterval(track: Track, interval: number): number {
    try {
      const startDate = this._timeManagerService.stringDateOfNthDaysAgo(0);
      const endDate = this._timeManagerService.stringDateOfNthDaysAgo(interval);
      let sum = 0;

      for (let i = 0; i < track['dates'].length; i++) {
        const recordedDate = track['dates'][i].recordedDate;
        if ( (recordedDate <= startDate) && (recordedDate >= endDate) ) {
          sum += track['dates'][i].recordedMinutes;
        }
      }
      return sum;
    } catch (error) {
      console.log('Can\'t find sum in time interval provided for ' + track['name'] + ' track ' + error.message);
    }
  }

  /**
   *
   * @param numberOfDays
   *
   * Pass the number of days you want data on and the time completed for each day will be
   * returned in a tidy array;
   */
  public listTimesEnteredByInterval(numberOfDays: number): Array<number> {
    try {
      const recentTime: Array<number> = [];
      for (let i = 0; i < numberOfDays; i++) {
        let timeEntry: any = this.sumTrackObjectTimesByInterval(this._localStorageService.track, i);
        timeEntry = timeEntry / 60;
        timeEntry = timeEntry.toFixed(1);
        recentTime.push(timeEntry);
        recentTime.reverse();
      }
      return recentTime;
    } catch (error) {
      console.log('Can\'t find recent time from ' + numberOfDays + '. ' + error.message);
    }
  }

  /**
   *
   * @param first string
   * @param second string
   *
   * Sort track entries by date. First, these need to have hyphens
   * removed so we can properly parse them and then compare.
   */
  public compareEntriesByDate(first, second) {
    const firstString = first.recordedDate.replace(/-/g, '');
    const secondString = second.recordedDate.replace(/-/g, '');
    return (parseInt(firstString, 10) - parseInt(secondString, 10));
  }

  /**
   *
   * @param track Track
   * @param interval number
   */
  public averageDailyCompletedMinutesByInterval(track: Track, interval: number): Array<number> {
    // Typed as 'any' for the subtraction below
    const todaysDateObject: any = new Date();
    const dates = [];

    track.dates.forEach(element => {
      dates.push(element);
    });
    dates.sort(this.compareEntriesByDate);

    const earliestDate = dates[0] ? dates[0].recordedDate.split('-').join('/') : null;
    const convertedDate: any = earliestDate ? new Date(earliestDate) : null;
    const timeInBetween = Math.ceil((todaysDateObject - convertedDate) / this.oneDay);
    const dateStringStartingPoint = this._timeManagerService.stringDateOfNthDaysAgo(interval);
    const dateObjectStartingPoint = this._timeManagerService.formatStringToDateObject(dateStringStartingPoint);

    const timeInInterval = dates.filter( element => {
      if (element.recordedDate < dateObjectStartingPoint) {
        dates.push(element);
      }
    });

    // Reduce lets you sum an array (dates is an array of objects)
    const times = timeInInterval.reduce((a, b) => {
      return a + b.recordedMinutes;
    }, 0);

    const averageDailyMinutes = timeInBetween > 0 ? Math.floor(times / timeInBetween) : times;

    console.log(averageDailyMinutes + ' ' + timeInBetween);
    return [averageDailyMinutes, timeInBetween];
  }



  public percentOfCompletedTrackByInterval(track: Track, interval: number): number {
    const percentOfTrackCompleted = track.time;
    return percentOfTrackCompleted;
  }

  /**
   *
   * @param track Track
   * @param sum string
   *
   * Pass a track name and sum to find the overall percentage of the track completed.
   */
  public percentOfEntireGoal(track: Track, numberOfDays: number) {
    try {
      const timeGoal = track['time'] * 60;
      const sum = this.sumTrackObjectTimesByInterval(track, numberOfDays);
      const percent = ( sum > 0 && timeGoal > 0 ) ? ( sum / timeGoal ) * 100 : 0;
      return percent;
    } catch (error) {
      console.log('Can\'t find daily percentage from ' + track['name'] + ' & ' + numberOfDays + '. ' + error.message);
    }
  }

  /**
   *
   * @param time number
   // *
   * Confirms if time was actually entered
   */
  private timeCheck(time: number): boolean {
    if (time > 0) {
      return true;
    } else {
      return;
    }
  }

  /**
   *
   * @param time: string | number
   *
   * Remove leading 0 and convert string to number.
   */
  private convertToNumber(time: string): number {
    const convertedTime = parseInt(time, 10);
    return convertedTime;
  }

  /**
   *
   * @param date string
   * @param day number | string
   * @param time string
   *
   * This method is called when clicking on a calendar data cell.
   *
   * Takes an actual formatted year/month/day date string, a day
   * that represents the number of the day in that month, and the
   * time entered when you click on a calendar cell.
   */
  public updateTrackTimeInStorage(date: string, day: number | string, time: number): void {

    // const convertedTime = this.convertToNumber(time);
    const isTimeValid = this.timeCheck(time);

    if (isTimeValid && day !== '') {

      if (this.track['dates'].length > 0) {

        for (let i = 0; i < this.track['dates'].length; i++) {

          const recordedEntry = this.track['dates'][i];

          if ( date === recordedEntry.recordedDate) {
            this.track['dates'][i].recordedMinutes = time;
            break;
          } else if ( i === this.track['dates'].length - 1 ) {
            const timeObject = {
              recordedMinutes : time,
              recordedDate : date
            };
            this.track['dates'].push(timeObject);
          }
        }
      } else {
        const timeObject = {
          recordedMinutes : time,
          recordedDate : date
        };
        this.track['dates'].push(timeObject);
      }
      this.track['dates'].sort(this.compareEntriesByDate);
      localStorage.setItem(this.track['name'], JSON.stringify(this.track));
    }
  }

  /**
   * Check to see if user is inputting time in hours.
   * We declare these as lets instead of class properties cuz they aren't
   * loaded in time for Angular to find them in the DOM otherwise.
   */
  public minutesOrHours(hours, minutes): number{
    parseInt(minutes, 10);
    if (hours === true && minutes <= 24) {
      return minutes * 60;
    } else if (hours === false && minutes <= 1440) {
      return minutes;
    } else {
      return;
    }
  }
}
