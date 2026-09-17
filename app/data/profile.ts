type BookingType = "Session" | "Spa" | "Pass";

export type Booking = {
  id: number;
  bookingId?: number;
  uniqueId?: string;
  title: string;
  type: BookingType;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  price: string;
  image?: string;
  status: "UPCOMING" | "PAST" | "CANCELED";
  productId?: number;
  itemType: "session" | "spa" | "passes";
  refundStatus?: string;
  visitors?: any[];
};
