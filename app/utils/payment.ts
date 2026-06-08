import type { PaymentInfo } from "~/types/payment";

export function redirectToPaymentProvider(payment: PaymentInfo) {
  switch (payment.mode) {
    case "redirect_url":
      if (!payment.redirectUrl) {
        throw new Error("Payment redirect URL missing");
      }

      window.location.assign(payment.redirectUrl);

      break;

    case "redirect_form":
      if (!payment.url || !payment.fields) {
        throw new Error("Payment form URL or fields missing");
      }

      const form = document.createElement("form");
      form.method = payment.method || "POST";
      form.action = payment.url;

      for (const [key, value] of Object.entries(payment.fields)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
      break;

    default:
      throw new Error(`Unsupported payment mode: ${payment.mode}`);
  }
}
