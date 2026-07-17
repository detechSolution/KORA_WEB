<script setup lang="ts">
import QRCode from "qrcode";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getHttp } from "~/composables/use-api";
import { usePaymentStore } from "~/stores/payment";
import { API_ENDPOINTS } from "../../config/constants";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Fonepay Checkout",
});

const http = getHttp();
const router = useRouter();
const paymentStore = usePaymentStore();

const qrCodeUrl = ref<string>("");
const wsStatus = ref<"connecting" | "connected" | "error" | "disconnected">(
  "connecting",
);
let ws: WebSocket | null = null;

const checkoutData = computed(() => paymentStore.checkout);
const paymentInfo = computed(() => checkoutData.value?.payment);

onMounted(async () => {
  if (!checkoutData.value || !paymentInfo.value) {
    // If we have no checkout data (e.g. user refreshed the page directly), go back to checkout
    router.replace("/checkout");
    return;
  }

  if (paymentInfo.value.qrCode) {
    try {
      qrCodeUrl.value = await QRCode.toDataURL(paymentInfo.value.qrCode, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
    }
    catch {
      console.error("Failed to generate QR code");
    }
  }

  if (paymentInfo.value.merchantWebSocketUrl) {
    connectWebSocket(paymentInfo.value.merchantWebSocketUrl);
  }
  else {
    wsStatus.value = "error";
  }
});

onUnmounted(() => {
  if (ws) {
    ws.close();
  }
});

function connectWebSocket(url: string) {
  ws = new WebSocket(url);

  ws.onopen = () => {
    wsStatus.value = "connected";
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.transactionStatus) {
        const transactionStatus = JSON.parse(data.transactionStatus);

        if (transactionStatus.paymentSuccess === true) {
          checkStatusFallback();
        }
        else if (transactionStatus.paymentSuccess === false) {
          router.push({
            path: "/checkout/failure",
          });
        }
      }
    }
    catch {
      // Fallback
      if (event.data.includes("paymentSuccess\":true")) {
        handlePaymentSuccess();
      }
    }
  };

  ws.onclose = () => {
    if (wsStatus.value !== "error") {
      wsStatus.value = "disconnected";
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error", error);
    wsStatus.value = "error";
  };
}

function handlePaymentSuccess() {
  if (ws) {
    ws.close();
  }
  router.push({
    path: "/checkout/success",
    query: { checkout_code: checkoutData.value?.checkoutCode || "" },
  });
}

function handlePaymentFailure() {
  if (ws) {
    ws.close();
  }
  router.push({
    path: "/checkout/failure",
  });
}

async function checkStatusFallback() {
  if (!paymentInfo.value?.statusCheckPath || !checkoutData.value?.checkoutCode)
    return;

  try {
    const res = (await http.post(`${API_ENDPOINTS.PAYMENT.FONEPAY_STATUS}`, {
      checkoutCode: checkoutData.value.checkoutCode,
    })) as any;

    if (res && res.payment.success === true) {
      handlePaymentSuccess();
    }
    else {
      handlePaymentFailure();
    }
  }
  catch {
    console.error("Status check failed");
  }
}

function goBack() {
  router.replace("/checkout");
}
</script>

<template>
  <div
    class="bg-background dark:bg-secondary-900 min-h-screen text-foreground pb-20 font-sans"
  >
    <div class="max-w-md mx-auto pt-10 px-4 md:px-0 flex flex-col items-center">
      <div
        class="bg-card border border-border p-8 shadow-sm rounded-lg w-full flex flex-col items-center gap-6"
      >
        <div class="flex items-center gap-3">
          <img
            src="/images/logo/fonepay.png"
            alt="Fonepay"
            class="w-30 object-contain"
          >
        </div>

        <div class="text-center">
          <h2 class="text-2xl font-serif font-bold text-foreground mb-2">
            Scan to Pay
          </h2>
          <p class="text-sm text-muted-foreground">
            Open your mobile banking or Fonepay app and scan the QR code below
            to complete your payment.
          </p>
          <div v-if="checkoutData" class="mt-4">
            <span class="text-lg font-bold text-primary">Rs. {{ checkoutData.amount }}</span>
          </div>
        </div>

        <!-- QR Code Display -->
        <div
          class="relative w-[300px] h-[300px] flex items-center justify-center bg-white border border-border rounded-lg overflow-hidden"
        >
          <img
            v-if="qrCodeUrl"
            :src="qrCodeUrl"
            alt="Fonepay QR Code"
            class="w-full h-full object-contain"
          >
          <div v-else class="flex flex-col items-center gap-2">
            <UIcon
              name="i-lucide-loader-2"
              class="w-8 h-8 animate-spin text-primary"
            />
            <span class="text-xs text-muted-foreground">Generating QR Code...</span>
          </div>
        </div>

        <!-- Connection Status -->
        <div class="flex items-center gap-2 text-sm mt-2">
          <span class="relative flex h-3 w-3">
            <span
              v-if="wsStatus === 'connected'"
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            />
            <span
              class="relative inline-flex rounded-full h-3 w-3"
              :class="{
                'bg-green-500': wsStatus === 'connected',
                'bg-yellow-500': wsStatus === 'connecting',
                'bg-red-500':
                  wsStatus === 'error' || wsStatus === 'disconnected',
              }"
            />
          </span>
          <span class="text-muted-foreground">
            {{
              wsStatus === "connected"
                ? "Awaiting payment..."
                : wsStatus === "connecting"
                  ? "Connecting to Fonepay..."
                  : "Connection error. Please try checking status manually."
            }}
          </span>
        </div>

        <!-- Fallback Actions -->
        <div class="flex flex-col w-full gap-3 mt-4">
          <base-button
            variant="outline"
            class="w-full justify-center"
            @click="checkStatusFallback"
          >
            Check Status
          </base-button>

          <button
            class="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
            @click="goBack"
          >
            Cancel and choose another payment method
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
