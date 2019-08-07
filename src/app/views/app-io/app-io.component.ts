import { GoalTrackService } from '../../services/goal-track.service';
import { Component, ViewChild } from '@angular/core';
import { Track } from '../../interfaces/track.interface';
import { AppBarGraphComponent } from '../../shared/app-bar-graph/app-bar-graph.component';
import {AppInputFieldComponent} from '../../shared/app-input-field/app-input-field.component';

@Component({
  selector: 'app-io',
  templateUrl: './app-io.component.html',
  styleUrls: ['./app-io.component.css']
})
export class AppIoComponent {

  noTracks = false;
  public track: Track = this.goalTrackService.track;

  @ViewChild(AppBarGraphComponent) barGraph: AppBarGraphComponent;
  // @ViewChild(AppCalendarComponent) calendar: AppCalendarComponent;
  @ViewChild(AppInputFieldComponent) inputComp: AppInputFieldComponent;

  constructor( private goalTrackService: GoalTrackService ) {

    if (!this.track) {
      this.noTracks = true;
    }
  }

  public updateBarGraph(dataFromInputComp: string) {
    // this.barGraph.ngOnInit();
  }

  public updateDisplays(dataFromInputComp: string): void {
    this.inputComp.refreshCal();
    this.barGraph.ngOnInit();
  }

}
