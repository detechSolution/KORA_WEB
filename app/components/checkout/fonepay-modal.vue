<script setup lang="ts">
import QRCode from "qrcode";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { getHttp } from "~/composables/use-api";
import { API_ENDPOINTS } from "~/config/constants";
import { usePaymentStore } from "~/stores/payment";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
const logoSrc = computed(() =>
  isDark.value
    ? "/images/logo/fonepay_dark.png"
    : "/images/logo/fonepay_white.png",
);

const http = getHttp();
const router = useRouter();
const paymentStore = usePaymentStore();

const qrCodeUrl = ref<string>("");
const isVerifying = ref(false);
const verifyError = ref<string | null>(null);

const checkoutData = computed(() => paymentStore.checkout);
const paymentInfo = computed(() => checkoutData.value?.payment);

// const steps = [
//   { icon: "i-lucide-qr-code", label: "Scan QR" },
//   { icon: "i-lucide-smartphone", label: "Pay on App" },
//   { icon: "i-lucide-check-circle", label: "Confirm Here" },
// ];

watch(
  () => [props.isOpen, paymentInfo.value?.qrCode],
  async ([open, qrCode]) => {
    if (open && qrCode) {
      try {
        qrCodeUrl.value = await QRCode.toDataURL(qrCode as string, {
          width: 280,
          margin: 1,
          color: { dark: "#1a1a1a", light: "#ffffff" },
        });
      }
      catch {
        console.error("Failed to generate QR code");
      }
    }
  },
  { immediate: true },
);

function handlePaymentSuccess() {
  emit("close");
  router.push({
    path: "/checkout/success",
    query: { checkout_code: checkoutData.value?.checkoutCode || "" },
  });
}

async function verifyPayment() {
  isVerifying.value = true;
  verifyError.value = null;

  if (!paymentInfo.value?.statusCheckPath || !checkoutData.value?.checkoutCode) {
    verifyError.value = "Missing payment details. Please close and try again.";
    isVerifying.value = false;
    return;
  }

  try {
    const res = (await http.post(`${API_ENDPOINTS.PAYMENT.FONEPAY_STATUS}`, {
      checkoutCode: checkoutData.value.checkoutCode,
    })) as any;

    if (res && res.payment.success === true) {
      handlePaymentSuccess();
    }
    else {
      verifyError.value = "Payment not confirmed yet. Please wait a moment and try again.";
    }
  }
  catch {
    verifyError.value = "Could not verify payment. Please try again.";
  }
  finally {
    isVerifying.value = false;
  }
}

function close() {
  verifyError.value = null;
  emit("close");
}
</script>

<template>
  <base-modal
    title=""
    :open="isOpen"
    :modal-width="500"
    :dismissible="true"
    @close="close"
  >
    <div class="fp-modal">
      <div class="fp-header">
        <div class="fp-logo-box">
          <img
            :src="logoSrc"
            alt="Fonepay"
            class="fp-logo"
          >
        </div>
        <div>
          <h2 class="fp-title">
            Scan &amp; Pay
          </h2>
          <p class="fp-subtitle">
            Secure payment via Fonepay
          </p>
        </div>
      </div>

      <p class="text-sm text-muted-foreground mb-4 text-center px-4">
        Open your mobile banking or Fonepay app and scan the QR code below
        to complete your payment.
      </p>

      <div v-if="checkoutData" class="fp-amount-row">
        <!-- <span class="fp-amount-label">Amount</span> -->
        <span class="fp-amount-value">Rs. {{ checkoutData.amount }}</span>
      </div>

      <!-- <div class="fp-steps">
        <div v-for="(step, i) in steps" :key="i" class="fp-step">
          <div class="fp-step-icon">
            <UIcon :name="step.icon" class="w-3.5 h-3.5" />
          </div>
          <span class="fp-step-label">{{ step.label }}</span>
          <div v-if="i < steps.length - 1" class="fp-step-line" />
        </div>
      </div> -->

      <div class="fp-body">
        <div class="fp-qr-frame">
          <span class="fp-corner fp-tl" />
          <span class="fp-corner fp-tr" />
          <span class="fp-corner fp-bl" />
          <span class="fp-corner fp-br" />

          <img
            v-if="qrCodeUrl"
            :src="qrCodeUrl"
            alt="Fonepay QR Code"
            class="fp-qr-img"
          >
          <div v-else class="fp-qr-loading">
            <UIcon name="i-lucide-loader-2" class="w-7 h-7 animate-spin" />
            <span>Generating QR…</span>
          </div>
        </div>

        <!-- <p class="fp-hint">
          <UIcon name="i-lucide-info" class="w-3.5 h-3.5 shrink-0 mt-px" />
          Open Fonepay or your mobile banking app, tap <strong>Scan QR</strong>, and complete the payment.
        </p>

        <div class="fp-divider">
          <span>then</span>
        </div>

        <p class="fp-instruction">
          Once you've paid in the app, click the button below to confirm your payment.
        </p> -->

        <div v-if="verifyError" class="fp-error">
          <UIcon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" />
          <span>{{ verifyError }}</span>
        </div>

        <base-button
          id="fonepay-verify-btn"
          class="fp-verify-btn"
          :disabled="isVerifying"
          @click="verifyPayment"
        >
          <span class="fp-btn-inner">
            <UIcon
              :name="isVerifying ? 'i-lucide-loader-2' : 'i-lucide-check-circle'"
              class="w-4 h-4"
              :class="{ 'animate-spin': isVerifying }"
            />
            {{ isVerifying ? "Verifying Payment…" : "I've Completed Payment" }}
          </span>
        </base-button>

        <button class="fp-cancel" @click="close">
          Cancel &amp; choose another payment method
        </button>

        <!-- <div class="fp-security">
          <UIcon name="i-lucide-shield-check" class="w-3.5 h-3.5" />
          <span>256-bit SSL encrypted &amp; secured by Fonepay</span>
        </div> -->
      </div>
    </div>
  </base-modal>
</template>

<style scoped>
.fp-modal {
  overflow: hidden;
  border-radius: 12px;
  font-family: var(--font-sans, "Inter", sans-serif);
}

.fp-header {
  /* background: linear-gradient(135deg, #161007 0%, #2a1d09 60%, #161007 100%); */
  padding: 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  text-align: center;
}

:root.dark .fp-header {
  /* background: linear-gradient(135deg, #0c0c0c 0%, #1a1209 60%, #0c0c0c 100%); */
}

.fp-logo-box {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 9px;
  padding: 0.4rem 0.75rem;
  display: flex;
  align-items: center;
  backdrop-filter: blur(4px);
}

.fp-logo {
  height: 30px;
  object-fit: contain;
}

.fp-title {
  font-size: 1.05rem;
  font-weight: 700;
  /* color: #fff; */
  margin: 0 0 0.1rem;
  letter-spacing: -0.01em;
}

.fp-subtitle {
  font-size: 0.68rem;
  /* color: rgba(255, 255, 255, 0.5); */
  margin: 0;
}

.fp-amount-row {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.5rem;
  /* border-bottom: 1px solid var(--color-border); */
  /* background: rgba(160, 136, 96, 0.04); */
}

.fp-amount-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 600;
  color: var(--color-muted-foreground);
}

.fp-amount-value {
  font-size: 1.15rem;
  font-weight: 700;
  color: #a08860;
  font-variant-numeric: tabular-nums;
}

.fp-steps {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0.85rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.fp-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.28rem;
  flex: 1;
  position: relative;
}

.fp-step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(160, 136, 96, 0.1);
  border: 1.5px solid rgba(160, 136, 96, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a08860;
  position: relative;
  z-index: 1;
}

.fp-step-label {
  font-size: 0.58rem;
  color: var(--color-muted-foreground);
  text-align: center;
  font-weight: 500;
}

.fp-step-line {
  position: absolute;
  top: 16px;
  left: 50%;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, rgba(160, 136, 96, 0.3) 0%, rgba(160, 136, 96, 0.08) 100%);
}

.fp-body {
  padding: 1.4rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.fp-qr-frame {
  position: relative;
  width: 250px;
  height: 250px;
  padding: 10px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fp-corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border-color: #a08860;
  border-style: solid;
}

.fp-tl {
  top: -1px;
  left: -1px;
  border-width: 2.5px 0 0 2.5px;
  border-radius: 5px 0 0 0;
}
.fp-tr {
  top: -1px;
  right: -1px;
  border-width: 2.5px 2.5px 0 0;
  border-radius: 0 5px 0 0;
}
.fp-bl {
  bottom: -1px;
  left: -1px;
  border-width: 0 0 2.5px 2.5px;
  border-radius: 0 0 0 5px;
}
.fp-br {
  bottom: -1px;
  right: -1px;
  border-width: 0 2.5px 2.5px 0;
  border-radius: 0 0 5px 0;
}

.fp-qr-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 3px;
}

.fp-qr-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  color: #a08860;
  font-size: 0.7rem;
}

.fp-hint {
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  font-size: 0.7rem;
  color: var(--color-muted-foreground);
  text-align: center;
  max-width: 280px;
  line-height: 1.55;
}

.fp-hint strong {
  color: var(--color-foreground);
}

.fp-divider {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-muted-foreground);
}

.fp-divider::before,
.fp-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.fp-instruction {
  font-size: 0.76rem;
  color: var(--color-muted-foreground);
  text-align: center;
  line-height: 1.6;
  max-width: 300px;
}

.fp-error {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.22);
  border-radius: 8px;
  padding: 0.55rem 0.8rem;
  font-size: 0.74rem;
  color: #dc2626;
  width: 100%;
  text-align: left;
}

.fp-verify-btn {
  width: 100%;
  padding: 0.85rem 1.5rem;
  background: linear-gradient(135deg, #a08860 0%, #c9ab7f 50%, #a08860 100%);
  background-size: 200% auto;
  color: #fff;
  border: none;
  /* border-radius: 10px; */
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background-position 0.4s ease,
    transform 0.15s,
    box-shadow 0.2s,
    opacity 0.2s;
  box-shadow: 0 4px 16px rgba(160, 136, 96, 0.3);
}

.fp-verify-btn:hover:not(:disabled) {
  background-position: right center;
  transform: translateY(-1px);
  box-shadow: 0 6px 22px rgba(160, 136, 96, 0.42);
}

.fp-verify-btn:active:not(:disabled) {
  transform: translateY(0);
}

.fp-verify-btn:disabled {
  opacity: 0.72;
  cursor: not-allowed;
}

.fp-btn-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
}

.fp-cancel {
  font-size: 0.68rem;
  color: var(--color-muted-foreground);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
  padding: 0;
}

.fp-cancel:hover {
  color: var(--color-foreground);
}

.fp-security {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.65rem;
  color: var(--color-muted-foreground);
  opacity: 0.6;
}
</style>
