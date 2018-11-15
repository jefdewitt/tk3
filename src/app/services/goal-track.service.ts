import { Injectable, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
// import { Goal } from '../goal';

@Injectable()
export class GoalTrackService {

  // public track: Object;
  public track;

  public trackToEdit = '';

  private example = {
    dates: [],
    name: 'new track ',
    selected: true,
    time: 0,
    editName: false,
    editTime: false
  };
  private count = 2;

  @Output()
  public event = new EventEmitter();

  constructor() {
    this.findSelectedTrack().subscribe((track) => {
      console.log('this.track', this.track)
      this.track = track;
      return track;
    })
    // this.track = this.findSelectedTrack();
   }

  /**
   *
   * @param time: string | number
   *
   * Remove leading 0 and convert string to number.
   */
  private convertToNumber(time) {
    const convertedTime = parseInt(time, 10);
    return convertedTime;
  }

  /**
   *
   * @param date string
   * @param day number
   * @param time string | number
   *
   * This method is called when clicking on a calendar data cell.
   *
   * Takes an actual formatted year/month/day date string, a day
   * that represents the number of the day in that month, and the
   * entered when you click on a calendar cell.
   */
  public updateTrackTimeInStorage(date, day, time) {

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

  public getAllTracks() {
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
  // private findSelectedTrack() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        let track = localStorage.getItem(localStorage.key(i));
        track = JSON.parse(track);
        if (track['selected'] === true) {
          return of(track);
          // return track;
        }
      }
      // If there's no selected tracks
      return of(false);
      // return false;
    } catch (error) {
      console.log('Currently there\'s no selected track. ' + error.message);
    }
  }

  // Confirms no other tracks exist with desired name
  public nameCheck(name) {
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
  private timeCheck(time) {
    if (time > 0) {
      return true;
    } else {
      alert('Please enter a time greater than 0.');
    }
  }

  // Defaults all tracks selected property to false
  public deselectTracks() {
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

  // Create a date object with today's date, format YYYY-MM-DD
  public createDateObject() {
    const dateObj = new Date();
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
  dateOfNthDaysAgo(daysAgo) {
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
  timeInInterval(trackName, startTime, endTime) {
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
      const percentage = track['time'].length > 0 ? ( sum / ( track['time']  * 60 ) ) * 100 : 0;
      if (percentage > 0) {
        return percentage.toFixed(2);
      } else {
        return 0;
      }
    } catch (error) {
      console.log('Currently there\'s no selected track. ' + error.message);
    }
  }

  exportTrackData(trackName) {
    const email = prompt('Provide an email address to send this data to.');

    const trackData = this.formatTrackData(trackName);
    window.location.href = 'mailto:' + email + '?subject=' + trackName + ' Data&body=' + trackData + '';
  }

  /**
   *
   * @param trackName: string
   *
   * Get the track minutes and export them in an easy to read JSON file.
   */
  formatTrackData(trackName) {
    let trackDataOutput = 'Track name = ' + trackName + '%0D%0A%0D%0A';
    const track = localStorage.getItem(localStorage.key(trackName));
    const parsedTrack = JSON.parse(track);
    const trackDates = parsedTrack['dates'];

    const sortTrackDates = trackDates.sort(this.compareFunction);

    for (let i = 0; i < trackDates.length; i++) {

      const itemDate = parsedTrack['dates'][i]['recordedDate'];
      const itemTime = parsedTrack['dates'][i]['recordedMinutes'];

      const trackDataString = itemDate + ' = ' + itemTime + '%0D%0A';
      trackDataOutput += trackDataString;
    }
    trackDataOutput += '%0D%0A' + track;
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
      const newTrackName = 'new track';
      let newTrackArray = [];

      for (let i = 0; i < tracks.length; i++) {

        const name = tracks[i].name;

        //.indexOf is a older/clunkier (ES5) version of .includes
        if (name.indexOf(newTrackName) !== -1) {
          newTrackArray.push(name);
        }

      }

      let newestTrack: any  = '';

      if ( newTrackArray.length > 0 ) {
        newestTrack = newTrackArray.pop();
      }

      let number = newestTrack.match(/\d/g);

      if ( newestTrack && number ) {
        number = number.join("");
        number = parseInt(number, 10);
      }

      if (number || newestTrack) {
        this.example.name = 'new track ' + (number + 1);
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
