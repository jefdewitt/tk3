import { Router } from '@angular/router';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GoalTrackService } from '../../services/goal-track.service';

@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.css']
})
export class AppListComponent implements OnInit {

  // @ViewChild
  // ('name') name;
  @Input()
  public receiver;

  public time;
  public track;
  public tracks: any;
  public noTracks = false;
  public nameSelected = false;
  public timeSelected = false;

  public example = {
    dates: [],
    name: 'edit me',
    selected: true,
    time: 100
  };


  constructor(private goalTrackService: GoalTrackService, private router: Router) { }

  ngOnInit() {
    this.tracks = this.goalTrackService.getAllTracks();
    if (this.tracks.length === 0) {
      this.noTracks = true;
    }
    this.receiver = this.goalTrackService.event;
    this.receiver.subscribe( () => {
      this.noTracks = true;
    });

    this.track = this.goalTrackService.findSelectedTrack();
  }

  public createNew() {
    console.log('add button click');
    this.goalTrackService.createNewGoal(this.example);
    this.tracks = this.goalTrackService.getAllTracks();
    this.noTracks = false;
  }

  // Display all the tracks from localstorage
  // getAllTracks() {
  //   try {
  //     this.tracks = [];
  //     for (let i = 0; i < localStorage.length; i++) {
  //       let track = localStorage.getItem(localStorage.key(i));
  //       track = JSON.parse(track);
  //       this.tracks.push(track);
  //     }
  //     if (this.tracks.length > 0) {
  //       return this.tracks;
  //     } else {
  //       this.tracks = this.example;
  //       return this.tracks;
  //     }
  //   } catch (error) {
  //     console.log('Unable to retrive tracks list. ' + error.message);
  //   }
  // }

  /**
   *
   * Loop thru tracks from localstorage and turn the selected key
   * for the track clicked to true
   */
  makeSelectedTrack(name) {
    try {
      console.log(name);
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
      this.goalTrackService.deselectTracks();
      for (let i = 0; i < localStorage.length; i++) {
        let storedTrack = localStorage.getItem(localStorage.key(i));
        storedTrack = JSON.parse(storedTrack);
        if (storedTrack['name'] === name) {
          storedTrack['selected'] = true;
          localStorage.setItem(storedTrack['name'], JSON.stringify(storedTrack));
          // if ($event.target.id === 'trackWrapper') {
          //   this.router.navigateByUrl('/Input');
          // } else {
          //   this.router.navigateByUrl('/New Track');
          // }
        }
      }
    } catch (error) {
      console.log('Could not change selected track ' + error.message);
    }
  }

  findPercentCompleted(trackName) {
    if (trackName) {
      const percentCompleted = this.goalTrackService.overallCompleted(trackName);
      return percentCompleted.toFixed(1);
    }
  }

  deleteTrack($event) {
    if (confirm('Are you sure you want to delete this track? It can\'t be recovered.')) {
      const trackName = $event.target.parentElement.children['0'].children['0'].innerText;
      const track = this.goalTrackService.findTrackByName(trackName);
      localStorage.removeItem(trackName);

      for (let i = 0; i < this.tracks.length; i++) {
        if (trackName === this.tracks[i].name) {
          this.tracks.splice(i, 1);
        }
      }

      if (this.tracks.length === 0) {
        this.noTracks = true;
      }
    }
  }

  editTrack($event) {
    this.makeSelectedTrack($event);
    // const track = this.goalTrackService.findSelectedTrack();
    this.goalTrackService.trackToEdit = this.track['name'];
  }

  exportTrackData(trackName) {
    this.goalTrackService.exportTrackData(trackName);
  }

  public updateTrack() {
    // const track = this.goalTrackService.findTrackByName(name);
    // console.log(this.track.name);

  }
}

