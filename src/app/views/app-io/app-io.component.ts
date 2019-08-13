import { Component, ViewChild } from '@angular/core';
import { Track } from '../../interfaces/track.interface';
import { AppBarGraphComponent } from '../../shared/app-bar-graph/app-bar-graph.component';
import {AppInputFieldComponent} from '../../shared/app-input-field/app-input-field.component';
import {TrackManagerService} from '../../services/track-manager.service';

@Component({
  selector: 'app-io',
  templateUrl: './app-io.component.html',
  styleUrls: ['./app-io.component.css']
})
export class AppIoComponent {

  noTracks = false;
  public track: Track = this._trackManagerService.track;

  @ViewChild(AppBarGraphComponent) barGraph: AppBarGraphComponent;
  @ViewChild(AppInputFieldComponent) inputComp: AppInputFieldComponent;

  constructor(
    private _trackManagerService: TrackManagerService
    ) {
    if (!this.track) {
      this.noTracks = true;
    }
  }

  public updateDisplays(dataFromInputComp: string): void {
    this.inputComp.refreshCal();
    this.barGraph.ngOnInit();
  }

}
