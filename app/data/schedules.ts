export type ScheduleType = "Event" | "Class" | "Workshop";

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
};

// Get the date of Sunday for the current week
function getSundayOfCurrentWeek() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday
  const diff = today.getDate() - dayOfWeek;
  const sunday = new Date(today.setDate(diff));
  sunday.setHours(0, 0, 0, 0);
  return sunday;
}

const thisSunday = getSundayOfCurrentWeek();

// Helper to easily generate dates relative to this Sunday
// function generateDate(daysOffset: number, time: string) {
//   const targetDate = new Date(thisSunday);
//   targetDate.setDate(targetDate.getDate() + daysOffset);
//   const dateStr = targetDate.toLocaleDateString("en-CA"); // 'YYYY-MM-DD' format (local time instead of UTC)
//   return `${dateStr}T${time}:00`;
// }
