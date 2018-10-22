import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppListComponent } from './app-list.component';
import { FormsModule } from '@angular/forms';
import { CalendarService } from '../../services/calendar.service';
import { GoalTrackService } from '../../services/goal-track.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppListComponent', () => {
  let component: AppListComponent;
  let fixture: ComponentFixture<AppListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        AppListComponent 
      ],
      imports: [
        FormsModule,
        RouterTestingModule
      ],
      providers: [ 
        CalendarService,
        GoalTrackService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
