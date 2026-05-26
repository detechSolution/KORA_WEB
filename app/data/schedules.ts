export type ScheduleType = "Event" | "Class" | "Workshop";

export interface ScheduleEvent {
  id: string;
  title: string;
  type: ScheduleType;
  start: string; // ISO String or valid Date format for FullCalendar
  end: string;
  location: string;
  spotsLeft: number;
  price: string;
}

// Get the date of Sunday for the current week
const getSundayOfCurrentWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday
  const diff = today.getDate() - dayOfWeek;
  const sunday = new Date(today.setDate(diff));
  sunday.setHours(0, 0, 0, 0);
  return sunday;
};

const thisSunday = getSundayOfCurrentWeek();

// Helper to easily generate dates relative to this Sunday
const generateDate = (daysOffset: number, time: string) => {
  const targetDate = new Date(thisSunday);
  targetDate.setDate(targetDate.getDate() + daysOffset);
  const dateStr = targetDate.toLocaleDateString("en-CA"); // 'YYYY-MM-DD' format (local time instead of UTC)
  return `${dateStr}T${time}:00`;
};

export const mockSchedules: ScheduleEvent[] = [
  // SUNDAY (offset 0)
  {
    id: "e16",
    title: "Early Meditation",
    type: "Event",
    start: generateDate(0, "07:00"),
    end: generateDate(0, "08:00"),
    location: "Club Kora",
    spotsLeft: 8,
    price: "Rs. 500",
  },
  {
    id: "e17",
    title: "Cacao Ceremony",
    type: "Event",
    start: generateDate(0, "08:30"),
    end: generateDate(0, "09:30"),
    location: "Club Kora",
    spotsLeft: 0,
    price: "Rs. 500",
  },
  {
    id: "e18",
    title: "Primal Movement",
    type: "Class",
    start: generateDate(0, "14:00"),
    end: generateDate(0, "15:00"),
    location: "Club Kora",
    spotsLeft: 8,
    price: "Rs. 500",
  },

  // MONDAY (offset 1)
  {
    id: "e1",
    title: "Hot Flow Yoga",
    type: "Event",
    start: generateDate(1, "07:00"),
    end: generateDate(1, "08:00"),
    location: "Club Kora",
    spotsLeft: 8,
    price: "Rs. 500",
  },
  {
    id: "e2",
    title: "Infrared Sauna",
    type: "Workshop",
    start: generateDate(1, "08:30"),
    end: generateDate(1, "09:30"),
    location: "Club Kora",
    spotsLeft: 0,
    price: "Rs. 500",
  },
  {
    id: "e3",
    title: "Sound Journey",
    type: "Event",
    start: generateDate(1, "13:30"),
    end: generateDate(1, "14:30"),
    location: "Club Kora",
    spotsLeft: 8,
    price: "Rs. 500",
  },

  // WEDNESDAY (offset 3)
  {
    id: "e4",
    title: "Cold Immersion",
    type: "Workshop",
    start: generateDate(3, "08:00"),
    end: generateDate(3, "09:00"),
    location: "Club Kora",
    spotsLeft: 8,
    price: "Rs. 500",
  },
  {
    id: "e5",
    title: "Breathwork",
    type: "Workshop",
    start: generateDate(3, "14:00"),
    end: generateDate(3, "15:00"),
    location: "Club Kora",
    spotsLeft: 8,
    price: "Rs. 500",
  },
  {
    id: "e6",
    title: "Restorative Yin",
    type: "Event",
    start: generateDate(3, "17:00"),
    end: generateDate(3, "18:00"),
    location: "Club Kora",
    spotsLeft: 8,
    price: "Rs. 500",
  },

  // THURSDAY (offset 4)
  {
    id: "e7",
    title: "Morning Vinyasa",
    type: "Class",
    start: generateDate(4, "08:30"),
    end: generateDate(4, "09:30"),
    location: "Club Kora",
    spotsLeft: 8,
    price: "Rs. 500",
  },
  {
    id: "e8",
    title: "Dawn Yoga",
    type: "Class",
    start: generateDate(4, "13:30"),
    end: generateDate(4, "14:30"),
    location: "Club Kora",
    spotsLeft: 8,
    price: "Rs. 500",
  },
  {
    id: "e9",
    title: "Yin Restoration",
    type: "Class",
    start: generateDate(4, "16:00"),
    end: generateDate(4, "17:00"),
    location: "Club Kora",
    spotsLeft: 8,
    price: "Rs. 500",
  },

  // FRIDAY (offset 5)
  {
    id: "e10",
    title: "Lymphatic Flow",
    type: "Workshop",
    start: generateDate(5, "07:00"),
    end: generateDate(5, "08:00"),
    location: "Club Kora",
    spotsLeft: 8,
    price: "Rs. 500",
  },
  {
    id: "e11",
    title: "Hot Flow Yoga",
    type: "Event",
    start: generateDate(5, "11:00"),
    end: generateDate(5, "12:00"),
    location: "Club Kora",
    spotsLeft: 8,
    price: "Rs. 500",
  },
  {
    id: "e12",
    title: "Forest Meditation",
    type: "Event",
    start: generateDate(5, "14:00"),
    end: generateDate(5, "15:00"),
    location: "Club Kora",
    spotsLeft: 8,
    price: "Rs. 500",
  },

  // SATURDAY (offset 6)
  {
    id: "e13",
    title: "Strength Circuit",
    type: "Class",
    start: generateDate(6, "08:00"),
    end: generateDate(6, "09:00"),
    location: "Club Kora",
    spotsLeft: 8,
    price: "Rs. 500",
  },
  {
    id: "e14",
    title: "Community Circle",
    type: "Workshop",
    start: generateDate(6, "13:30"),
    end: generateDate(6, "14:30"),
    location: "Club Kora",
    spotsLeft: 8,
    price: "Rs. 500",
  },
  {
    id: "e15",
    title: "Power Flow",
    type: "Class",
    start: generateDate(6, "16:00"),
    end: generateDate(6, "17:00"),
    location: "Club Kora",
    spotsLeft: 8,
    price: "Rs. 500",
  },
  {
    id: "e16",
    title: "Go with the Flow",
    type: "Workshop",
    start: generateDate(6, "16:00"),
    end: generateDate(6, "17:00"),
    location: "Club Kora",
    spotsLeft: 8,
    price: "Rs. 500",
  },
];
