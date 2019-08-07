import {Component, Input, OnInit} from '@angular/core';
import {Track} from '../../../interfaces/track.interface';
import {GoalTrackService} from '../../../services/goal-track.service';

@Component({
  selector: 'app-list-item',
  templateUrl: './app-list-item.component.html',
  styleUrls: ['./app-list-item.component.css']
})
export class AppListItemComponent implements OnInit {

  // public track: Track;
  public disabled = false;
  @Input() public individualTrack: Track;

  constructor( private goalTrackService: GoalTrackService ) { }

  ngOnInit() {
    // this.track = this.goalTrackService.track;
    console.log(this.individualTrack);
  }

  public updateTrackName(event, track: any, property: any ) {

    let nameIsNotTaken;

    if (event.type === 'blur') {
      nameIsNotTaken = this.goalTrackService.nameCheck(property);
    }

    if (nameIsNotTaken) {
      const formerName = track.name;
      track.name = property === '' ? formerName : property;

      localStorage.setItem(track['name'], JSON.stringify(track));
      localStorage.removeItem(formerName);
    }

    track.editName = false;

    setTimeout( () => {
      this.disabled = false;
    }), 500;
  }

  public updateTrackTime(track: any, property: any ) {
    // Check if number starts with 0
    if (property.charAt(0) === '0') {
      property = parseFloat(property);
    }

    track.time = property > 0 ? property : 0;
    localStorage.setItem(this.individualTrack['name'], JSON.stringify(track));

    track.editTime = false;

    setTimeout( () => {
      this.disabled = false;
    }), 500
  }

  public editTrackDetails(track: any, property: string) {
    console.log('editTrackDetails clicked')
    this.disabled = true;

    if (property === 'name') {
      track.editName = true;

    } else {
      track.editTime = true;
    }
  }

  public updateName(event, track, name) {
    if (event.keyCode === 13) {
      this.updateTrackName(event, track, name);
    }
  }

  public updateTime(event, track, time) {
    if (event.keyCode === 13) {
      this.updateTrackTime(track, time);
    }
  }

  public findPercentCompleted(track): any {
    return this.goalTrackService.overallCompleted(track);
  }

}
