import { Injectable, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import { Track } from '../interfaces/track.interface';

@Injectable()
export class GoalTrackService {

  public track: Track;
  public trackToEdit: string = '';

  private example: Track;
  private count: number = 2;

  @Output()
  public event = new EventEmitter();

  constructor() {
    this.findSelectedTrack().subscribe((track: Track): Track => {
      this.track = track;
      return track;
    })

    // The Track object needs to be initialized with values
    this.example = {
      dates: [],
      name: 'new track ',
      selected: true,
      time: 0,
      editName: false,
      editTime: false
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
  public updateTrackTimeInStorage(date: string, day: number | string, time: string): void {

    const convertedTime = this.convertToNumber(time);
    const isTimeValid = this.timeCheck(convertedTime);

    if (isTimeValid && day !== '') {

      if (this.track['dates'].length > 0) {

        for (let i = 0; i < this.track['dates'].length; i++) {

            const recordedEntry = this.track['dates'][i];

            if ( date === recordedEntry.recordedDate) {
              this.track['dates'][i].recordedMinutes = convertedTime;
              break;
            } else if ( i === this.track['dates'].length - 1 ) {
              const timeObject = {
                recordedMinutes : convertedTime,
                recordedDate : date
              };
              this.track['dates'].push(timeObject);
            }
        }
      } else {
        const timeObject = {
          recordedMinutes : convertedTime,
          recordedDate : date
        };
        this.track['dates'].push(timeObject);
      }
      this.track['dates'].sort(this.compareFunction);
      localStorage.setItem(this.track['name'], JSON.stringify(this.track));
    }
  }

  public getAllTracks(): Track[] {
    try {
      const tracks = [];
      for (let i = 0; i < localStorage.length; i++) {
        let track = localStorage.getItem(localStorage.key(i));
        track = JSON.parse(track);
        tracks.push(track);
      }
      return tracks;
    } catch (error) {
      console.log('Unable to retrive tracks list. ' + error.message);
    }
  }

 // Returns the current selected track
 public findSelectedTrack(): Observable<Object> {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        let track = localStorage.getItem(localStorage.key(i));
        track = JSON.parse(track);
        if (track['selected'] === true) {
          return of(track);
        }
      }
      // If there's no selected tracks
      return of(false);
    } catch (error) {
      console.log('Currently there\'s no selected track. ' + error.message);
    }
  }

  // Confirms no other tracks exist with desired name
  public nameCheck(name: string): boolean {
    try {
      if (name) {
        if (localStorage.length > 1) {
          for (let i = 0; i < localStorage.length; i++) {
            let track = localStorage.getItem(localStorage.key(i));
            track = JSON.parse(track);
            if (name === track['name']) {
              alert('This track already exists. Please choose a different name.');
              return false;
            } else if (name === '') {
              alert('Please choose a name.');
              return false;
            } else if (i === (localStorage.length - 1)) {
              this.deselectTracks();
              return true;
            }
          }
        } else {
          this.deselectTracks();
          return true;
        }
      } else {
        alert('Please enter a name.');
      }
    } catch (error) {
      console.log('Name check failed. ' + error.message);
    }
  }

  // Confirms if time was actually entered
  private timeCheck(time: number): boolean {
    if (time > 0) {
      return true;
    } else {
      return;
    }
  }

   /**
   * Check to see if user is inputting time in hours.
   * We declare these as lets instead of class properties cuz they aren't
   * loaded in time for Angular to find them in the DOM otherwise.
   */
  public minutesOrHours(hours, minutes) {
    if (hours === true && minutes <= 24) {
      return minutes * 60;
    } else if (hours === false && minutes <= 1440) {
      return minutes;
    } else {
      return;
    }
  }

  // Defaults all tracks selected property to false
  public deselectTracks(): void {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        let track = localStorage.getItem(localStorage.key(i));
        track = JSON.parse(track);
        track['selected'] = false;
        localStorage.setItem(track['name'], JSON.stringify(track));
      }
    } catch (error) {
      console.log('Deselecting tracks failed. ' + error.message);
    }
  }

  // Create a string from a Date object with today's date, format YYYY-MM-DD
  public createDateObject(date?: Date): string {
    const dateObj = date ? date : new Date();
    let month: any = dateObj.getMonth() + 1; // getMonth is 0-based
    if (month < 10) { month = '0' + month; }
    let day: any = dateObj.getDate();
    if (day < 10) { day = '0' + day; }
    const year = dateObj.getFullYear();
    const newDate = year + '-' + month + '-' + day;
    return newDate;
  }

  /**
   *
   * @param daysAgo
   *
   * Pass in a number to return the date from as far
   * back as the time specified.
   */
  dateOfNthDaysAgo(daysAgo: number): string {
    try {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() - daysAgo);
      let nthDaysAgo: any = newDate.getDate();
      if (nthDaysAgo < 10) { nthDaysAgo = '0' + nthDaysAgo; }
      let monthMinusNthDaysAgo: any = newDate.getMonth() + 1;
      if (monthMinusNthDaysAgo < 10) { monthMinusNthDaysAgo = '0' + monthMinusNthDaysAgo; }
      const yearMinusNthDaysAgo = newDate.getFullYear();
      const dateNthDaysAgo = yearMinusNthDaysAgo + '-' + monthMinusNthDaysAgo + '-' + nthDaysAgo;
      return dateNthDaysAgo;
    } catch (error) {
      console.log('Can\'t find date from ' + daysAgo + ' days ago' + error.message);
    }
  }

  /**
   *
   * @param trackName : string
   * @param startTime : number
   * @param endTime   : number
   *
   * The startTime is the number of days from today to begin the maths and the endTime is number of days from today
   * to end the maths.
   *
   * Example: this.goalTrackService.timeInInterval('firstTrack', 0, 0); // Returns today's time
   * Example: this.goalTrackService.timeInInterval('firstTrack', 0, 6); // Returns last week's sum of time
   * Example: this.goalTrackService.timeInInterval('firstTrack', 15, 45) // Returns one month of time beginning 15 days ago.
   */
  timeInInterval(trackName: string, startTime: number, endTime: number) {
    try {
      const track = this.findTrackByName(trackName);
      const startDate = this.dateOfNthDaysAgo(startTime);
      const endDate = this.dateOfNthDaysAgo(endTime);
      let sum = 0;

      for (let i = 0; i < track['dates'].length; i++) {
        const recordedDate = track['dates'][i].recordedDate;
        if ( (recordedDate <= startDate) && (recordedDate >= endDate) ) {
          sum += track['dates'][i].recordedMinutes;
        }
      }
      return sum;
    } catch (error) {
      console.log('Can\'t find sum in time interval provided for ' + trackName + ' track ' + error.message);
    }
  }

  /**
   *
   * @param sum: number;
   * @param interval: number;
   *
   * Pass a sum and a time interval (7 = week, 30 = month, etc) to find daily minutes
   */
  dailyMinutes(sum, interval) {
    try {
      const percent: number = ( sum === 0 || interval === 0 ) ? 0 : sum / interval;
      return percent;
    } catch (error) {
      console.log('Can\'t find daily minutes from ' + sum + ' / ' + interval + '. ' + error.message);
    }
  }

  /**
   *
   * @param trackName string
   * @param sum number
   * @param interval number
   */
  dailyPercentage(trackName, sum, interval) {
    try {
      const track = this.findTrackByName(trackName);
      const timeGoal = ( track['time'] !== 0 ) ? track['time'] : 0;
      const percent = ( sum > 0 && timeGoal > 0 ) ? ( sum / timeGoal ) * 100 : 0;
      const dailyPercent: number = ( percent === 0 || interval === 0 ) ? 0 : percent / interval;
      return dailyPercent;
    } catch (error) {
      console.log('Can\'t find daily percentage from ' + trackName + ', ' + sum + ' & ' + interval + '. ' + error.message);
    }
  }

  /**
   *
   * @param trackName string
   * @param sum string
   *
   * Pass a track name and sum to find the overall percentage of the track completed.
   */
  percentOfEntireGoal(trackName, sum) {
    try {
      const track = this.findTrackByName(trackName);
      const timeGoal = track['time'] * 60;
      const percent = ( sum > 0 && timeGoal > 0 ) ? ( sum / timeGoal ) * 100 : 0;
      return percent;
    } catch (error) {
      console.log('Can\'t find daily percentage from ' + trackName['name'] + ' & ' + sum + '. ' + error.message);
    }
  }

  /**
   *
   * @param numberOfDays: number
   *
   * Pass the number of days you want data on and the time completed for each day will be
   * returned in a tidy array;
   */
  findRecentTime(trackName, numberOfDays) {
    try {
      const selected = this.findTrackByName(trackName);
      const recentTime: Array<any> = [];
      for (let i = 0; i < numberOfDays; i++) {
          let timeEntry: any = this.timeInInterval(selected['name'], i, i);
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

  public findTrackByName(track) {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        let storedTrack = localStorage.getItem(localStorage.key(i))
        storedTrack = JSON.parse(storedTrack);
        if (storedTrack['name'] === track) {
          return storedTrack;
        }
      }
    } catch (error) {
      console.log('Unable to find ' + track + ' by name ' + error.message);
    }
  }

  public overallCompleted(track) {
    try {
      let sum = 0;
      for (let i = 0; i < track['dates'].length; i++) {

        sum += Number(track['dates'][i].recordedMinutes);
      }
      const percentage = track['time'] > 0 ? ( sum / ( track['time']  * 60 ) ) * 100 : 0;
      if (percentage > 0) {
        return percentage.toFixed(2);
      } else {
        return 0;
      }
    } catch (error) {
      console.log('Currently there\'s no selected track. ' + error.message);
    }
  }

  /**
   * 
   * @param track 
   * 
   * Takes a track object and prompts a user for an email address
   * to send the track data (dates & times entered).
   */
  exportTrackData(track: Track): void | boolean {
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
  formatTrackData(track: Track): Object {
    let trackDataOutput = 'Track name = ' + track.name + '%0D%0A%0D%0A';
    const selectedTrack = localStorage.getItem(track.name);
    const parsedTrack = JSON.parse(selectedTrack);
    let trackDates = parsedTrack['dates'];
    const oneDay = 86400000;

    trackDates.sort(this.compareFunction);

    for (let i = 0; i < trackDates.length; i++) {

      let trackDataString = '';

      // store 2 items
      debugger;
      let item1 = parsedTrack['dates'][i - 1];
      item1 = item1 ? new Date(item1.recordedDate.replace('-', '/')) : null;
      let item2 = parsedTrack['dates'][i];
      item2 = item2 ? new Date(item2.recordedDate.replace('-', '/')) : null;
      let itemDate: string;
      let itemTime: string;

      // compute how many days are in between entries
      const numberOfDays = (item2 - item1) / oneDay;
      if ((item1 && item2) && (numberOfDays)) {
        for (let j = numberOfDays - 1; j > 0 ; j--) {
          const timePeriod = oneDay * j;
          const adjustedTime = item2 - timePeriod;
          const placeHolder = new Date(adjustedTime);
          itemDate = this.createDateObject(placeHolder);
          itemTime = '0';
          trackDataString += itemDate + ' = ' + itemTime + '%0D%0A';
        }
        itemDate = parsedTrack['dates'][i]['recordedDate'];
        itemTime = parsedTrack['dates'][i]['recordedMinutes'];
      } else {
        itemDate = parsedTrack['dates'][i]['recordedDate'];
        itemTime = parsedTrack['dates'][i]['recordedMinutes'];
      }

      trackDataString += itemDate + ' = ' + itemTime + '%0D%0A';
      trackDataOutput += trackDataString;
    }
    trackDataOutput += '%0D%0A' + selectedTrack;
    return trackDataOutput;
  }

  /**
   *
   * @param first: number
   * @param second: number
   *
   * Sort track entries by date. First, these need to have hyphens
   * removed so we can properly parse them and then compare.
   */
  public compareFunction(first, second) {
      const firstString = first.recordedDate.replace(/-/g, '');
      const secondString = second.recordedDate.replace(/-/g, '');
      return (parseInt(firstString, 10) - parseInt(secondString, 10));
  }

    /**
     * Creates a new track, and updates localStorage to reflect the change.
     *
     * @param name: string
     * @param time: number
     */

    public createNewTrack() {

      const tracks = this.getAllTracks();
      const newTrackName = 'new track ';

      // FYI -- .indexOf is a older/clunkier (ES5) version of .includes()
      let newTrackArray = tracks.filter( item => 
        item.name.includes(newTrackName)
      )

      let newestTrack: Track;

      if ( newTrackArray.length > 0 ) {
        newestTrack = newTrackArray.pop();
      }

      // .match() returns an array matching the regex; in this case, any numbers
      let number: any = newestTrack ? newestTrack.name.match(/\d/g) : null;

      // Is there a number in the track name?
      if ( newestTrack && number ) {
        // .join returns a string from the number array
        number = number.join("");
        // Get the number from the string
        number = parseInt(number, 10);
      }

      // If there's a number in the track name, iterate the number, else just create a 'new track'
      if (number || newestTrack) {
        this.example.name = 'new track ' + (number + 1);
      } else {
        this.example.name = 'new track ';
      }

      localStorage.setItem(this.example.name, JSON.stringify(this.example));
      this.event.emit(this.example.name);
    }

  /**
   *
   * Loop thru tracks from localstorage and turn the selected key
   * for the track clicked to true
   */
  public makeSelectedTrack(track) {
    try {
      this.track = track;
      this.deselectTracks();
      for (let i = 0; i < localStorage.length; i++) {
        let storedTrack = localStorage.getItem(localStorage.key(i));
        storedTrack = JSON.parse(storedTrack);
        if (storedTrack['name'] === track.name) {
          storedTrack['selected'] = true;
          localStorage.setItem(storedTrack['name'], JSON.stringify(storedTrack));
          // this.findSelectedTrack();
        }
      }
    } catch (error) {
      console.log('Could not change selected track ' + error.message);
    }
  }

  public deleteTrack(track) {
    // const selectedTrack: any = this.findTrackByName(track.name);
    localStorage.removeItem(track.name);
  }

}
