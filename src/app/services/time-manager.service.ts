import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeManagerService {

  constructor() { }

  public intervalOfDaysBetweenDates(date1: Date, date2: Date): number {
    const numberOfDaysBetweenDates: number = null;
    return numberOfDaysBetweenDates;
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

  public formatStringToDateObject(date: string): Date {
    const dateObject: Date = null;
    return dateObject;
  }

  /**
   *
   * @param daysAgo numbe
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
}
