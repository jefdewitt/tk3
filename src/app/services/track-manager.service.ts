import {EventEmitter, Injectable, Output} from '@angular/core';
import {Track} from '../interfaces/track.interface';
import {TimeManagerService} from './time-manager.service';
import {LocalStorageService} from './local-storage.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TrackManagerService {

  public track: Track;
  private oneDay = 86400000;
  @Output() public event = new EventEmitter();

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
    private _localStorageService: LocalStorageService,
    private _router: Router
    ) {
    this.track = this._localStorageService.findSelectedTrack();
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
  public sumTrackObjectTimesByInterval(track: Track, interval?: number): number {
    try {
      const startDate = this._timeManagerService.stringDateOfNthDaysAgo(0);
      const endDate = interval ? this._timeManagerService.stringDateOfNthDaysAgo(interval) : 0;
      let sum = 0;

      for (let i = 0; i < track['dates'].length; i++) {
        const recordedDate = track['dates'][i].recordedDate;
        if ( !endDate ) {
          sum += track['dates'][i].recordedMinutes;
        } else if ( (recordedDate <= startDate) && (recordedDate >= endDate) ) {
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
  public sortTrackObjectTimeEntriesByDate(first, second): number {
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
    track.dates.sort(this.sortTrackObjectTimeEntriesByDate);

    const earliestDate = track.dates[0] ? track.dates[0].recordedDate.split('-').join('/') : null;
    const convertedDate: any = earliestDate ? new Date(earliestDate) : null;
    const timeInBetween = Math.ceil((todaysDateObject - convertedDate) / this.oneDay);

    const times = this.totalMinutesInInterval(track, interval);

    const averageDailyMinutes = timeInBetween > 0 ? Math.floor(times / timeInBetween) : times;

    return [averageDailyMinutes, timeInBetween];
  }

  /**
   *
   */
  public totalMinutesInInterval(track: Track, interval: number): number {
    const dates = [];
    const dateStringStartingPoint = this._timeManagerService.stringDateOfNthDaysAgo(interval);

    track.dates.forEach( element => {
      if (element.recordedDate >= dateStringStartingPoint) {
        dates.push(element);
      }
    });

    dates.sort(this.sortTrackObjectTimeEntriesByDate);

    // Reduce lets you sum an array (dates is an array of objects)
    const times = dates.reduce((a, b) => {
      return a + b.recordedMinutes;
    }, 0);

    return times;
  }

  /**
   *
   * @param trackName string
   * @param sum number
   * @param interval number
   */
  public dailyPercentage(track: Track, interval: number): number {
    try {
      const timeGoal = ( this.track['time'] !== 0 ) ? this.track['time'] * 60 : 0;
      const sum = this.totalMinutesInInterval(track, interval);
      const daysSinceFirstEntry =
        this._timeManagerService.intervalOfDaysBetweenDateStrings(
          this.track.dates[this.track.dates.length - 1].recordedDate, this.track.dates[0].recordedDate
        );
      const percent = ( sum > 0 && timeGoal > 0 ) ? ( sum / timeGoal ) * 100 : 0;
      if ( interval > daysSinceFirstEntry ) { interval = daysSinceFirstEntry; }
      const dailyPercent: number = ( percent === 0 || interval === 0 ) ? 0 : percent / interval;
      return dailyPercent;
    } catch (error) {
      console.log('Can\'t find daily percentage from ' + track['name'] + ',\n' +
        ' ' + this.totalMinutesInInterval(track, interval) + ' & ' + interval + '.\n' +
        ' ' + error.message);
    }
  }

  /**
   *
   * @param track Track
   * @param numberOfDays? number
   *
   * If numberOfDays is left out then all the time will be summed for the track
   * to determine the overall percentage completed
   *
   * Pass a track name and sum to find the overall percentage of the track completed.
   */
  public percentOfTrackCompletedInInterval(track: Track, numberOfDays?: number): number {
    try {
      const timeGoal: number = track['time'] * 60;
      const sum: number = this.sumTrackObjectTimesByInterval(track, numberOfDays);
      const percent: number = ( sum > 0 && timeGoal > 0 ) ? ( sum / timeGoal ) * 100 : 0;
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
      this.track['dates'].sort(this.sortTrackObjectTimeEntriesByDate);
      this._localStorageService.saveTrack(this.track);
    }
  }

  /**
   * Check to see if user is inputting time in hours.
   * We declare these as lets instead of class properties cuz they aren't
   * loaded in time for Angular to find them in the DOM otherwise.
   */
  public minutesOrHours(hours, minutes): number {
    parseInt(minutes, 10);
    if (hours === true && minutes <= 24) {
      return minutes * 60;
    } else if (hours === false && minutes <= 1440) {
      return minutes;
    } else {
      return;
    }
  }

  /**
   *
   * @param track
   *
   * Takes a track object and prompts a user for an email address
   * to send the track data (dates & times entered).
   */
  public exportTrackData(track: Track): void | boolean {
    const email = prompt('Provide an email address to send this data to.');

    // Was email address provided?
    if ( email === null || email === '' || !email ) {
      return false;
    } else {
      const trackData = this.formatTrackData(track);
      window.location.href = 'mailto:' + email + '?subject=' + track.name + ' Data&body=' + trackData + '';
    }
  }

  /**
   *
   * @param trackName
   *
   * Get the track minutes and export them in an easy to read JSON file.
   */
  public formatTrackData(track: Track): Object {
    let trackDataOutput = 'Track name = ' + track.name + '%0D%0A%0D%0A';
    const trackDates = this.track['dates'];

    trackDates.sort(this.sortTrackObjectTimeEntriesByDate);

    for (let i = 0; i < trackDates.length; i++) {

      let trackDataString = '';

      // Grab 2 entries for date comparison
      let item1 = trackDates['dates'][i - 1];
      item1 = item1 ? new Date(item1.recordedDate.replace('-', '/')) : null;
      let item2 = trackDates['dates'][i];
      item2 = item2 ? new Date(item2.recordedDate.replace('-', '/')) : null;
      let itemDate: string;
      let itemTime: number;

      /**
       * Compute how many days are in between entries. If there are any
       * gaps, create placeholder date objects with 0 minutes to fill them.
       * This is so the emailed dates are sequential and there are no
       * missing dates (makes it easier to average out times later).
       */
      const numberOfDays = (item2 - item1) / this.oneDay;
      if ((item1 && item2) && (numberOfDays)) {
        for (let j = numberOfDays - 1; j > 0 ; j--) {
          const timePeriod = this.oneDay * j;
          const adjustedTime = item2 - timePeriod;
          const placeHolder = new Date(adjustedTime);
          itemDate = this._timeManagerService.formatDateObjectToString(placeHolder);
          itemTime = 0;
          trackDataString += itemDate + ' = ' + itemTime + '%0D%0A';
        }
        itemDate = this.track['dates'][i]['recordedDate'];
        itemTime = this.track['dates'][i]['recordedMinutes'];
      }

      trackDataString += itemDate + ' = ' + itemTime + '%0D%0A';
      trackDataOutput += trackDataString;
    }
    trackDataOutput += '%0D%0A' + this.track['name'];
    return trackDataOutput;
  }

  /**
   * If there's no selected tracks (i.e., 0 tracks) go the list track view.
   */
  public routeToListView() {
    try {
      this._router.navigateByUrl('/List Tracks');
    } catch (error) {
      console.log('Unable to reroute to List Track view ' + error.message);
    }
  }
}
