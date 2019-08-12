import { Injectable } from '@angular/core';
import {Track} from '../interfaces/track.interface';

@Injectable({
  providedIn: 'root'
})
export class TrackManagerService {

  constructor() { }

  public sortTrackObjectTimesByDate(track: Track): Track {
    const sortedTrack = track;
    return sortedTrack;
  }

  public sumTrackObjectTimesByInterval(track: Track, interval: number): number {
    const summedTrackMinutes = track.time;
    return summedTrackMinutes;
  }

  public averageDailyCompletedMinutesByInterval(track: Track, interval: number): number {
    const averageTrackMinutes = track.time;
    return averageTrackMinutes;
  }

  public percentOfCompletedTrackByInterval(track: Track, interval: number): number {
    const percentOfTrackCompleted = track.time;
    return percentOfTrackCompleted;
  }
}
