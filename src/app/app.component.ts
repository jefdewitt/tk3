import { Component, OnInit } from '@angular/core';
import { Track } from './interfaces/track.interface';
import { LocalStorageService } from './services/local-storage.service';
import { TrackManagerService } from './services/track-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public track: Track;

  constructor(
    private _localStorageService: LocalStorageService,
    private _trackManagerService: TrackManagerService
    ) { }

  ngOnInit() {
    this._trackManagerService.routeToListView();
    this.track = this._localStorageService.findSelectedTrack();
  }

}
