<script setup lang="ts">
import type { CheckoutResponse, PaymentInfo } from "~/types/payment";
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { getHttp } from "~/composables/use-api";
import { API_ENDPOINTS } from "~/config/constants";

// ─── Types ───────────────────────────────────────────────────────────────────

type PaymentState = "loading" | "ready" | "processing" | "pending" | "declined" | "review" | "error";

type UCSdk = {
  createCheckout: (options?: { autoProcessing?: boolean }) => Promise<{
    mount: (target: { paymentSelection: string; paymentScreen: string }) => Promise<unknown>;
    destroy: () => void;
  }>;
  destroy: () => void;
};

type WindowWithVAS = Window & {
  VAS?: { UnifiedCheckout: (captureContext: string) => Promise<UCSdk> };
};

// ─── Props / Emits ───────────────────────────────────────────────────────────

const props = defineProps<{
  isOpen: boolean;
  checkout: CheckoutResponse | null;
}>();

const emit = defineEmits<{
  close: [];
  paid: [checkoutCode: string, verification: unknown];
  declined: [];
}>();

// ─── Composables & State ─────────────────────────────────────────────────────

const http = getHttp();
const state = ref<PaymentState>("loading");
const message = ref("");

const checkoutCode = computed(() => props.checkout?.checkoutCode ?? "");
const payment = computed(() => props.checkout?.payment);
const shortRef = computed(() => checkoutCode.value.slice(-8).toUpperCase());

const formattedAmount = computed(() => {
  const c = props.checkout;
  if (!c) {
    return "";
  }
  const sym = !c.currency || c.currency.toUpperCase() === "NPR" ? "Rs." : c.currency;
  return `${sym} ${Number(c.amount).toLocaleString()}`;
});

// Current active flow step (1: Summary/Ready, 2: Card Entry, 3: Processing/Verification)
const currentStepNumber = computed(() => {
  if (state.value === "loading" || state.value === "ready") {
    return 2;
  }
  if (state.value === "processing" || state.value === "pending" || state.value === "review") {
    return 3;
  }
  return 2;
});

// ─── SDK Refs ────────────────────────────────────────────────────────────────

let ucClient: UCSdk | undefined;
let ucSession: Awaited<ReturnType<UCSdk["createCheckout"]>> | undefined;
let activeRun = 0;
let paymentResultToken = "";
let loadingTimeoutId: ReturnType<typeof setTimeout> | undefined;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSdkDetails(info: PaymentInfo, checkout: CheckoutResponse) {
  return {
    captureContext: info.captureContext ?? checkout.captureContext,
    clientLibrary: info.clientLibrary ?? info.sdk?.clientLibrary ?? checkout.clientLibrary ?? checkout.sdk?.clientLibrary,
    clientLibraryIntegrity: info.clientLibraryIntegrity ?? info.sdk?.clientLibraryIntegrity ?? checkout.clientLibraryIntegrity ?? checkout.sdk?.clientLibraryIntegrity,
  };
}

function loadScript(url: string, integrity: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (new URL(url).protocol !== "https:") {
        reject(new Error("CyberSource returned an insecure card form URL."));
        return;
      }
    }
    catch {
      reject(new Error("CyberSource returned an invalid card form URL."));
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CSS.escape(url)}"]`);
    if (existing && (window as WindowWithVAS).VAS?.UnifiedCheckout) {
      resolve();
      return;
    }

    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Could not load the secure card form. Please check your network connection and try again.")), { once: true });

    if (!existing) {
      script.src = url;
      script.integrity = integrity;
      script.crossOrigin = "anonymous";
      script.async = true;
      document.head.appendChild(script);
    }
  });
}

function disposeSdk() {
  if (loadingTimeoutId !== undefined) {
    clearTimeout(loadingTimeoutId);
    loadingTimeoutId = undefined;
  }
  try {
    ucSession?.destroy();
    ucClient?.destroy();
  }
  catch {
    // SDK cleanup should not block closing the dialog
  }
  ucSession = undefined;
  ucClient = undefined;
  paymentResultToken = "";
}

function unwrap<T>(value: T | { data: T }): T {
  return value && typeof value === "object" && "data" in value
    ? (value as { data: T }).data
    : value as T;
}

function normalizeStatus(response: unknown): { status: "paid" | "pending" | "declined" | "review"; message?: string } {
  const result = unwrap(response as Record<string, unknown>);
  const pay = result.payment && typeof result.payment === "object"
    ? result.payment as Record<string, unknown>
    : result;
  const raw = String(pay.status ?? pay.paymentStatus ?? pay.transactionStatus ?? result.status ?? result.decision ?? "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  const responseMsg = String(pay.reason ?? pay.message ?? result.message ?? "").trim();

  if (pay.verified === true || result.verified === true || pay.success === true || pay.paymentSuccess === true || ["paid", "success", "succeeded", "approved", "completed"].includes(raw)) {
    return { status: "paid", message: responseMsg };
  }
  if (["review", "review_required", "requires_review", "manual_review"].includes(raw)) {
    return { status: "review", message: responseMsg };
  }
  if (pay.success === false || pay.paymentSuccess === false || ["declined", "failed", "failure", "rejected", "cancelled", "canceled"].includes(raw)) {
    return { status: "declined", message: responseMsg };
  }
  return { status: "pending", message: responseMsg };
}

function extractPaymentResultToken(result: unknown): string {
  if (typeof result === "string" && result.trim()) {
    return result.trim();
  }
  if (result && typeof result === "object") {
    const c = result as Record<string, unknown>;
    const t = c.paymentResultToken ?? c.transientToken ?? c.token ?? c.paymentResponse ?? c.jwt;
    if (typeof t === "string" && t.trim()) {
      return t.trim();
    }
  }
  return "";
}

// ─── Status Polling ──────────────────────────────────────────────────────────

async function checkPaymentStatus(runId: number) {
  if (!checkoutCode.value) {
    throw new Error("Checkout reference is missing. Please contact reception.");
  }

  const payload: Record<string, unknown> = {
    checkoutCode: checkoutCode.value,
  };
  if (paymentResultToken) {
    payload.paymentResultToken = paymentResultToken;
  }

  const response = await http.post(
    payment.value?.statusCheckPath ?? API_ENDPOINTS.PAYMENT.CYBERSOURCE_STATUS,
    payload,
  );

  if (runId !== activeRun) {
    return;
  }

  const result = normalizeStatus(response);
  if (result.status === "paid") {
    state.value = "processing";
    emit("paid", checkoutCode.value, response);
    return;
  }
  if (result.status === "declined") {
    state.value = "declined";
    message.value = result.message || "Your card payment was declined. Please verify your card details, billing address, or select another payment method.";
    return;
  }
  if (result.status === "review") {
    state.value = "review";
    message.value = result.message || "Your payment is under review. Our team will verify and confirm your order shortly.";
    return;
  }
  state.value = "pending";
}

async function pollUntilSettled(runId: number) {
  state.value = "processing";
  message.value = "Payment submitted. Verifying authorization with KORA…";

  for (let attempt = 0; attempt < 40; attempt++) {
    if (runId !== activeRun) {
      return;
    }
    try {
      await checkPaymentStatus(runId);
    }
    catch {
      if (runId !== activeRun) {
        return;
      }
      state.value = "pending";
      message.value = "Confirming your transaction with the bank…";
    }
    if (runId !== activeRun || state.value !== "pending") {
      return;
    }
    await new Promise(r => setTimeout(r, 3000));
  }

  // If still unsettled after ~120s
  if (runId === activeRun && state.value === "pending") {
    message.value = `Payment verification is taking longer than usual. Please do not close this window or contact KORA reception with Reference: ${shortRef.value}.`;
  }
}

// ─── Initialization ──────────────────────────────────────────────────────────

async function initializePayment() {
  disposeSdk();
  const runId = ++activeRun;
  paymentResultToken = "";
  state.value = "loading";
  message.value = "Connecting to CyberSource secure payment gateway…";

  loadingTimeoutId = setTimeout(() => {
    if (runId === activeRun && state.value === "loading") {
      disposeSdk();
      state.value = "error";
      message.value = "The secure card form took too long to load. Please check your internet connection and try again.";
    }
  }, 30_000);

  try {
    const currentCheckout = props.checkout;
    const info = payment.value;
    if (!currentCheckout || !info) {
      throw new Error("Secure card session details are missing. Please restart checkout.");
    }

    const sdk = getSdkDetails(info, currentCheckout);
    if (!sdk.captureContext || !sdk.clientLibrary || !sdk.clientLibraryIntegrity) {
      throw new Error("Secure card form details are incomplete. Please restart checkout.");
    }

    await loadScript(sdk.clientLibrary, sdk.clientLibraryIntegrity);
    if (runId !== activeRun) {
      return;
    }

    clearTimeout(loadingTimeoutId);
    loadingTimeoutId = undefined;

    const VAS = (window as WindowWithVAS).VAS?.UnifiedCheckout;
    if (!VAS) {
      throw new Error("Secure card checkout could not be initialized. Please try again.");
    }

    ucClient = await VAS(sdk.captureContext);
    if (runId !== activeRun) {
      return;
    }

    ucSession = await ucClient.createCheckout({
      autoProcessing: info.autoProcessing ?? currentCheckout.autoProcessing ?? true,
    });

    state.value = "ready";
    message.value = "";
    await nextTick();

    const paymentResult = await ucSession.mount({
      paymentSelection: "#cybersource-payment-selection",
      paymentScreen: "#cybersource-payment-screen",
    });

    if (runId !== activeRun) {
      return;
    }

    paymentResultToken = extractPaymentResultToken(paymentResult);
    await pollUntilSettled(runId);
  }
  catch (error: unknown) {
    if (runId !== activeRun) {
      return;
    }
    disposeSdk();
    state.value = "error";
    const err = error as { name?: string; message?: string; reason?: string };
    if (err && err.name === "UnifiedCheckoutError") {
      if (err.reason === "USER_CANCELLED" || err.reason === "CANCELLED") {
        message.value = "Payment was cancelled. You can try again when you are ready.";
      }
      else {
        message.value = err.message || err.reason || "Payment service encountered an issue. Please try again.";
      }
    }
    else {
      message.value = error instanceof Error
        ? error.message
        : "Secure card checkout could not start. Please try again.";
    }
  }
}

function close() {
  if (["loading", "processing", "pending"].includes(state.value)) {
    return;
  }
  activeRun++;
  disposeSdk();
  emit("close");
}

function forceClose() {
  activeRun++;
  disposeSdk();
  emit("close");
}

// ─── Watchers ────────────────────────────────────────────────────────────────

watch(
  () => [props.isOpen, props.checkout] as const,
  ([open, current]) => {
    if (open && current?.checkoutCode) {
      void initializePayment();
    }
    else {
      activeRun++;
      disposeSdk();
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  activeRun++;
  disposeSdk();
});
</script>

<template>
  <Teleport to="body">
    <Transition name="card-modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm"
        @mousedown.self="() => {}"
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="cs-modal-title"
          class="relative flex w-full max-w-xl flex-col max-h-[88vh] sm:max-h-[85vh] rounded-xs border border-border bg-card text-foreground shadow-2xl overflow-hidden"
        >
          <!-- ── Header (Pinned) ── -->
          <div class="shrink-0 flex items-center justify-between border-b border-border bg-card px-5 py-4 sm:px-6 z-10">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-lock" class="size-4 text-primary-700" />
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-700 leading-none">
                  Secure Checkout
                </p>
                <h2 id="cs-modal-title" class="font-serif text-lg sm:text-xl font-medium mt-0.5">
                  Card Payment
                </h2>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <!-- Accepted Card Schemes -->
              <div class="hidden sm:flex items-center gap-1.5">
                <span class="rounded-sm bg-[#1a1f71] px-1.5 py-0.5 text-[8px] font-bold text-white uppercase">VISA</span>
                <span class="rounded-sm bg-[#eb001b] px-1.5 py-0.5 text-[8px] font-bold text-white uppercase">MC</span>
              </div>

              <!-- Close button -->
              <button
                v-if="['ready', 'declined', 'error'].includes(state)"
                type="button"
                aria-label="Close card checkout"
                class="flex size-8 items-center justify-center border border-border text-muted-foreground transition hover:bg-muted"
                @click="close"
              >
                <UIcon name="i-lucide-x" class="size-4" />
              </button>
            </div>
          </div>

          <!-- ── Step Breadcrumbs / Progress Bar ── -->
          <div class="shrink-0 border-b border-border/40 bg-muted/30 px-5 py-2 sm:px-6">
            <div class="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
              <!-- Step 1: Order -->
              <div class="flex items-center gap-1.5 text-primary-700">
                <UIcon name="i-lucide-check-circle-2" class="size-3.5 text-primary-700" />
                <span>1. Order</span>
              </div>

              <div class="h-px w-6 sm:w-10 bg-border" />

              <!-- Step 2: Payment Details -->
              <div
                class="flex items-center gap-1.5"
                :class="currentStepNumber >= 2 ? 'text-foreground font-semibold' : 'text-muted-foreground'"
              >
                <span
                  class="flex size-4 items-center justify-center rounded-full text-[9px] font-bold"
                  :class="currentStepNumber === 2 ? 'bg-primary-700 text-white' : currentStepNumber > 2 ? 'bg-primary-700 text-white' : 'border border-border text-muted-foreground'"
                >
                  <UIcon
                    v-if="currentStepNumber > 2"
                    name="i-lucide-check"
                    class="size-2.5"
                  />
                  <span v-else>2</span>
                </span>
                <span>2. Card Details</span>
              </div>

              <div class="h-px w-6 sm:w-10 bg-border" />

              <!-- Step 3: Confirmation -->
              <div
                class="flex items-center gap-1.5"
                :class="currentStepNumber === 3 ? 'text-primary-700 font-semibold' : 'text-muted-foreground'"
              >
                <span
                  class="flex size-4 items-center justify-center rounded-full text-[9px] font-bold"
                  :class="currentStepNumber === 3 ? 'bg-primary-700 text-white' : 'border border-border text-muted-foreground'"
                >
                  3
                </span>
                <span>3. Confirmation</span>
              </div>
            </div>
          </div>

          <!-- ── Amount Bar (Pinned) ── -->
          <div
            v-if="checkout"
            class="shrink-0 flex items-center justify-between border-b border-border/40 bg-muted/10 px-5 py-2.5 sm:px-6 text-xs text-muted-foreground"
          >
            <span>
              Order Ref: <span class="font-mono font-semibold text-foreground">{{ shortRef }}</span>
            </span>
            <span class="font-number text-sm font-bold text-primary-700">
              {{ formattedAmount }}
            </span>
          </div>

          <!-- ── Body (Scrollable with proper height) ── -->
          <div class="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 cs-modal-scroll space-y-4">
            <!-- Message banner if any -->
            <p
              v-if="message && !['declined', 'error', 'pending', 'processing'].includes(state)"
              class="text-xs leading-relaxed text-muted-foreground"
            >
              {{ message }}
            </p>

            <!-- Loading Skeleton -->
            <div
              v-if="state === 'loading'"
              class="space-y-4 py-2"
            >
              <div class="space-y-2">
                <div class="h-3 w-28 rounded bg-muted/60 animate-pulse" />
                <div class="h-11 rounded-sm bg-muted/40 animate-pulse" />
              </div>
              <div class="space-y-2">
                <div class="h-3 w-24 rounded bg-muted/60 animate-pulse" />
                <div class="h-11 rounded-sm bg-muted/40 animate-pulse" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-2">
                  <div class="h-3 w-16 rounded bg-muted/60 animate-pulse" />
                  <div class="h-11 rounded-sm bg-muted/40 animate-pulse" />
                </div>
                <div class="space-y-2">
                  <div class="h-3 w-16 rounded bg-muted/60 animate-pulse" />
                  <div class="h-11 rounded-sm bg-muted/40 animate-pulse" />
                </div>
              </div>
              <div class="h-11 rounded-sm bg-primary/20 animate-pulse mt-4" />
              <div class="text-center pt-2">
                <button
                  type="button"
                  class="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                  @click="forceClose"
                >
                  Cancel and return
                </button>
              </div>
            </div>

            <!-- CyberSource Unified Checkout Frame Container -->
            <!-- Wrapped in a clean, framed light surface so the light-themed iframe renders seamlessly -->
            <div
              v-show="state === 'ready'"
              class="rounded-sm border border-border/60 bg-white p-3 sm:p-5 text-neutral-900 shadow-sm space-y-3"
            >
              <div id="cybersource-payment-selection" class="w-full" />
              <div id="cybersource-payment-screen" class="w-full" />
            </div>

            <!-- Processing / Pending Spinner -->
            <div
              v-if="state === 'processing' || state === 'pending'"
              class="flex flex-col items-center gap-4 py-8"
            >
              <div class="relative flex size-14 items-center justify-center">
                <div class="absolute inset-0 rounded-full border-2 border-border" />
                <div class="absolute inset-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <UIcon name="i-lucide-credit-card" class="size-5 text-primary-700" />
              </div>
              <div class="text-center space-y-1">
                <h4 class="font-serif text-base font-semibold text-foreground">
                  Confirming Your Payment
                </h4>
                <p class="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  {{ message || "Communicating with your card issuer and KORA server. Please do not close or reload this window." }}
                </p>
              </div>
            </div>

            <!-- Declined Status -->
            <div
              v-else-if="state === 'declined'"
              class="space-y-3"
            >
              <div class="flex items-start gap-3 border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                <UIcon name="i-lucide-ban" class="mt-0.5 size-4 shrink-0" />
                <div>
                  <p class="font-semibold text-xs uppercase tracking-wide mb-1">
                    Payment Declined
                  </p>
                  <p class="leading-relaxed text-xs">
                    {{ message }}
                  </p>
                </div>
              </div>
              <div class="flex flex-col gap-2 sm:flex-row">
                <base-button class="w-full" @click="initializePayment">
                  TRY AGAIN
                </base-button>
                <base-button
                  variant="outline"
                  class="w-full"
                  @click="emit('declined'); close()"
                >
                  CHANGE METHOD
                </base-button>
              </div>
            </div>

            <!-- Review Status -->
            <div
              v-else-if="state === 'review'"
              class="space-y-3"
            >
              <div class="flex items-start gap-3 border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                <UIcon name="i-lucide-info" class="mt-0.5 size-4 shrink-0 text-primary-700" />
                <div>
                  <p class="font-semibold text-xs uppercase tracking-wide text-foreground mb-1">
                    Payment Under Review
                  </p>
                  <p class="leading-relaxed text-xs">
                    {{ message }}
                  </p>
                  <p class="mt-2 font-mono text-xs font-semibold text-foreground">
                    Reference: {{ shortRef }}
                  </p>
                </div>
              </div>
              <base-button
                variant="outline"
                class="w-full"
                @click="close"
              >
                CLOSE
              </base-button>
            </div>

            <!-- Error Status -->
            <div
              v-else-if="state === 'error'"
              class="space-y-3"
            >
              <div class="flex items-start gap-3 border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                <UIcon name="i-lucide-alert-triangle" class="mt-0.5 size-4 shrink-0" />
                <div>
                  <p class="font-semibold text-xs uppercase tracking-wide mb-1">
                    Connection Error
                  </p>
                  <p class="leading-relaxed text-xs">
                    {{ message }}
                  </p>
                </div>
              </div>
              <div class="flex flex-col gap-2 sm:flex-row">
                <base-button class="w-full" @click="initializePayment">
                  TRY AGAIN
                </base-button>
                <base-button
                  variant="outline"
                  class="w-full"
                  @click="close"
                >
                  CLOSE
                </base-button>
              </div>
            </div>
          </div>

          <!-- ── Footer (Pinned) ── -->
          <div class="shrink-0 flex items-center justify-between border-t border-border bg-card px-5 py-3 sm:px-6 text-xs text-muted-foreground z-10">
            <div class="flex items-center gap-1.5">
              <UIcon name="i-lucide-shield-check" class="size-3.5 text-primary-700" />
              <span>PCI-DSS Level 1 · 256-bit TLS</span>
            </div>
            <span class="text-[10px] text-muted-foreground/75">CyberSource Secure</span>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.card-modal-enter-active,
.card-modal-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}

.card-modal-enter-from,
.card-modal-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

/* Custom Scrollbar for the scrollable body */
.cs-modal-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(181, 154, 109, 0.35) transparent;
}

.cs-modal-scroll::-webkit-scrollbar {
  width: 5px;
}

.cs-modal-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.cs-modal-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(181, 154, 109, 0.35);
  border-radius: 9999px;
}

.cs-modal-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(181, 154, 109, 0.7);
}

/* Make CyberSource iframes fill the width cleanly without overflow */
#cybersource-payment-screen :deep(iframe),
#cybersource-payment-selection :deep(iframe) {
  width: 100% !important;
  max-width: 100% !important;
  border: none !important;
  display: block !important;
}
</style>
