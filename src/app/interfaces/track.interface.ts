export interface Track {
    dates: Dates[];
    name: string;
    selected: boolean;
    time: number;
    editName: false;
    editTime: false;
  }

export interface Dates {
  recordedMinutes: number;
  recordedDate: string;
}
