import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Track } from './interfaces/track.interface';
import { LocalStorageService } from './services/local-storage.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  track: any;

  constructor(
    private _localStorageService: LocalStorageService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.routeToListView();

    this._localStorageService.trackObservable$.subscribe( content => console.log( this.track = content ));
  }

  /**
   * If there's no selected tracks (i.e., 0 tracks) go the list track view.
   */
  private routeToListView() {
    try {
      this.router.navigateByUrl('/List Tracks');
    } catch (error) {
      console.log('Unable to reroute to List Track view ' + error.message);
    }
  }

}
