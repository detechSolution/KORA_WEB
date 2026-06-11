import type { PaymentInfo } from "~/types/payment";

const router = useRouter();

export function redirectToPaymentProvider(payment: PaymentInfo, checkoutCode?: string) {
  switch (payment.mode) {
    case "redirect_url": {
      if (!payment.redirectUrl) {
        throw new Error("Payment redirect URL missing");
      }

      window.location.assign(payment.redirectUrl);

      break;
    }
    case "redirect_form": {
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
    }
    case "free": {
      router.push({
        path: "/checkout/success",
        query: { checkout_code: checkoutCode || "" },
      });
      break;
    }
    default:
      throw new Error(`Unsupported payment mode: ${payment.mode}`);
  }
}
