import { Component, OnInit, ViewChild } from '@angular/core';
import { Track } from '../../interfaces/track.interface';
import { AppBarGraphComponent } from '../../shared/app-bar-graph/app-bar-graph.component';
import { AppInputFieldComponent } from '../../shared/app-input-field/app-input-field.component';
import { LocalStorageService } from '../../services/local-storage.service';
import {TrackManagerService} from '../../services/track-manager.service';

@Component({
  selector: 'app-io',
  templateUrl: './app-io.component.html',
  styleUrls: ['./app-io.component.css']
})
export class AppIoComponent implements OnInit {

  public noTracks = false;
  public track: Track;

  @ViewChild(AppBarGraphComponent) barGraph: AppBarGraphComponent;
  @ViewChild(AppInputFieldComponent) inputComp: AppInputFieldComponent;

  constructor(
    private _localStorageService: LocalStorageService,
    private _trackManagerService: TrackManagerService
  ) { }

  public ngOnInit() {
    this.track = this._localStorageService.findSelectedTrack();

    if (!this.track) {
      this.noTracks = true;
      this._trackManagerService.routeToListView();
    }
  }

  public updateDisplays(dataFromInputComp: string): void {
    this.inputComp.refreshCal();
    this.barGraph.ngOnInit();
  }

}
