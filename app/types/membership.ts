export type MembershipPlans = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  name: string;
  currency: string;
  description: string;
  isActive: boolean;
  options: Option[];
};

export type Option = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  membershipPlanId: number;
  frequency: string;
  customDays: null;
  price: number;
  memberBenefit: number;
  isVisible: boolean;
  sortOrder: number;
  durationDays: number;
};

export type Passes = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  name: string;
  description: string;
  numberOfDays: number;
  price: number;
  discount: number;
  currency: string;
  allowedSessionType: string;
  isActive: boolean;
  effectivePrice: number;
};
