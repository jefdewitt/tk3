import { Component, OnInit, Input, ViewChildren, ElementRef, AfterViewChecked } from '@angular/core';
import { Track } from '../../interfaces/track.interface';
import { LocalStorageService } from '../../services/local-storage.service';
import { TrackManagerService } from '../../services/track-manager.service';

@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.css']
})
export class AppListComponent implements OnInit, AfterViewChecked {

  @ViewChildren
  ('name') focusedName: ElementRef;
  @ViewChildren
  ('time') focusedTime: ElementRef;
  @Input()
  public receiver;

  public time;
  public track: Track;
  public tracks: any;
  public noTracks = false;
  public focusedNameInput;
  public focusedTimeInput;
  public name;

  constructor(
    private _localStorageService: LocalStorageService,
    private _trackManagerService: TrackManagerService
    ) { }

  ngOnInit() {
    this.track = this._trackManagerService.track;
    this.tracks = this._localStorageService.getAllTracks();
    if (this.tracks.length === 0) {
      this.noTracks = true;
    }
    this.receiver = this._trackManagerService.event;
    this.receiver.subscribe( () => {
      this.noTracks = true;
    });
  }

  /**
   * The logic contained in this lifecycle hook is related
   * to adding instant focus to an input field when its
   * label is clicked. We replace the label with an input
   * field for editing but since the input field had not
   * existed before it was difficult to add focus.
   */
  ngAfterViewChecked() {
      this.focusedNameInput = this.focusedName;
      if (this.focusedNameInput.first) {
        this.focusedNameInput.first.nativeElement.focus();
      }

      this.focusedTimeInput = this.focusedTime;
      if (this.focusedTimeInput.first) {
        this.focusedTimeInput.first.nativeElement.focus();
      }
  }

  public nameCheck(property: string) {
    this.tracks.forEach(function(track) {
      if ( track.name === property ) {
        alert('Do something');
      }
    });
  }

  public createNew() {
    try {
      this._trackManagerService.createNewTrack();
      this.tracks = this._localStorageService.getAllTracks();
      this.noTracks = false;
    } catch (error) {
      console.error('Could not create a new track. ' + error.message);
    }
  }

  public makeSelectedTrack(track) {
    if (this.track !== track) {
      this._localStorageService.makeSelectedTrack(track);
      this.track = track;
    }
  }

  public deleteTrack(track: Track) {
    try {
      if ( confirm('Are you sure you want to delete this track? It can\'t be recovered.') ) {

        this._localStorageService.deleteTrack(track);

        // Update class member to maintain localStorage sync.
        if (this.track.name === track.name) {
          this.track = null;
        }

        for (let i = 0; i < this.tracks.length; i++) {
          if (track.name === this.tracks[i].name) {
            this.tracks.splice(i, 1);
          }
        }

        if (this.tracks.length === 0) {
          this.noTracks = true;
        }

      }
    } catch (error) {
      console.log('Could not delete track from localStorage and/or class property. ' + error.message);
    }
  }

  public exportTrackData(track) {
    this._trackManagerService.exportTrackData(track);
  }

}

