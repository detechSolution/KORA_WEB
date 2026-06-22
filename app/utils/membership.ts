export function getMembershipBenefits(user: any) {
  const plan = user?.membership?.plan;

  return {
    member: plan?.memberBenefit ?? {
      spa: 0,
      class: 0,
      event: 0,
      workshop: 0,
    },
    guest: plan?.guestBenefits ?? {
      spa: 0,
      class: 0,
      event: 0,
      workshop: 0,
    },
  };
}
