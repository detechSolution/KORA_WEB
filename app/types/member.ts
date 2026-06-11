type MemberProfile = {
  memberId: number;
  userId: number;
  fullName: string;
  initials: string;
  email: string;
  phoneNumber: string;
  joinedAt: string;
  memberSince: string;
  identificationDocumentUrl: string | null;
  isActive: boolean;
};

type MemberSummary = {
  totalBookings: number;
  todayBookings: number;
  upcomingBookings: number;
  pastBookings: number;
  cancelledBookings: number;
  activePasses: number;
};

type MemberMembership = {
  isActive: boolean;
  planId: number;
  planName: string;
  description: string;
  optionId: number;
  frequency: string;
  frequencyLabel: string;
  price: number;
  currency: string;
  memberBenefitPercent: number;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
};

type MemberPass = {
  id: number;
  passId: number;
  name: string;
  description: string;
  startsOn: string;
  endsOn: string;
  status: string;
  allowedSessionType: string;
  currency: string;
  price: number;
};

export type MemberDashboardResponse = {
  profile: MemberProfile;
  summary: MemberSummary;
  membership: MemberMembership | null;
  passes: MemberPass[];
};

type MemberBookingVisitor = {
  id: number;
  fullName: string;
  phoneNumber: string | null;
  email: string | null;
};

type MemberBooking = {
  id: number;
  bookingCode: string;
  itemName: string;
  itemType: string;
  serviceOfferingName: string | null;
  serviceDuration: string | null;
  productId: number | null;
  status: string;
  bookedAt: string;
  bookedFor: string;
  originalAmount: number;
  discountAmount: number;
  amount: number;
  currency: string;
  promoCode: string | null;
  paymentStatus: string | null;
  visitors: MemberBookingVisitor[];
  bannerUrl: string | null;
};

export type MemberBookingsResponse = {
  status: string;
  data: MemberBooking[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
