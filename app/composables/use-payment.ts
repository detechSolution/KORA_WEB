import type { CheckoutResponse } from "~/types/payment";

export function usePayment() {
  const paymentStore = usePaymentStore();

  const payNow = async (payload: any): Promise<"qr_modal" | "cybersource_modal" | undefined> => {
    const response = await paymentStore.startPayment(payload) as CheckoutResponse;
    if (response.provider === "cybersource" || response.payment?.provider === "cybersource" || response.payment?.mode === "embedded" || response.payment?.mode === "embedded_card")
      return "cybersource_modal";
    return redirectToPaymentProvider(response.payment, response.checkoutCode);
  };

  return {
    payNow,
    loading: computed(() => paymentStore.loading),
  };
}
