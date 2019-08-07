import { Component, OnInit } from '@angular/core';
import { GoalTrackService } from '../app/services/goal-track.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private goalTrackService: GoalTrackService, private router: Router) {

    this.router.events.subscribe((event: any) => {
      try {
        if (event.url) {
          if ( (event.url === '/New%20Track') || (event.url === '/List%20Tracks') ) {
              this.tkTitle = true;
          } else if ( (event.url !== '/New%20Track') || (event.url !== '/List%20Tracks') ) {
              this.track = this.goalTrackService.track;
              this.title = (this.track) ? this.track['name'] : 'Tracker';
              this.time = (this.track) ? this.track['time'] + ' hrs' : 'Keeper';
              this.tkTitle = false;
              if (this.title === 'Tracker') {
                this.selected = false;
              }
          }
        }
      } catch (error) {
        console.log('Unable to update track title ' + error.message);
      }
    });

  }

  track: Object;
  title: String;
  time: String;
  navItem: any;
  tkTitle: boolean;
  selected = true;
  // appTitle = 'TrackerKeeper';
  appTitle = 'TK3';

  ngOnInit() {
    this.routeToNewView();
   }

  /**
   * If there's no selected tracks (i.e., 0 tracks) go the list track view.
   */
  routeToNewView() {
    try {
      // const selectedTrack = this.goalTrackService.track;
      // if (!!selectedTrack && selectedTrack['name'] === 'null') {
        this.router.navigateByUrl('/List Tracks');
    } catch (error) {
      console.log('Unable to reroute to List Track view ' + error.message);
    }
  }

}
