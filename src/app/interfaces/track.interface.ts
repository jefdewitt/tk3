export interface Track {
    dates: Dates[],
    name: string,
    selected: true,
    time: 0,
    editName: false,
    editTime: false
  };

export interface Dates {
  recordedMinutes: number,
  recordedDate: string
}