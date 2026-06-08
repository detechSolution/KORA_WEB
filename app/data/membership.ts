export type MembershipTier = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  period: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
};

export type Pass = {
  id: string;
  name: string;
  price: number;
  discountTag: string;
  description: string;
  buttonText: string;
};

export const membershipPeriods = [
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
  "100 DAYS",
];
