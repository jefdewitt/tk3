import { Component } from '@angular/core';

// import { AboutPage } from '../about/about';
// import { ContactPage } from '../contact/contact';
// import { HomePage } from '../home/home';
import { AppNewComponent } from '../app-new/app-new.component';
import { AppInputComponent } from '../app-input/app-input.component';
import { AppOutputComponent } from '../app-output/app-output.component';
import { AppCalendarComponent } from '../app-calendar/app-calendar.component';
import { AppListComponent } from '../app-list/app-list.component';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AppNewComponent;
  tab2Root = AppInputComponent;
  tab3Root = AppOutputComponent;
  tab4Root = AppCalendarComponent;
  tab5Root = AppListComponent;

  constructor() {

  }
}
