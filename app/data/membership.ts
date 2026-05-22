export interface MembershipTier {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
}

export interface Pass {
  id: string;
  name: string;
  price: string;
  discountTag: string;
  description: string;
  buttonText: string;
}

export const membershipTiers: MembershipTier[] = [
  {
    id: "standard",
    name: "Kora Standard",
    subtitle: "BEGIN THE RITUAL",
    price: "Rs. 3,500",
    period: "Per month",
    features: [
      "2 group sessions per month",
      "10% discount on all services",
      "Access to community events",
      "KORA mobile app access",
      "Monthly wellness newsletter",
    ],
    buttonText: "BEGIN WITH STANDARD",
  },
  {
    id: "premium",
    name: "Kora Premium",
    subtitle: "DEEPEN THE PRACTICE",
    price: "Rs. 5,000",
    period: "Per month",
    features: [
      "2 group sessions per month",
      "10% discount on all services",
      "Access to community events",
      "KORA mobile app access",
      "Monthly wellness newsletter",
    ],
    buttonText: "BEGIN WITH PREMIUM",
    isPopular: true,
  },
  {
    id: "executive",
    name: "Kora Executive",
    subtitle: "EMBODY THE METAMORPHOSIS",
    price: "Rs. 10,000",
    period: "Per month",
    features: [
      "2 group sessions per month",
      "10% discount on all services",
      "Access to community events",
      "KORA mobile app access",
      "Monthly wellness newsletter",
    ],
    buttonText: "BEGIN WITH EXECUTIVE",
  },
];

export const passes: Pass[] = [
  {
    id: "1-day",
    name: "1-Day Pass",
    price: "Rs. 1,500",
    discountTag: "10% DISCOUNT",
    description: "This pass includes all classes access, recovery aids, towel & locker.",
    buttonText: "BEGIN NOW",
  },
  {
    id: "3-day",
    name: "3-Days Pass",
    price: "Rs. 3,375",
    discountTag: "10% DISCOUNT",
    description: "This pass includes all classes access, recovery aids, towel & locker.",
    buttonText: "BEGIN NOW",
  },
  {
    id: "7-day",
    name: "7-Days Pass",
    price: "Rs. 6,000",
    discountTag: "10% DISCOUNT",
    description: "This pass includes all classes access, recovery aids, towel & locker.",
    buttonText: "BEGIN NOW",
  },
];

export const membershipPeriods = [
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
  "100 DAYS",
];
