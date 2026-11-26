import type { CheckoutResponse } from "~/types/payment";
import { defineStore } from "pinia";
import { API_ENDPOINTS } from "~/config/constants";

export const usePaymentStore = defineStore("payment", () => {
  const http = getHttp();

  const loading = ref(false);

  const checkout = ref<CheckoutResponse | null>(null);

  async function startPayment(payload: any) {
    try {
      loading.value = true;

      // Payment creation may take longer than regular API requests while the
      // backend prepares the checkout, so allow up to five minutes here.
      const response = await http.post(
        API_ENDPOINTS.PAYMENT.PAY_NOW,
        payload,
        undefined,
        5 * 60 * 1000,
      );
      const checkoutResponse = (response as { data?: CheckoutResponse })?.data ?? response as CheckoutResponse;
      checkout.value = checkoutResponse;

      return checkoutResponse;
    }
    finally {
      loading.value = false;
    }
  }

  function clear() {
    checkout.value = null;
  }

  return {
    loading,
    checkout,
    startPayment,
    clear,
  };
});
