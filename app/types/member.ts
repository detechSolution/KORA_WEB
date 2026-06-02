export interface MemberProfile {
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
}

export interface MemberSummary {
  totalBookings: number;
  upcomingBookings: number;
  pastBookings: number;
  cancelledBookings: number;
  activePasses: number;
}

export interface MemberMembership {
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
}

export interface MemberPass {
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
}

export interface MemberDashboardResponse {
  profile: MemberProfile;
  summary: MemberSummary;
  membership: MemberMembership | null;
  passes: MemberPass[];
}
