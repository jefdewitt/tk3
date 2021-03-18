import {Component, OnInit} from '@angular/core';
import {Track} from '../../interfaces/track.interface';
import {TrackManagerService} from '../../services/track-manager.service';
import {LocalStorageService} from '../../services/local-storage.service';

@Component({
  selector: 'app-alert',
  templateUrl: './app-alert.component.html',
  styleUrls: ['./app-alert.component.css']
})
export class AppAlertComponent implements OnInit {

  public alertClass: string;

  constructor(
    private _trackManagerService: TrackManagerService,
    private _localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
  }

  public completionAlertTrigger(track: Track) {
    const completedPerc = this._trackManagerService.percentOfTrackCompletedInInterval(track);

    switch (true) {
      case (completedPerc >= 25 && completedPerc < 50):
        if ( this._isAlreadyInCompletionCategoryArray(track, 25) ) {
          this.alertClass = 'alert twenty-five';
          this._removeClass();
        }
        break;

      case (completedPerc >= 50 && completedPerc < 75):
        if ( this._isAlreadyInCompletionCategoryArray(track, 50) ) {
          this.alertClass = 'alert fifty';
          this._removeClass();
        }
        break;

      case (completedPerc >= 75 && completedPerc < 100):
        if ( this._isAlreadyInCompletionCategoryArray(track, 75) ) {
          this.alertClass = 'alert seventy-five';
          this._removeClass();
        }
        break;

      case (completedPerc >= 100):
        if ( this._isAlreadyInCompletionCategoryArray(track, 100) ) {
          this.alertClass = 'alert one-hundred';
          this._removeClass();
        }
        break;
    }
  }

  private _removeClass() {
    setTimeout( () => {
      this.alertClass = 'none';
    }, 3000);
  }

  private _isAlreadyInCompletionCategoryArray(track: Track, percentage: number): boolean {
    if ( !track.completionCategory.includes(percentage) ) {
      track.completionCategory.push(percentage);
      console.log('Greater than ' + percentage + '% done');
      this._localStorageService.saveTrack(track);
      return true;
    }
  }

}
