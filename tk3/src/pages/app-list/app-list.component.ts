import { Component, OnInit } from '@angular/core';
import { GoalTrackService } from '../../services/goal-track.service';

@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html'
})
export class AppListComponent implements OnInit {

  tracks : any;
  noTracks : boolean;

  constructor(private goalTrackService : GoalTrackService) { }

  ngOnInit() {
    this.getAllTracks();
  }

  // Display all the tracks from localstorage
  getAllTracks() {
    try {
      this.tracks = [];
      for (var i=0; i<localStorage.length; i++) {
        var track = localStorage.getItem(localStorage.key(i))
        track = JSON.parse(track);
        this.tracks.push(track)
      }
      if (this.tracks.length > 0) {
        return this.tracks;
      } else {
        this.noTracks = true;
      }
    }
    catch(error) {
      console.log('Unable to retrive tracks list. ' + error.message);
    }
  }
  
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
        clickedTrack = $event.target.parentElement.children["0"].children['0'].innerText;
      }
      this.goalTrackService.deselectTracks();
      for (var i=0; i<localStorage.length; i++) {
        var storedTrack = localStorage.getItem(localStorage.key(i))
        storedTrack = JSON.parse(storedTrack);
        if (storedTrack['name'] === clickedTrack) {
          storedTrack['selected'] = true;
          localStorage.setItem(storedTrack['name'], JSON.stringify(storedTrack));
          if ($event.target.id === 'trackWrapper') {
            // this.router.navigateByUrl('/Input');
          } else {
            // this.router.navigateByUrl('/New Track');
          }
        }
      }
    }
    catch(error) {
      console.log('Could not change selected track ' + error.message);
    }
  }

  findPercentCompleted(trackName) {
    let percentCompleted = this.goalTrackService.overallCompleted(trackName);
    return percentCompleted.toFixed(1);
  }

  deleteTrack($event) {
    if (confirm('Are you sure you want to delete this track? It can\'t be recovered.')) {
      let track = $event.target.parentElement.children["0"].children["0"].innerText;
      this.goalTrackService.findTrackByName(track);
      localStorage.removeItem(track);
      this.getAllTracks();
    }
  }

  editTrack($event) {
    this.makeSelectedTrack($event);
    let track = this.goalTrackService.findSelectedTrack();
    this.goalTrackService.trackToEdit = track['name'];
  }

  exportTrackData(trackName) {
    this.goalTrackService.exportTrackData(trackName);
  }
}

