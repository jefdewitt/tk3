import { Injectable } from '@angular/core';
import {Track} from '../interfaces/track.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public saveTrack(track: Track): void {

  }

  public deleteTrack(trackName: string): void {

  }

  public findTrack(trackName: string): Track {
    const track: Track = null;
    return track;
  }

  public getAllTracks(): Track[] {
    const allTracks: Track[] = null;
    return allTracks;
  }
}
