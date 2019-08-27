import { Component, OnInit } from '@angular/core';
import {Track} from '../../interfaces/track.interface';
import {TrackManagerService} from '../../services/track-manager.service';

@Component({
  selector: 'app-alert',
  templateUrl: './app-alert.component.html',
  styleUrls: ['./app-alert.component.css']
})
export class AppAlertComponent implements OnInit {

  constructor(private _trackManagerService: TrackManagerService) { }

  ngOnInit() {
  }

  public completionAlertTrigger(track: Track) {
    const completedPerc = this._trackManagerService.percentOfTrackCompletedInInterval(track);

    switch (true) {
      case (completedPerc >= 25):
        this._isAlreadyInCompletionCategoryArray(track, 25);
        break;

      case (completedPerc >= 50):
        this._isAlreadyInCompletionCategoryArray(track, 50);
        break;

      case (completedPerc >= 75):
        this._isAlreadyInCompletionCategoryArray(track, 75);
        break;

      case (completedPerc >= 100):
        this._isAlreadyInCompletionCategoryArray(track, 100);
        break;
      default:
        console.log('Less than 25% done');
    }
  }

  private _isAlreadyInCompletionCategoryArray(track: Track, percentage: number) {
    if ( !!track.completionCategory.indexOf(percentage) ) {
      track.completionCategory.push(percentage);
      console.log('Greater than ' + percentage + '% done');
    }
  }

}
