import { GoalTrackService } from './../../services/goal-track.service';
import { Component, OnInit, ElementRef, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './app-calendar.component.html',
  styleUrls: ['./app-calendar.component.css']
})
export class AppCalendarComponent implements OnInit {

  constructor(
    private elementRef: ElementRef,
    private goalTrackService: GoalTrackService)
    { }

  public todayDate: Date = new Date();

  // Template bound vars
  public displayMonth;
  public displayYear;
  public weekdays: Array<string> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public month = {
    index: '',
    weeks: []
  };
  public curYear: number = this.todayDate.getFullYear();
  public monthToDisplay;
  public hours = false;

  // Used in main calendar build method
  private weeks: Array<any> = [];
  private tableRows: Array<any> = [];
  private weekdayThatMonthStartsOn;
  private lastDayOfMonths = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  private day;

  private visible = false;
  private visibleAnimate = false;
  private state = 'Open';
  private track;
  private curMonth: number = this.todayDate.getMonth() + 1;
  private twelveMonths: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
   'August', 'September', 'October', 'November', 'December'];
  private newMonthDate = new Date(this.curYear, this.curMonth - 1, 1);
  private formattedMonth;
  private scanForToday = (this.curYear === this.todayDate.getFullYear() && this.curMonth === this.todayDate.getMonth() + 1 ) ?
          this.todayDate.getDate() : 0;
  private count = 0;
  private adjustedCount;
  private edit = true;
  private toggle: boolean;

  // Used exclusively for adding focus to an input on init (input init not class init).
  @ViewChildren
  ('time') focusedTime: ElementRef;
  private focusedTimeInput

  ngOnInit() {
    this.track = this.goalTrackService.track;
    this.determineWeekdayThatMonthStartsOn();
    this.monthAndYearOnDisplay();
    this.buildCal();
  }

  /**
   * The logic contained in this lifecycle hook is related
   * to adding instant focus to an input field when its
   * label is clicked. We replace the label with an input 
   * field for editing but since the input field had not 
   * existed before it was difficult to add focus. 
   */ 
  ngAfterViewChecked() {
    this.focusedTimeInput = this.focusedTime;
    if (this.focusedTimeInput.first) {
      this.focusedTimeInput.first.nativeElement.focus();
    }
  }

  /**
   * 
   * @param year 
   * @param month
   * 
   * This determines what cell in first row the month starts on (1-7). 
   */
  public determineWeekdayThatMonthStartsOn(year = this.curYear, month = this.curMonth) {
    // Get first day of month as a new date object.
    const newMonthDate = new Date(year, month - 1, 1);
    // Get the day (1-7) that the first day of the month starts on.
    this.weekdayThatMonthStartsOn = newMonthDate.getDay() + 1;
  }

  /**
   * 
   * @param yearIndex 
   * @param monthIndex 
   * 
   * Determines what strings to show in the template.
   */
  public monthAndYearOnDisplay(yearIndex = 0, monthIndex = 1) {
    this.displayMonth = this.twelveMonths[this.curMonth - monthIndex];
    this.displayYear = this.curYear - yearIndex;
  }

  /**
   * Yep, just calculate the # of days in February for the year in question.
   */
  public calcDaysInFeb() {
    return this.lastDayOfMonths[1] =
    ( ( (this.newMonthDate.getFullYear() % 100 !== 0)
    && (this.newMonthDate.getFullYear() % 4 === 0) )
    || (this.newMonthDate.getFullYear() % 400 === 0) ) ? 29 : 28;
  }

  /**
   * 
   * @param day 
   * 
   * Just lookin' for the td in the calendar that matches today's date.
   */
  public checkForToday(day) {
    if (day === this.scanForToday) {
      return 'today';
    } else {
      return 'days';
    }
  }

  /**
   * If the date is under 10 then add a 0 for proper date formatting.
   * This method is used in the template multiple times and is not
   * great for optimiation/efficiency.
   */
  public formatSingleDigitValues(value) {
    if (value > 0 && value < 10) {
      value = '0' + value;
    } else if (value < 1) {
      value = '00';
    }
    return value;
  }

  /**
   * 
   * @param monthIndex number;
   * 
   * This builds the flippin calendar. Its one parameter is used
   * when cycling between months.
   */
  public buildCal(monthIndex: number = 1) {
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
           minutes: this.apiToPopCalWithTime(firstDay, this.monthToDisplay + 1) ?
            this.apiToPopCalWithTime(firstDay, this.monthToDisplay + 1) : 0,
           edit: false
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

  /**
   * Cleans the slate for building a new month.
   */
  public resetAndChecks() {
    this.month.index = '';
    this.month.weeks = [];
    this.tableRows = [];
    this.checkForYearRollover(this.curMonth, this.count);
    this.determineWeekdayThatMonthStartsOn(this.curYear, this.curMonth - this.count);
  }

  // Last month
  public prevMonth() {
    this.count++;
    this.resetAndChecks();
    this.monthAndYearOnDisplay(0, this.count + 1);
    this.buildCal(this.count + 1);
  }

  // Next month
  public nextMonth() {
    this.count--;
    this.resetAndChecks();
    // Account for 0-based index error for setting months.
    this.adjustedCount = (this.count === -1) ? this.adjustedCount = 0 : this.adjustedCount = this.count + 1;
    this.monthAndYearOnDisplay(0, this.adjustedCount );
    this.buildCal(this.adjustedCount);
  }

  /**
   * 
   * @param month 
   * @param count 
   * 
   * When moving forward/backwards thru months, determine if we're
   * in another year -- last year/next year, etc.
   */
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

  /**
   * 
   * @param day 
   * @param month
   * 
   * This guy hooks into the local storage object. Pass a day and month
   * to it to build the proper days/weeks/month.
   */
  public apiToPopCalWithTime(day, month) {

    const compareDate = this.curYear + '-' + this.formatSingleDigitValues(month) + '-' + this.formatSingleDigitValues(day);

    for (let i = 0; i < this.track['dates'].length; i++) {

        const recordedDate = this.track['dates'][i].recordedDate;
        const recordedMinutes = this.track['dates'][i].recordedMinutes;

        if (compareDate === recordedDate) {
          return recordedMinutes;
        }
    }
  }

  /**
   *
   * @param date string
   * @param day number
   * @param time string
   *
   * This method is called when clicking on a calendar data cell.
   *
   * Takes an actual formatted year/month/day date string, a day
   * that represents the number of the day in that month, and the
   * time entered when you click on a calendar cell.
   */
  public updateStorage(date, day, time) {

    const minutes = this.goalTrackService.minutesOrHours(this.hours, time);
    if (minutes) {
      this.goalTrackService.updateTrackTimeInStorage(date, day, minutes);
      day.minutes = time;
      day.edit = false;
    }

  }

    /**
   * 
   * @param event 
   * @param date 
   * @param day 
   * @param time 
   * 
   * On Enter key presses, update storage.
   */
  public updateTime(event, date, day, time) {
    if (event.keyCode === 13) {
      this.updateStorage(date, day, time)
    }
  }

  /** CALENDAR TOGGLE LOGIC */

  /**
   * 
   * @param toggle 
   * 
   * Toggle the calendar open/close.
   */
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

  /**
   * 
   * @param event 
   * 
   * Listen for modal clicks.
   */
  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.showOrHide(false);
    }
  }

  /**
   * 
   * @param day 
   * 
   * Show the input field on the the clicked calendar cell.
   */
  public editDateEntryTime(day) {

    if (day.date !== '') {

      for (let i = 0; i < this.month.weeks.length; i++) {
        for (let j = 0; j <  this.month.weeks[i].length; j++) {
          this.month.weeks[i][j].edit = false;
        }
      }
      day.edit = true;
    }
  }

  /**
   * 
   * @param hours 
   * 
   * All we're doing here is converting the time displayed in the 
   * cal from min to hrs & vice versa. Hours is a boolean set by
   * selecting a checkbox.
   */
  public changeTimeFrame(hours: boolean): void {
    this.month.weeks.forEach(element => {
      element.forEach(item => {
        if (item.minutes > 0 && hours) {
          item.minutes = item.minutes / 60;
        } else {
          item.minutes = item.minutes * 60;
        }
      })
    });
  }

}
