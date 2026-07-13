import { defineStore } from "pinia";
import { ref } from "vue";
import { getHttp } from "~/composables/use-api";
import { API_ENDPOINTS } from "~/config/constants";

export const useCheckoutStore = defineStore("checkout", () => {
  const http = getHttp();
  const paymentDetails = ref<any>(null);
  const paymentStatus = ref<string>("");
  const loading = ref<boolean>(true);

  async function verifyPayment(checkoutCode: string) {
    loading.value = true;
    try {
      const response = await http.get(
        `${API_ENDPOINTS.PAYMENT.VERIFY}?checkout_code=${checkoutCode}`,
      );
      paymentDetails.value = response;
      if (response && (response as any).verified) {
        paymentStatus.value = "paid";
      }
      else {
        paymentStatus.value = "failed";
      }
    }
    catch (error) {
      console.error("Failed to verify payment:", error);
      paymentStatus.value = "failed";
    }
    finally {
      setTimeout(() => {
        loading.value = false;
      }, 800);
    }
  }

  function clearCheckout() {
    paymentDetails.value = null;
    paymentStatus.value = "";
    loading.value = true;
  }

  return {
    paymentDetails,
    paymentStatus,
    loading,
    verifyPayment,
    clearCheckout,
  };
});
