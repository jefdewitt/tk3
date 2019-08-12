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

  public formatDateObjectToString(date: Date): string {
    const stringDate: string = null;
    return stringDate;
  }

  public formatStringToDateObject(date: string): Date {
    const dateObject: Date = null;
    return dateObject;
  }
}
