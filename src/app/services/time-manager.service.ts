import { Injectable } from '@angular/core';
import { Track } from '../interfaces/track.interface';

@Injectable({
  providedIn: 'root'
})
export class TimeManagerService {

  constructor( ) { }

  public intervalOfDaysBetweenDates(date1: any, date2: any): number {
    const type1 = typeof date1;
    const type2 = typeof date2;
    // Typed to any so we can do some maths on em
    let earliestDateObj: any;
    let latestDateObj: any;

    if (type1 === 'string') { earliestDateObj = this.formatStringToDateObject(date1); } else { earliestDateObj = date1; }
    if (type2 === 'string') { latestDateObj = this.formatStringToDateObject(date2); } else { latestDateObj = date2; }

    return Math.ceil((latestDateObj - earliestDateObj) / 86400000) + 1;
  }

  /**
   *
   * @param date Date
   *
   * Format a Date object to a string or create a new date string from
   * today's date if no parameter is called
   */
  public formatDateObjectToString(date?: Date): string {
    const dateObj = date ? date : new Date();
    let month: any = dateObj.getMonth() + 1; // getMonth is 0-based
    if (month < 10) { month = '0' + month; }
    let day: any = dateObj.getDate();
    if (day < 10) { day = '0' + day; }
    const year = dateObj.getFullYear();
    const stringDate = year + '-' + month + '-' + day;
    return stringDate;
  }

  /**
   *
   * @param date Date
   */
  private formatStringToDateObject(date: string): Date {
    const formattedDate = date.split('-').join('/');
    const dateObjectFromString = new Date(formattedDate);
    return dateObjectFromString;
  }

  /**
   *
   * @param daysAgo number
   *
   * Pass in a number to return the date string from as far
   * back as the time specified. 0-based so passing in 0
   * will return today's date in the format of YYYY-MM-DD
   */
  public stringDateOfNthDaysAgo(daysAgo: number): string {
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
   * @param track Track
   * @param datePlaceholder string
   *
   * This simply loops thru a track's dates property for matching dates provided from
   * the populateProgressBars function below and returns the time from that date.
   */
  public stringMinutesOfTimeEnteredNthDayAgo(track: Track, datePlaceholder: string): string {
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
   * @param time
   *
   * Take a date with format YYYY-MM-DD and reformat it to M/DD
   */
  public trimmedDate(time: string): string {
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
   * @param array Array<any>
   */
  public findMostTime(array: Array<any>): number {
    try {
      const timeArray: Array<any> = [];
      for (let i = 0; i < array.length; i++) {
        const time = array[i].time;
        timeArray.push(time);
      }
      const sortedArray = timeArray.sort(this.simpleCompareFunction);
      // Find the most time in the array
      const mostTime = sortedArray.pop();
      if (mostTime) {
        return mostTime;
      } else {
        return;
      }
    } catch (error) {
      console.log('Unable to find top time' + error.message);
    }
  }

  public simpleCompareFunction(a: number, b: number): number {
    return a - b;
  }
}
