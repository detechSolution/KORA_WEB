import type { PaymentInfo } from "~/types/payment";

export const redirectToPaymentProvider = (payment: PaymentInfo) => {
  switch (payment.mode) {
    case "redirect_url":
      if (!payment.redirectUrl) {
        throw new Error("Payment redirect URL missing");
      }

      window.location.assign(payment.redirectUrl);

      break;

    default:
      throw new Error(`Unsupported payment mode: ${payment.mode}`);
  }
};
