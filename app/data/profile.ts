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