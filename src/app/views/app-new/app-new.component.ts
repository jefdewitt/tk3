import { GoalTrackService } from '../../services/goal-track.service';
import { Component, OnInit, Input } from '@angular/core';
import { Goal } from '../../goal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-new',
  templateUrl: './app-new.component.html',
  styleUrls: ['./app-new.component.css']
})

export class AppNewComponent implements OnInit {

  goal: Goal;
  name: string;
  time: number;
  editTrackTitle: string;
  editTrackTime: string;
  track: Object;

  constructor(private goalTrackService: GoalTrackService, private router: Router) { }

  ngOnInit() {
    if (this.goalTrackService.trackToEdit) {
      this.track = this.goalTrackService.track;
      this.editTrackTitle = 'Edit \'' + this.track['name'] + '\' here';
      this.editTrackTime = 'Edit \'' + this.track['time'] + '\' here';
      const button = <HTMLInputElement> document.getElementById('button');
      button.innerText = 'Update';
    }
  }

  // /**
  //    * Handles name and time for goal, and updates the storage service to reflect the change.
  //    *
  //    * @param {string} name
  //    * @param {number} time
  //    */

  // createNewGoal(name: string, time: number) {

  //   const nameCheck = this.goalTrackService.nameCheck(this.name);
  //   const timeCheck = this.goalTrackService.timeCheck(this.time);
  //   const button = <HTMLInputElement> document.getElementById("button");

  //   if (nameCheck && timeCheck) {

  //     if (button.innerText == 'Submit') {
  //       this.goal = {
  //         name: this.name,
  //         time: this.time,
  //         selected: true,
  //         dates: []
  //       }
  //       localStorage.setItem(this.goal.name, JSON.stringify(this.goal));
  //     } else {
  //       this.track['name'] = this.name;
  //       this.track['time'] = this.time;
  //       localStorage.setItem(this.track['name'], JSON.stringify(this.track));
  //       const track = this.goalTrackService.findTrackByName(this.goalTrackService.trackToEdit);
  //       localStorage.removeItem(track['name']);
  //     }
  //     this.name = '';
  //     this.time = null;
  //     this.router.navigateByUrl('/Input');
  //   }
  // }

}
