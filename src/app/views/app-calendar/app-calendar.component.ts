import { GoalTrackService } from './../../services/goal-track.service';
// import { CalendarService } from './services/calendar.service';
import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

// interface monthModel {
//   index: any;
//   weeks: Array<any>;
// }
// interface WeekDay {
//   date: any,
//   minutes: number
// }

@Component({
  selector: 'app-calendar',
  templateUrl: './app-calendar.component.html',
  styleUrls: ['./app-calendar.component.css']
})
export class AppCalendarComponent implements OnInit {

  constructor(private elementRef: ElementRef, private goalTrackService: GoalTrackService) { }

  // selector: any;
  // dateFromCal: string;
  // minutesFromCal: string;
  // hoursSelected: boolean;
  // options: Array<any>;

  public visible = false;
  public visibleAnimate = false;
  public state = 'Open';
  public track;

  public todayDate: Date = new Date();
  public curMonth: number = this.todayDate.getMonth() + 1;
  public curYear: number = this.todayDate.getFullYear();
  public weekdays: Array<any> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public twelveMonths: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
   'August', 'September', 'October', 'November', 'December'];
  public lastDayOfMonths = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  public monthString = this.twelveMonths[this.curMonth - 1];
  public newMonthDate = new Date(this.curYear, this.curMonth - 1, 1);
  public monthToDisplay;
  public weekdayThatMonthStartsOn;
  public weeks: Array<any> = [];
  public tableRows: Array<any> = [];
  public day;
  public month = {
    index: '',
    weeks: []
  };
  public displayMonth;
  public displayYear;
  public formattedMonth;
  public scanForToday = (this.curYear === this.todayDate.getFullYear() && this.curMonth === this.todayDate.getMonth() + 1 ) ?
          this.todayDate.getDate() : 0;
  public count = 0;
  public adjustedCount;
  public test = true;
  public toggle: boolean;

  ngOnInit() {
    this.track = this.goalTrackService.findSelectedTrack();
    this.determineWeekdayThatMonthStartsOn();
    this.monthAndYearOnDisplay();
    this.buildCal();
  }

  // This determines what cell in first row the month starts on (1-7)
  public determineWeekdayThatMonthStartsOn(year = this.curYear, month = this.curMonth) {
    const newMonthDate = new Date(year, month - 1, 1);
    this.weekdayThatMonthStartsOn = newMonthDate.getDay() + 1;
  }

  public monthAndYearOnDisplay(yearIndex = 0, monthIndex = 1) {
    this.displayMonth = this.twelveMonths[this.curMonth - monthIndex];
    this.displayYear = this.curYear - yearIndex;
  }

  public calcDaysInFeb() {
    return this.lastDayOfMonths[1] =
    ( ( (this.newMonthDate.getFullYear() % 100 !== 0)
    && (this.newMonthDate.getFullYear() % 4 === 0) )
    || (this.newMonthDate.getFullYear() % 400 === 0) ) ? 29 : 28;
  }

  public checkForToday(day) {
    if (day === this.scanForToday) {
      return 'today';
    } else {
      return 'days';
    }
  }

  // If the date is under 10 then add a 0 for proper date formatting
  public formatSingleDigitValues(value) {
    if (value > 0 && value < 10) {
      value = '0' + value;
    } else if (value < 1) {
      value = '00';
    }
    return value;
  }

  public buildCal(monthIndex = 1) {
    try {
      this.calcDaysInFeb();
      this.monthToDisplay = this.curMonth - monthIndex;
      this.month.index = this.monthToDisplay;
      this.weeks = [];
      for (let i = 1; i <= 42; i++) {

          const firstDay = ( (i - this.weekdayThatMonthStartsOn >= 0)
          && ( i - this.weekdayThatMonthStartsOn < this.lastDayOfMonths[this.monthToDisplay]) )
          ? i - this.weekdayThatMonthStartsOn + 1 : '';

          this.day = {
           date: firstDay,
           minutes: this.apiToPopCalWithTime(firstDay, this.monthToDisplay + 1)
          };
          // We push seven items at a time.
          this.weeks.push(this.day);

          // If the index is divisible by 7 then it's a week and we add another
          // week array to the month. Then, we clear out our weeks array.
          if ( ( i % 7 === 0 ) ) {
            this.tableRows.push(i);
            this.month.weeks.push(this.weeks);
            this.weeks = [];
          }
        }

    } catch (error) {
      console.log('Unable to build calendar ' + error.message);
    }
  }

  public resetAndChecks() {
    this.month.index = '';
    this.month.weeks = [];
    this.tableRows = [];
    this.checkForYearRollover(this.curMonth, this.count);
    this.determineWeekdayThatMonthStartsOn(this.curYear, this.curMonth - this.count);
  }

  public prevMonth() {
    this.count++;
    this.resetAndChecks();
    this.monthAndYearOnDisplay(0, this.count + 1);
    this.buildCal(this.count + 1);
  }

  public nextMonth() {
    this.count--;
    this.resetAndChecks();
    // Account for 0-based index error for setting months.
    this.adjustedCount = (this.count === -1) ? this.adjustedCount = 0 : this.adjustedCount = this.count + 1;
    this.monthAndYearOnDisplay(0, this.adjustedCount );
    this.buildCal(this.adjustedCount);
  }

  public checkForYearRollover (month: number, count: number) {
    if (month - count > 12) {
        this.curYear++;
        this.curMonth = 1;
        this.count = 0;
    } else if (month - count < 1) {
        this.curYear--;
        this.curMonth = 12;
        this.count = 0;
    }
  }

  public apiToPopCalWithTime(day, month) {
    // const selectedTrack = {
    //   name: 'test1',
    //   selected: true,
    //   time: '100',
    //   dates:
    //   [
    //     {
    //         recordedDate: '2018-02-19',
    //         recordedMinutes: 33
    //     },
    //     {
    //         recordedDate: '2018-10-26',
    //         recordedMinutes: 42
    //     }
    //   ]
    // };
    // use goal service to get localStorage object

    const compareDate = this.curYear + '-' + this.formatSingleDigitValues(month) + '-' + this.formatSingleDigitValues(day);

    for (let i = 0; i < this.track['dates'].length; i++) {

        const recordedDate = this.track['dates'][i].recordedDate;
        const recordedMinutes = this.track['dates'][i].recordedMinutes;

        if (compareDate === recordedDate) {
          return recordedMinutes;
        }
    }
  }

  public updateStorage(date, time) {
      console.log(date, time);

    const compareDate = this.curYear + '-' + this.formatSingleDigitValues(this.curMonth) + '-' + this.formatSingleDigitValues(date);

    for (let i = 0; i < this.track['dates'].length; i++) {

        const recordedDate = this.track['dates'][i].recordedDate;
        const recordedMinutes = this.track['dates'][i].recordedMinutes;

        if (compareDate === recordedDate) {
          localStorage.setItem(this.track['name'], JSON.stringify(this.track));
        }
      }
  }

  public showOrHide(toggle): void {

    if (toggle) {
      this.visible = true;
      setTimeout(() => this.visibleAnimate = true, 100);
      this.state = 'Close';
    } else {
      this.visibleAnimate = false;
      setTimeout(() => this.visible = false, 300);
      this.state = 'Open';
    }

  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.showOrHide(false);
    }
  }

}
