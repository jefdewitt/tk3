// import { Router } from '@angular/router';
import { Component, OnInit, Input, ViewChildren, ElementRef, AfterViewChecked } from '@angular/core';
import { GoalTrackService } from '../../services/goal-track.service';

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
  public track;
  public tracks: any;
  public noTracks = false;
  public nameSelected = false;
  public timeSelected = false;
  public focusedNameInput;
  public focusedTimeInput;
  public name;

  constructor(
    private goalTrackService: GoalTrackService,
    ) { 
      // this.focusedElement = this.focusedName;
      // if (!!this.focusedElement) {
      //   this.focusedElement.first.nativeElement.focus();
      // }
    }

  ngOnInit() {
    this.tracks = this.goalTrackService.getAllTracks();
    if (this.tracks.length === 0) {
      this.noTracks = true;
    }
    this.receiver = this.goalTrackService.event;
    this.receiver.subscribe( () => {
      this.noTracks = true;
    });

    this.goalTrackService.findSelectedTrack().subscribe((track) => {
      this.track = track;
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

  public createNew() {
    try {
      this.goalTrackService.createNewTrack();
      this.tracks = this.goalTrackService.getAllTracks();
      this.noTracks = false;
    } catch (error) {
      console.error('Could not create a new track.' + error.message);
    }
  }

  findPercentCompleted(track) {
    return this.goalTrackService.overallCompleted(track);
  }

  public makeSelectedTrack(track) {
    if (this.track !== track) {
      this.goalTrackService.makeSelectedTrack(track);
      this.track = track;
    }
  }

  public deleteTrack(track) {
    try {
      if (confirm('Are you sure you want to delete this track? It can\'t be recovered.')) {

        this.goalTrackService.deleteTrack(track);

        // Update class member to maintain localStorage sync.
        if (this.track.name === track.name) {
          this.track = '';
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
      console.log('Could not delete track from localStorage and/or class property.' + error.message);
    }
  }

  public editTrack($event) {
    this.makeSelectedTrack($event);
    this.goalTrackService.trackToEdit = this.track['name'];
  }

  public exportTrackData(trackName) {
    this.goalTrackService.exportTrackData(trackName);
  }

  public updateTrackName(track: any, property: any ) {

    const formerName = track.name;
    track.name = property;

    localStorage.setItem(track['name'], JSON.stringify(track));
    localStorage.removeItem(formerName);

  }

  public updateTrackTime(track: any, property: any ) {

      // Check if number starts with 0
      if (property.charAt(0) === '0') {
        property = parseFloat(property);
      }

      track.time = property;
      localStorage.setItem(this.track['name'], JSON.stringify(track));

  }

  public editTrackDetails(track: any, property: string) {
    if (property === 'name') {
      track.editName = true;

    } else {
      track.editTime = true;
    }
  }

}

