export type ServiceType = "spa" | "class" | "event" | "workshop" | "cafe" | "salon";

export type BenefitsMap = Record<ServiceType, number>;

const ZERO_BENEFITS: BenefitsMap = {
  spa: 0,
  class: 0,
  event: 0,
  workshop: 0,
  cafe: 0,
  salon: 0,
};

function isValidOnDate(
  validFrom: string | null | undefined,
  validTo: string | null | undefined,
  bookingDate?: string,
): boolean {
  if (!validFrom || !validTo)
    return false;

  const from = validFrom.slice(0, 10);
  const to = validTo.slice(0, 10);

  const checkDate = bookingDate
    ? bookingDate.slice(0, 10)
    : new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD"

  return checkDate >= from && checkDate <= to;
}

export function getMembershipBenefits(
  user: any,
  bookingDate?: string,
): {
  member: BenefitsMap;
  guest: BenefitsMap;
} {
  const membership = user?.membership;

  if (!membership) {
    return { member: { ...ZERO_BENEFITS }, guest: { ...ZERO_BENEFITS } };
  }

  const { validFrom, validTo, plan } = membership;

  if (!isValidOnDate(validFrom, validTo, bookingDate)) {
    return { member: { ...ZERO_BENEFITS }, guest: { ...ZERO_BENEFITS } };
  }

  const memberBenefit = plan?.memberBenefit ?? {};
  const guestBenefit = plan?.guestBenefits ?? {};

  return {
    member: {
      spa: memberBenefit.spa ?? 0,
      class: memberBenefit.class ?? 0,
      event: memberBenefit.event ?? 0,
      workshop: memberBenefit.workshop ?? 0,
      cafe: memberBenefit.cafe ?? 0,
      salon: memberBenefit.salon ?? 0,
    },
    guest: {
      spa: guestBenefit.spa ?? 0,
      class: guestBenefit.class ?? 0,
      event: guestBenefit.event ?? 0,
      workshop: guestBenefit.workshop ?? 0,
      cafe: guestBenefit.cafe ?? 0,
      salon: guestBenefit.salon ?? 0,
    },
  };
}

export function getPassesBenefits(user: any, bookingDate?: string): BenefitsMap {
  const rawPasses = user?.passes ?? user?.pass;

  if (!rawPasses) {
    return { ...ZERO_BENEFITS };
  }

  // auth/me returns `passes` as an array (see sample response), but older
  // cached user_data may hold a single object. Normalize to an array.
  const passes = Array.isArray(rawPasses) ? rawPasses : [rawPasses];

  // Session types that are gated by allowedSessionType.
  const SESSION_TYPES: ServiceType[] = ["class", "event", "workshop"];

  const benefits: BenefitsMap = { ...ZERO_BENEFITS };

  for (const pass of passes) {
    if (!pass || typeof pass !== "object")
      continue;

    // Only active passes grant benefits.
    if (pass.status && String(pass.status).toLowerCase() !== "active") {
      continue;
    }

    // Prefer validFrom/validTo, fall back to startsOn/endsOn.
    const validFrom = pass.validFrom ?? pass.startsOn;
    const validTo = pass.validTo ?? pass.endsOn;

    if (!isValidOnDate(validFrom, validTo, bookingDate)) {
      continue;
    }

    const passBenefits = pass.passBenefits ?? {};
    const candidate: BenefitsMap = {
      spa: passBenefits?.spa ?? pass?.spaBenefit ?? 0,
      class: passBenefits?.class ?? pass?.classBenefit ?? 0,
      event: passBenefits?.event ?? pass?.eventBenefit ?? 0,
      workshop: passBenefits?.workshop ?? pass?.workshopBenefit ?? 0,
      cafe: passBenefits?.cafe ?? pass?.cafeBenefit ?? 0,
      salon: passBenefits?.salon ?? pass?.salonBenefit ?? 0,
    };

    // Zero out session types that don't match the pass's allowedSessionType.
    // e.g. a "class" pass should not give a discount on events or workshops.
    const allowedSessionType = pass.allowedSessionType
      ? String(pass.allowedSessionType).toLowerCase()
      : null;
    if (allowedSessionType) {
      for (const type of SESSION_TYPES) {
        if (type !== allowedSessionType) {
          candidate[type] = 0;
        }
      }
    }

    // Take the best benefit per service across all valid passes.
    for (const key of Object.keys(benefits) as ServiceType[]) {
      benefits[key] = Math.max(benefits[key] ?? 0, candidate[key] ?? 0);
    }
  }

  return benefits;
}

export function getEffectiveDiscount(
  serviceType: ServiceType,
  user: any,
  bookingDate?: string,
): number {
  const membershipBenefits = getMembershipBenefits(user, bookingDate);
  const passBenefits = getPassesBenefits(user, bookingDate);

  const membershipDiscount = membershipBenefits.member[serviceType] ?? 0;
  const passDiscount = passBenefits[serviceType] ?? 0;

  // Membership takes priority; fall back to pass if no membership discount.
  return membershipDiscount > 0 ? membershipDiscount : passDiscount;
}
