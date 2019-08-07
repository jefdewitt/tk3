import { AppOutputComponent } from './views/app-output/app-output.component';
import { AppListComponent } from './views/app-list/app-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppInputComponent } from './views/app-input/app-input.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppIoComponent } from './views/app-io/app-io.component';
import { AppHelpComponent } from './views/app-help/app-help.component';

const routes: Routes = [
  { path: '', redirectTo: 'List Tracks', pathMatch: 'full' },
  { path: 'IO', component: AppIoComponent },
  { path: 'Input', component: AppInputComponent },
  { path: 'Track Output', component: AppOutputComponent },
  { path: 'List Tracks', component: AppListComponent },
  { path: 'Help', component: AppHelpComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ]
})
export class AppRoutingModule {}
