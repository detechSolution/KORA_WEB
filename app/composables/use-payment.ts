import type { CheckoutResponse } from "~/types/payment";

export function usePayment() {
  const paymentStore = usePaymentStore();

  const payNow = async (payload: any): Promise<"qr_modal" | undefined> => {
    const response = await paymentStore.startPayment(payload) as CheckoutResponse;
    return redirectToPaymentProvider(response.payment, response.checkoutCode);
  };

  return {
    payNow,
    loading: computed(() => paymentStore.loading),
  };
}
