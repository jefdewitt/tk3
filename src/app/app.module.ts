import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppCalendarComponent } from './shared/app-calendar/app-calendar.component';
import { AppListComponent } from './views/app-list/app-list.component';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppHelpComponent } from './views/app-help/app-help.component';
import { AppIoComponent } from './views/app-io/app-io.component';
import { AppInputFieldComponent } from './shared/app-input-field/app-input-field.component';
import { AppBarGraphComponent } from './shared/app-bar-graph/app-bar-graph.component';
import { AppListItemComponent } from './views/app-list/app-list-item/app-list-item.component';
import {TrackManagerService} from './services/track-manager.service';
import {TimeManagerService} from './services/time-manager.service';
import {LocalStorageService} from './services/local-storage.service';


@NgModule({
  declarations: [
    AppComponent,
    AppListComponent,
    AppListItemComponent,
    AppHelpComponent,
    AppIoComponent,
    AppInputFieldComponent,
    AppCalendarComponent,
    AppBarGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    TrackManagerService,
    TimeManagerService,
    LocalStorageService
  ],
  bootstrap: [ AppComponent ],
  exports: [ AppRoutingModule ]
})
export class AppModule { }
