import { Router } from '@angular/router';
import { Component, OnInit, Input, ViewChildren, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { GoalTrackService } from '../../services/goal-track.service';

@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.css']
})
export class AppListComponent implements OnInit, AfterViewChecked {

  @ViewChildren
  ('name') test: ElementRef;
  @Input()
  public receiver;

  // public name;
  public time;
  public track;
  public tracks: any;
  public noTracks = false;
  public nameSelected = false;
  public timeSelected = false;
  public test2;
  public name;

  public example = {
    dates: [],
    name: 'edit me',
    selected: true,
    time: 0,
    editName: false,
    editTime: false
  };

  constructor(
    private goalTrackService: GoalTrackService,
    private router: Router,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
    ) { }

  ngOnInit() {
    this.tracks = this.goalTrackService.getAllTracks();
    if (this.tracks.length === 0) {
      this.noTracks = true;
    }
    this.receiver = this.goalTrackService.event;
    this.receiver.subscribe( () => {
      this.noTracks = true;
    });

    this.track = this.goalTrackService.track;
  }

  ngAfterViewChecked() {
      this.test2 = this.test;
      if (this.test2.first) {
        this.test2.first.nativeElement.focus();
      }
      console.log(this.test2);
  }

  public createNew() {
    try {
      this.goalTrackService.createNewGoal(this.example);
      this.tracks = this.goalTrackService.getAllTracks();
      this.noTracks = false;
    } catch (error) {
      console.error('Could not create a new track. + error.message');
    }
  }

  /**
   *
   * Loop thru tracks from localstorage and turn the selected key
   * for the track clicked to true
   */
  public makeSelectedTrack(track) {
    try {
      console.log(track);
      // let clickedTrack;
      // clickedTrack = this.name.nativeElement.innerText;
      // console.log(clickedTrack);
      // if ($event.target.id === 'trackWrapper') {
      //   // const test = this.el.nativeElement.classList('.name');
      //   // console.log(this.name);
      //   clickedTrack = this.name.nativeElement.innerText;
      // } else {
      //   clickedTrack = this.name.nativeElement.innerText;
      // }
      this.track = track;
      this.goalTrackService.deselectTracks();
      for (let i = 0; i < localStorage.length; i++) {
        let storedTrack = localStorage.getItem(localStorage.key(i));
        storedTrack = JSON.parse(storedTrack);
        if (storedTrack['name'] === track.name) {
          storedTrack['selected'] = true;
          localStorage.setItem(storedTrack['name'], JSON.stringify(storedTrack));
          // if ($event.target.id === 'trackWrapper') {
          //   this.router.navigateByUrl('/Input');
          // } else {
          //   this.router.navigateByUrl('/New Track');
          // }
        }
      }
      // this.cdr.detectChanges();
    } catch (error) {
      console.log('Could not change selected track ' + error.message);
    }
  }

  findPercentCompleted(track) {
    const percentCompleted = this.goalTrackService.overallCompleted(track.name);
    if (track.name && percentCompleted) {
      return percentCompleted.toFixed(1);
    } else {
      return 0;
    }
  }

  deleteTrack(selectedTrack) {
    try {
      if (confirm('Are you sure you want to delete this track? It can\'t be recovered.')) {

        const track: any = this.goalTrackService.findTrackByName(selectedTrack.name);
        localStorage.removeItem(track.name);

        if (this.track.name === selectedTrack.name) {
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
      console.log('Could not delete track from local storage and/or class property.' + error.message);
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

