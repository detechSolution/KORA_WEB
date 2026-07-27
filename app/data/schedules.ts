type ScheduleType = "Event" | "Class" | "Workshop";

export type ScheduleEvent = {
  id: string;
  title: string;
  type: ScheduleType;
  start: string; // ISO String or valid Date format for FullCalendar
  end: string;
  location: string;
  spotsLeft: number;
  capacity: number;
  price: string;
  spotsFilled?: number;
};
