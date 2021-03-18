import { Component, OnInit, ViewChild } from '@angular/core';
import { Track } from '../../interfaces/track.interface';
import { AppBarGraphComponent } from '../../shared/app-bar-graph/app-bar-graph.component';
import { AppInputFieldComponent } from '../../shared/app-input-field/app-input-field.component';
import { LocalStorageService } from '../../services/local-storage.service';
import {AppAlertComponent} from '../../shared/app-alert/app-alert.component';

@Component({
  selector: 'app-io',
  templateUrl: './app-io.component.html',
  styleUrls: ['./app-io.component.css']
})
export class AppIoComponent implements OnInit {

  public track: Track;
  public hours = false;

  @ViewChild(AppBarGraphComponent) barGraph: AppBarGraphComponent;
  @ViewChild(AppInputFieldComponent) inputComp: AppInputFieldComponent;
  @ViewChild(AppAlertComponent) alert: AppAlertComponent;

  constructor(
    private _localStorageService: LocalStorageService
  ) { }

  public ngOnInit() {

    this.track = this._localStorageService.findSelectedTrack();
  }

  public updateDisplays(dataFromInputComp: boolean): void {
    this.inputComp.refreshCal();
    this.barGraph.ngOnInit();
    this.alert.completionAlertTrigger(this.track);

    if (dataFromInputComp) {
      this.updateGraph(dataFromInputComp);
    }
  }

  public minutesOrHours(hours: boolean) {

    this.barGraph.toggleMinutesOrHours(hours);

    if (!this.hours) {
      this.hours = true;
    } else {
      this.hours = false;
    }
  }

  public updateGraph(hours: boolean) {
    this.barGraph.toggleMinutesOrHours(hours, true);
  }

}
