import type { CheckoutResponse } from "~/types/payment";

export function usePayment() {
  const paymentStore = usePaymentStore();

  const payNow = async (payload: any) => {
    const response = await paymentStore.startPayment(payload) as CheckoutResponse;
    redirectToPaymentProvider(response.payment);
  };

  return {
    payNow,
    loading: computed(() => paymentStore.loading),
  };
}
