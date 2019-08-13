import { Injectable } from '@angular/core';
import { Track } from '../interfaces/track.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public track: Track;

  // create observable
  public trackObservable$ = new Observable((observer) => {

    // observable execution
    console.log('observable observed')
    observer.next(this.track);
    observer.complete();
  });

  constructor() {
    this.findSelectedTrack();
  }

  /**
   *
   * @param track
   *
   * Saves a track to local storage
   */
  public saveTrack(track: Track): void {
    localStorage.setItem(this.track['name'], JSON.stringify(this.track));
  }

  /**
   *
   * @param track Track
   *
   * Deletes a track from local storage
   */
  public deleteTrack(track: Track): void {
    localStorage.removeItem(track.name);
  }

  /**
   *
   * @param track Track
   *
   * Finds a track in local storage by its name string
   */
  public findTrackByName(track: Track) {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        let storedTrack = localStorage.getItem(localStorage.key(i));
        storedTrack = JSON.parse(storedTrack);
        if (storedTrack['name'] === track) {
          return storedTrack;
        }
      }
    } catch (error) {
      console.log('Unable to find ' + track + ' by name ' + error.message);
    }
  }

  /**
   *
   * @param track Track
   *
   * Loop thru tracks from localstorage and turn the selected key
   * for the track clicked to true
   */
  public makeSelectedTrack(track: Track) {
    try {
      this.track = track;
      this.deselectTracks();
      for (let i = 0; i < localStorage.length; i++) {
        let storedTrack = localStorage.getItem(localStorage.key(i));
        storedTrack = JSON.parse(storedTrack);
        if (storedTrack['name'] === track.name) {
          storedTrack['selected'] = true;
          localStorage.setItem(storedTrack['name'], JSON.stringify(storedTrack));
          this.findSelectedTrack();
        }
      }
    } catch (error) {
      console.log('Could not change selected track ' + error.message);
    }
  }

  /**
   * Returns the current selected track
   *
   * @return Observable
   */
  public findSelectedTrack(): Track {
    console.log('findSelectedTrack')
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const trackString = localStorage.getItem(localStorage.key(i));
        const track = JSON.parse(trackString);
        if (track['selected'] === true) {
          this.track = track;
          return track;
        }
      }
    } catch (error) {
      console.log('Currently there\'s no selected track. ' + error.message);
    }
  }

  /**
   * Defaults all track's selected property to false
   */
  public deselectTracks(): void {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        let track = localStorage.getItem(localStorage.key(i));
        track = JSON.parse(track);
        track['selected'] = false;
        localStorage.setItem(track['name'], JSON.stringify(track));
      }
    } catch (error) {
      console.log('Deselecting tracks failed. ' + error.message);
    }
  }

  /**
   * Returns all the tracks in local storage
   */
  public getAllTracks(): Track[] {
    try {
      const allTracks: Track[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const track: string = localStorage.getItem(localStorage.key(i));
        const trackObj: Track  = JSON.parse(track);
        allTracks.push(trackObj);
      }
      return allTracks;
    } catch (error) {
      console.log('Unable to retrive tracks list. ' + error.message);
    }
  }

  /**
   *
   * @param name string
   *
   * Confirms no other tracks exist with desired name
   */
  public isNameAlreadyTaken(name: string): boolean {
    try {
      if (name) {
        if (localStorage.length > 1) {
          for (let i = 0; i < localStorage.length; i++) {
            let track = localStorage.getItem(localStorage.key(i));
            track = JSON.parse(track);
            if (name === track['name']) {
              alert('This track already exists. Please choose a different name.');
              return false;
            } else if (name === '') {
              alert('Please choose a name.');
              return false;
            } else if (i === (localStorage.length - 1)) {
              this.deselectTracks();
              return true;
            }
          }
        } else {
          this.deselectTracks();
          return true;
        }
      } else {
        alert('Please enter a name.');
      }
    } catch (error) {
      console.log('Name check failed. ' + error.message);
    }
  }
}
