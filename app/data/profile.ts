import { IMAGES } from "~/utils/images";

export const mockUser = {
  name: "John Doe",
  initials: "JD",
  email: "johndoe@gmail.com",
  phone: "9856875768",
  memberSince: "April 24, 2026",
  isMember: true,
  membership: {
    name: "Kora Premium",
    subtitle: "DEEPEN THE PRACTICE",
    period: "MONTHLY",
    tier: "Kora Premium",
    billing: "Rs. 5,000/monthly",
    benefit: "30% off",
  },
  stats: {
    totalBookings: 6,
    upcoming: 3,
    canceled: 1,
  },
};

export type BookingType = "Session" | "Spa" | "Pass";

export interface Booking {
  id: string;
  title: string;
  type: BookingType;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  price: string;
  image?: string;
  status: "UPCOMING" | "PAST" | "CANCELED";
}

export const mockBookings: Booking[] = [
  // UPCOMING
  {
    id: "b1",
    title: "Hot Flow Yoga",
    type: "Session",
    date: "April 23, 2026",
    time: "08:00 AM - 09:00 AM",
    location: "Club Kora",
    price: "Rs. 500",
    image: IMAGES.EXPERIENCE_MAIN, // placeholder image
    status: "UPCOMING",
  },
  {
    id: "b2",
    title: "Oil Massage - 1 Hours",
    type: "Spa",
    date: "April 23, 2026",
    time: "08:00 AM - 09:00 AM",
    price: "Rs. 1,500",
    image: IMAGES.EXPERIENCE_AROMA, // placeholder image
    status: "UPCOMING",
  },
  {
    id: "b3",
    title: "3-Day Pass",
    type: "Pass",
    description: "10% discount on various services and spaces",
    price: "Rs. 1,000",
    status: "UPCOMING",
  },
  // PAST
  {
    id: "b4",
    title: "Vinyasa Yoga",
    type: "Session",
    date: "April 10, 2026",
    time: "07:00 AM - 08:00 AM",
    location: "Club Kora",
    price: "Rs. 500",
    image: IMAGES.EXPERIENCE_MAIN,
    status: "PAST",
  },
  {
    id: "b5",
    title: "Deep Tissue Massage",
    type: "Spa",
    date: "April 05, 2026",
    time: "10:00 AM - 11:00 AM",
    price: "Rs. 2,000",
    image: IMAGES.EXPERIENCE_AROMA,
    status: "PAST",
  },
  // CANCELED
  {
    id: "b6",
    title: "Meditation Session",
    type: "Session",
    date: "April 15, 2026",
    time: "06:00 PM - 07:00 PM",
    location: "Club Kora",
    price: "Rs. 500",
    image: IMAGES.MANIFESTO_MEDITATION,
    status: "CANCELED",
  },
];
