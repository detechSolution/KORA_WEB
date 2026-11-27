import { defineStore } from "pinia";
import { ref } from "vue";
import { getHttp } from "~/composables/use-api";
import { API_ENDPOINTS } from "~/config/constants";

export const useCheckoutStore = defineStore("checkout", () => {
  const http = getHttp();
  const paymentDetails = ref<any>(null);
  const paymentStatus = ref<string>("");
  const totalAmount = ref<number>(0);
  const verifiedCheckoutCode = ref<string>("");
  const loading = ref<boolean>(true);

  async function verifyPayment(checkoutCode: string) {
    loading.value = true;
    try {
      const response = await http.get(
        `${API_ENDPOINTS.PAYMENT.VERIFY}?checkout_code=${encodeURIComponent(checkoutCode)}`,
      );
      paymentDetails.value = response;
      if (response && (response as any).verified) {
        paymentStatus.value = "paid";
        totalAmount.value = (response as any).summary?.total;
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

  function recordVerifiedPayment(
    checkoutCode: string,
    details: unknown,
    fallback: { amount?: number; holdExpiresAt?: string } = {},
  ) {
    const result = details && typeof details === "object" && "data" in details
      ? (details as { data: unknown }).data
      : details;
    const record = result && typeof result === "object"
      ? result as Record<string, unknown>
      : {};
    const summary = record.summary && typeof record.summary === "object"
      ? record.summary as Record<string, unknown>
      : {};

    verifiedCheckoutCode.value = checkoutCode;
    paymentDetails.value = { holdExpiresAt: record.holdExpiresAt ?? fallback.holdExpiresAt };
    paymentStatus.value = "paid";
    totalAmount.value = Number(summary.total ?? record.amount ?? fallback.amount ?? 0);
    loading.value = false;
  }

  function clearCheckout() {
    paymentDetails.value = null;
    paymentStatus.value = "";
    verifiedCheckoutCode.value = "";
    loading.value = true;
  }

  return {
    paymentDetails,
    paymentStatus,
    totalAmount,
    verifiedCheckoutCode,
    recordVerifiedPayment,
    loading,
    verifyPayment,
    clearCheckout,
  };
});
