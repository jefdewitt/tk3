import { Component } from '@angular/core';
import { Track } from './interfaces/track.interface';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public track: Track;

  constructor(
    private _localStorageService: LocalStorageService
    ) { }

  public checkForTrack(): Track {
    this.track = this._localStorageService.findSelectedTrack();
    return this._localStorageService.findSelectedTrack();
  }

}
