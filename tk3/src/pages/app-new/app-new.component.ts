import { GoalTrackService } from '../../services/goal-track.service';
import { Component, OnInit } from '@angular/core';
import { Goal } from '../../goal';

@Component({
  selector: 'app-app-new',
  templateUrl: './app-new.component.html'
})

export class AppNewComponent implements OnInit {

  goal : Goal;
  name : string;
  time : number;
  editTrackTitle : string;
  editTrackTime : string;
  track : Object;

  constructor(private goalTrackService : GoalTrackService) { }

  ngOnInit() {
    if (this.goalTrackService.trackToEdit) {
      this.track = this.goalTrackService.findSelectedTrack();
      this.editTrackTitle = 'Edit \'' + this.track['name'] + '\' here';
      this.editTrackTime = 'Edit \'' + this.track['time'] + '\' here';
      let button = <HTMLInputElement> document.getElementById("button");
      button.innerText = 'Update';
    }
  }

  /**
     * Handles name and time for goal, and updates the storage service to reflect the change.
     *
     * @param {string} name
     * @param {number} time
     */

  createNewGoal(name: string, time: number) {

    let nameCheck = this.goalTrackService.nameCheck(this.name);
    let timeCheck = this.goalTrackService.timeCheck(this.time);
    let button = <HTMLInputElement> document.getElementById("button");
    
    if (nameCheck && timeCheck) {

      if (button.innerText == 'Submit') {
        this.goal = {
          name: this.name,
          time: this.time,
          selected: true,
          dates: []
        }
        localStorage.setItem(this.goal.name, JSON.stringify(this.goal));
      } else {
        this.track['name'] = this.name;
        this.track['time'] = this.time;
        localStorage.setItem(this.track['name'], JSON.stringify(this.track));
        let track = this.goalTrackService.findTrackByName(this.goalTrackService.trackToEdit);
        localStorage.removeItem(track['name']);
      }
      this.name = '';
      this.time = null;
      // this.router.navigateByUrl('/Input');
    }
  }

}
