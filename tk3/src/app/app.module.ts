import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AppNewComponent } from '../pages/app-new/app-new.component';
import { AppInputComponent } from '../pages/app-input/app-input.component';
import { AppOutputComponent } from '../pages/app-output/app-output.component';
import { AppCalendarComponent } from '../pages/app-calendar/app-calendar.component';
import { AppListComponent } from '../pages/app-list/app-list.component';

import { GoalTrackService } from '../services/goal-track.service';
import { CalendarService } from '../services/calendar.service';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    AppNewComponent,
    AppInputComponent,
    AppOutputComponent,
    AppCalendarComponent,
    AppListComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    AppNewComponent,
    AppInputComponent,
    AppOutputComponent,
    AppCalendarComponent,
    AppListComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GoalTrackService,
    CalendarService
  ]
})
export class AppModule {}
IonicModule.forRoot(MyApp, {}, {
  links: [
    { component: AppInputComponent, name: 'Input', segment: 'Input' }
  ]
})
