import { Injectable } from '@angular/core';
import { Goal } from '../goal';

@Injectable()
export class GoalTrackService {

  trackToEdit = '';

  constructor() { }

  getAllTracks() {
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
  findSelectedTrack() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        let track = localStorage.getItem(localStorage.key(i))
        track = JSON.parse(track);
        if (track['selected'] === true) {
          return track;
        }
      }
      // If there's no selected tracks
      return false;
    } catch (error) {
      console.log('Currently there\'s no selected track. ' + error.message);
    }
  }

  // Confirms no other tracks exist with desired name
  nameCheck(name) {
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
  timeCheck(time) {
    if (time > 0) {
      return true;
    } else {
      alert('Please enter a time greater than 0.');
    }
  }

  // Defaults all tracks selected property to false
  deselectTracks() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        let track = localStorage.getItem(localStorage.key(i))
        track = JSON.parse(track);
        track['selected'] = false;
        localStorage.setItem(track['name'], JSON.stringify(track));
      }
    } catch (error) {
      console.log('Deselecting tracks failed. ' + error.message);
    }
  }

  // Create a date object with today's date, format YYYY-MM-DD
  createDateObject() {
    const dateObj = new Date();
    let month: any = dateObj.getMonth() + 1; // months from 1-12
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
   * to end the maths. Set the fourth param to true to return a percentage.
   *
   * Example: this.goalTrackService.timeInInterval('firstTrack', 0, 0); // Returns today's time
   * Example: this.goalTrackService.timeInInterval('firstTrack', 0, 6); // Returns last week's sum of time
   * Example: this.goalTrackService.timeInInterval('firstTrack', 15, 45) // Returns one month of time beginning 15 days ago.
   */
  timeInInterval(trackName, startTime, endTime) {
    try {
      var track = this.findTrackByName(trackName)
      var startDate : any = this.dateOfNthDaysAgo(startTime);
      var endDate : any = this.dateOfNthDaysAgo(endTime);
      let sum = 0;

      for (var i=0; i<track['dates'].length; i++) {
        let recordedDate = track['dates'][i].recordedDate;
        if ( (recordedDate <= startDate) && (recordedDate >= endDate) ) {
          sum += track['dates'][i].recordedMinutes;
        }
      }
  
      return sum;
    }
    catch(error) {
      console.log('Can\'t find sum in time interval provided for ' + track + ' track ' + error.message);
    }
  }

  /**
   * 
   * @param sum 
   * @param interval 
   * 
   * Pass a sum and a time interval (7 = week, 30 = month, etc) to find daily minutes
   */
  dailyMinutes(sum, interval) {
    try {
      let percent : number = ( sum === 0 || interval === 0 )? 0 : sum / interval;
      return percent;
    }
    catch(error) {
      console.log('Can\'t find daily minutes from ' + sum + ' / ' + interval + '. ' + error.message);
    }
  }

  /**
   * 
   * @param trackName 
   * @param sum 
   * @param interval 
   */
  dailyPercentage(trackName, sum, interval) {
    try {
      let track = this.findTrackByName(trackName);
      let timeGoal = track['time'];
      let percent = ( sum / timeGoal ) * 100;
      let dailyPercent : number = ( percent === 0 || interval === 0 )? 0 : percent / interval;
      return dailyPercent;
    }
    catch(error) {
      console.log('Can\'t find daily percentage from ' + trackName + ', ' + sum + ' & ' + interval + '. ' + error.message);
    }
  }

  /**
   * 
   * @param trackName 
   * @param sum 
   * 
   * Pass a track name and sum to find the overall percentage of the track completed.
   */
  percentOfEntireGoal(trackName, sum) {
    try {
      let track = this.findTrackByName(trackName);
      let timeGoal = track['time'] * 60;
      let percent : number = ( sum / timeGoal ) * 100;
      return percent;
    }
    catch(error) {
      console.log('Can\'t find daily percentage from ' + trackName['name'] + ' & ' + sum + '. ' + error.message);
    }
  }

  /**
   * 
   * @param numberOfDays 
   * 
   * Pass the number of days you want data on and the time completed for each day will be 
   * returned in a tidy array;
   */
  findRecentTime(trackName, numberOfDays) {
    try {
      let selected = this.findTrackByName(trackName);
      let recentTime : Array<any> = [];
      for (var i=0; i<numberOfDays; i++) {
          let timeEntry : any = this.timeInInterval(selected['name'], i, i);
          timeEntry = timeEntry / 60;
          timeEntry = timeEntry.toFixed(1)
          recentTime.push(timeEntry);
          recentTime.reverse();
      }
      return recentTime;
    }
    catch(error) {
      console.log('Can\'t find recent time from ' + numberOfDays + '. ' + error.message);
    }
  }

  findTrackByName(track) {
    try {
      for (var i=0; i<localStorage.length; i++) {
        var storedTrack = localStorage.getItem(localStorage.key(i))
        storedTrack = JSON.parse(storedTrack);
        if (storedTrack['name'] === track) {
          return storedTrack;
        }
      }
    }
    catch(error) {
      console.log('Unable to find ' + track + ' by name ' + error.message);
    }
  }

  overallCompleted(track) {
    try {
      var thisTrack = this.findTrackByName(track);
      let sum = 0;
      for (var i=0; i<thisTrack['dates'].length; i++) {
        // let recordedDate = thisTrack['dates'][i].recordedDate;
        sum += thisTrack['dates'][i].recordedMinutes;
      }
      return ( sum / ( thisTrack['time']  * 60) ) * 100;
    }
    catch(error) {
      console.log('Currently there\'s no selected track. ' + error.message);
    }
  }

  exportTrackData(trackName) {
    const email = prompt("Provide an email address to send this data to.");

    let trackData = this.formatTrackData(trackName);
    window.location.href = "mailto:" + email + "?subject=" + trackName + " Data&body=" + trackData + "";    
  }

  /**
   * 
   * @param trackName 
   * 
   * Get the track minutes and export them in an easy to read JSON file.
   */
  formatTrackData(trackName) {
    let trackDataOutput = 'Track name = ' + trackName + '%0D%0A%0D%0A';
    let track = localStorage.getItem(localStorage.key(trackName));
    let parsedTrack = JSON.parse(track);
    let trackDates = parsedTrack['dates'];

    let sortTrackDates = trackDates.sort(this.compareFunction);

    for (var i=0; i<trackDates.length; i++) {

      let itemDate = parsedTrack['dates'][i]['recordedDate'];
      let itemTime = parsedTrack['dates'][i]['recordedMinutes'];

      let trackDataString = itemDate + ' = ' + itemTime + '%0D%0A';
      trackDataOutput += trackDataString;
    }
    trackDataOutput += '%0D%0A' + track;
    return trackDataOutput;
  }
  
  /**
   * 
   * @param first 
   * @param second 
   * 
   * Sort track entries by date. First, these need to have hyphens
   * removed so we can properly parse them and then compare.
   */
  compareFunction(first, second) {
      let firstString = first.recordedDate.replace(/-/g, '');
      let secondString = second.recordedDate.replace(/-/g, '');
      return (parseInt(firstString) - parseInt(secondString));
  }

    /**
     * Handles name and time for goal, and updates the storage service to reflect the change.
     *
     * @param {string} name
     * @param {number} time
     */

    createNewGoal(goal: any) {

      // const nameCheck = this.nameCheck(this.name);
      // const timeCheck = this.timeCheck(this.time);
      // const button = <HTMLInputElement> document.getElementById("button");

      // if (nameCheck && timeCheck) {

      //   if (button.innerText == 'Submit') {
      //     this.goal = {
      //       name: this.name,
      //       time: this.time,
      //       selected: true,
      //       dates: []
      //     }
          localStorage.setItem(goal.name, JSON.stringify(goal));
      //   } else {
      //     this.track['name'] = this.name;
      //     this.track['time'] = this.time;
      //     localStorage.setItem(this.track['name'], JSON.stringify(this.track));
      //     const track = this.findTrackByName(this.goalTrackService.trackToEdit);
      //     localStorage.removeItem(track['name']);
      //   }
      //   this.name = '';
      //   this.time = null;
      //   this.router.navigateByUrl('/Input');
      // }
    }

}
