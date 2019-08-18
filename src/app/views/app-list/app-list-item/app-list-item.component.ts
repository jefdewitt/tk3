import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Track} from '../../../interfaces/track.interface';
import {LocalStorageService} from '../../../services/local-storage.service';
import {TrackManagerService} from '../../../services/track-manager.service';
import {track} from '../../../models/trackItemModel';

@Component({
  selector: 'app-list-item',
  templateUrl: './app-list-item.component.html',
  styleUrls: ['./app-list-item.component.css']
})
export class AppListItemComponent implements OnInit {

  public percentage: number;
  public disabled = false;
  @Input() public individualTrack: Track;
  @Output() public toParent: EventEmitter<Track> = new EventEmitter<Track>();

  constructor(
    private _localStorageService: LocalStorageService,
    private _trackManagerService: TrackManagerService
    ) { }

  ngOnInit() {
    this.setPercentageImage();
    this.individualTrack.editName = false;
  }

  private setPercentageImage(): void {
    const percentageString = this.findPercentCompleted(this.individualTrack);
    const percentage = parseInt(percentageString, 10);
    switch (true) {
      case (percentage < 21):
        this.percentage = 20;
        break;
      case (percentage < 31):
        this.percentage = 30;
        break;
      case (percentage < 51):
        this.percentage = 50;
        break;
      case (percentage < 61):
        this.percentage = 60;
        break;
      case (percentage < 81):
        this.percentage = 80;
        break;
      case (percentage < 100):
        this.percentage = 90;
        break;
      default:
        this.percentage = 100;
    }
  }

  public updateTrackName(event, track: Track, newName: any ) {
    // this._localStorageService.makeSelectedTrack(track);

    let nameIsNotTaken;

    if (event.type === 'change') {
      nameIsNotTaken = this._localStorageService.isNameAlreadyTaken(newName);
    }

    if (nameIsNotTaken) {
      const formerTrack = this._localStorageService.findTrackgitByName(track.name);
      const newTrack: Track = track;
      newTrack.name = newName;

      this._localStorageService.saveTrack(newTrack);
      this._localStorageService.deleteTrack(formerTrack);
      this.toParent.emit(newTrack);
    }

    track.editName = false;

    setTimeout( () => {
      this.disabled = false;
    }, 500);
  }

  public updateTrackTime(track: Track, property: any ) {
    // Check if number starts with 0
    if (property.charAt(0) === '0') {
      property = parseFloat(property);
    }

    track.time = property > 0 ? property : 0;
    this._localStorageService.saveTrack(track);

    track.editTime = false;

    setTimeout( () => {
      this.disabled = false;
    }, 500);
  }

  public editTrackDetails(track: any, property: string) {
    this._localStorageService.makeSelectedTrack(track);
    this.disabled = true;

    if (property === 'name') {
      track.editName = true;

    } else {
      track.editTime = true;
    }
  }

  public updateName(event, track, name) {
    if (event.keyCode === 13) {
      this.updateTrackName(event, track, name);
    }
  }

  public updateTime(event, track, time) {
    if (event.keyCode === 13) {
      this.updateTrackTime(track, time);
    }
  }

  public findPercentCompleted(track): any {
    return this._trackManagerService.percentOfTrackCompletedInInterval(track);
  }

}
