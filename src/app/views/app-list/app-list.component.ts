import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GoalTrackService } from '../../services/goal-track.service';

@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.css']
})
export class AppListComponent implements OnInit {

  public tracks: any;
  public noTracks = false;
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
  }

  public createNew() {
    this.goalTrackService.createNewGoal(this.example);
    this.tracks = this.goalTrackService.getAllTracks();
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
  makeSelectedTrack($event) {
    try {
      let clickedTrack;
      if ($event.target.id === 'trackWrapper') {
        clickedTrack = $event.target.firstElementChild.innerText;
      } else {
        clickedTrack = $event.target.parentElement.children['0'].children['0'].innerText;
      }
      this.goalTrackService.deselectTracks();
      for (var i=0; i<localStorage.length; i++) {
        var storedTrack = localStorage.getItem(localStorage.key(i))
        storedTrack = JSON.parse(storedTrack);
        if (storedTrack['name'] === clickedTrack) {
          storedTrack['selected'] = true;
          localStorage.setItem(storedTrack['name'], JSON.stringify(storedTrack));
          if ($event.target.id === 'trackWrapper') {
            this.router.navigateByUrl('/Input');
          } else {
            this.router.navigateByUrl('/New Track');
          }
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
        if (i === 0) {
          this.noTracks = true;
        }
      }
    }
  }

  editTrack($event) {
    this.makeSelectedTrack($event);
    const track = this.goalTrackService.findSelectedTrack();
    this.goalTrackService.trackToEdit = track['name'];
  }

  exportTrackData(trackName) {
    this.goalTrackService.exportTrackData(trackName);
  }
}

