import { defineStore } from "pinia";
import { API_ENDPOINTS } from "~/config/constants";
import type { CheckoutResponse } from "~/types/payment";

export const usePaymentStore = defineStore("payment", () => {
  const http = getHttp();

  const loading = ref(false);

  const checkout = ref<CheckoutResponse | null>(null);

  async function startPayment(payload: any) {
    try {
      loading.value = true;

      const response = await http.post(API_ENDPOINTS.PAYMENT.PAY_NOW, payload);
      checkout.value = response as CheckoutResponse;

      return response;
    } finally {
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
