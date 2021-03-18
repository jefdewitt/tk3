export interface Track {
    dates: Dates[];
    name: string;
    selected: boolean;
    time: number;
    editName: false;
    editTime: false;
    completionCategory: number[];
  }

export interface Dates {
  recordedMinutes: number;
  recordedDate: string;
}
