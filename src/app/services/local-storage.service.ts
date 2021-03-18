import { Injectable } from '@angular/core';
import { Track } from '../interfaces/track.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public track: Track;

  constructor() { }

  /**
   *
   * @param first string
   * @param second string
   *
   * Sort track entries by date. First, these need to have hyphens
   * removed so we can properly parse them and then compare.
   */
  private _sortTrackObjectTimeEntriesByDate(first, second): number {
    const firstString = first.recordedDate.replace(/-/g, '');
    const secondString = second.recordedDate.replace(/-/g, '');
    return (parseInt(firstString, 10) - parseInt(secondString, 10));
  }

  /**
   *
   * @param track Track
   *
   * Saves a track to local storage
   */
  public saveTrack(track: Track): void {
    track.dates.sort(this._sortTrackObjectTimeEntriesByDate);
    localStorage.setItem(track['name'], JSON.stringify(track));
  }

  /**
   *
   * @param track
   *
   * Saves a track to local storage
   */
  private _saveAllTracks(tracks: Track[]): void {
    // track.dates.sort(this._sortTrackObjectTimeEntriesByDate);
    // localStorage.setItem(track['name'], JSON.stringify(track));
    tracks.forEach( track => {
      this.saveTrack(track);
    });
  }

  /**
   *
   * @param track Track
   *
   * Deletes a track from local storage
   */
  public deleteTrack(track: Track): void {
    localStorage.removeItem(track.name);
    this.track = null;
  }

  /**
   *
   * @param track Track
   *
   * Finds a track in local storage by its name string
   */
  public findTrackByName(track: string): Track {
    try {
      const allTracks = this.getAllTracks();
      let trackByName: Track = null;
      allTracks.forEach ( function(trackInArray, index) {
        if (trackInArray['name'] === track) {
          trackByName = trackInArray;
        }
      });
      return trackByName;
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
      const allTracks = this.getAllTracks();
      allTracks.forEach ( function(trackInArray, index) {
        if (trackInArray['name'] === track.name) {
          trackInArray['selected'] = true;
        }
      });
      this._saveAllTracks(allTracks);
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
    try {
      const allTracks = this.getAllTracks();
      let selectedTrack: Track = null;
      allTracks.forEach ( function(track, index) {
        if (track['selected'] === true) {
          selectedTrack = track;
        }
      });
      this.track = selectedTrack;
      return selectedTrack;
    } catch (error) {
      console.log('Currently there\'s no selected track. ' + error.message);
    }
  }

  /**
   * Defaults all track's selected property to false
   */
  public deselectTracks(): void {
    try {
      const allTracks = this.getAllTracks();
      allTracks.forEach ( function(track, index) {
        if (track['selected'] = true) {
          track['selected'] = false;
        }
      });
      this._saveAllTracks(allTracks);
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
        const storedTrackString = localStorage.getItem(localStorage.key(i));
        const storedTrack = JSON.parse(storedTrackString);
        allTracks.push(storedTrack);
      }
      allTracks.sort((a, b) => (a.name > b.name) ? 1 : -1);
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
        if (localStorage.length > 1) {
          const allTracks = this.getAllTracks();
          // allTracks.forEach ( function(track, index) {
          //   if (name === track['name']) {
          //     alert('This track already exists. Please choose a different name.');
          //     return true;
          //   } else if (index === (localStorage.length - 1)) {
          //     LocalStorageService.prototype.deselectTracks();
          //     return false;
          //   }
          // });
          const isNameTaken = allTracks.filter((item) => item.name === name).shift();
          return !!isNameTaken;
        } else {
          return false;
        }
    } catch (error) {
      console.log('Name check failed. ' + error.message);
    }
  }

  // private checkName(name1, name2) {
  //   return name1 === name2;
  // }
}
