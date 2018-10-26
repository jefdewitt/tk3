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

  public name;
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
    time: 0,
    editName: false,
    editTime: false
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

  deleteTrack(selectedTrack) {
    if (confirm('Are you sure you want to delete this track? It can\'t be recovered.')) {
      // const clickedTrack = this.name.nativeElement.innerText;
      // const trackName = $event.target.parentElement.children['0'].children['0'].innerText;
      const track: any = this.goalTrackService.findTrackByName(selectedTrack.name);
      localStorage.removeItem(track.name);

      for (let i = 0; i < this.tracks.length; i++) {
        if (track.name === this.tracks[i].name) {
          this.tracks.splice(i, 1);
        }
      }

      if (this.tracks.length === 0) {
        this.noTracks = true;
      }
    }
  }

  public editTrack($event) {
    this.makeSelectedTrack($event);
    // const track = this.goalTrackService.findSelectedTrack();
    this.goalTrackService.trackToEdit = this.track['name'];
  }

  public exportTrackData(trackName) {
    this.goalTrackService.exportTrackData(trackName);
  }

  public updateTrack(track: any, property: any ) {

    localStorage.removeItem(track.name);

    // Check if number starts with 0
    while (property.charAt(0) === '0') {
      property = property.substr(1);
    }
    const parsed: any = parseFloat(property);
    // parsed = (typeof parsed === 'number') ? 'number' : 'string';
    if ( parsed ) {
      track.time = property;
    } else {
      track.name = property;
    }

    track.selected = true;
    localStorage.setItem(track['name'], JSON.stringify(track));
    // const track = this.goalTrackService.findTrackByName(name);
    // console.log(this.track.name);
    // const trackItem = this.goalTrackService.findTrackByName(track.name);
    // track.name = this.track.name;
    console.log(track, property);


  }

  public editTrackDetails(track: any, property: string) {
    if (property === 'name') {
      track.editName = true;
    } else {
      track.editTime = true;
    }
  }

}

