import { GoalTrackService } from './services/goal-track.service';
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
    GoalTrackService,
  ],
  bootstrap: [ AppComponent ],
  exports: [ AppRoutingModule ]
})
export class AppModule { }
