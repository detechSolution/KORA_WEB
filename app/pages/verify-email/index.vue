<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import z from "zod";
import { useNotification } from "~/composables/use-notification";
import { useAuthStore } from "~/stores/auth";
import { getApiErrorMessage } from "~/utils/error";
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Kora | Verify Email",
  description: "Verify your email address to unlock your Kora sanctuary account.",
});

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { error: showError, success: showSuccess } = useNotification();

const loading = ref(false);
const resending = ref(false);
const formRef = ref<InstanceType<typeof UForm> | null>(null);
const apiError = ref<string | null>(null);

const resendTimer = ref(0);
let timerInterval: ReturnType<typeof setInterval> | null = null;

function startTimer() {
  resendTimer.value = 60;
  if (timerInterval)
    clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--;
    }
    else {
      if (timerInterval)
        clearInterval(timerInterval);
    }
  }, 1000);
}

onMounted(() => {
  // If the user is already authenticated and verified, redirect away
  if (authStore.isAuthenticated && authStore.user.isEmailVerified) {
    const redirect = (route.query.redirect as string) || "/";
    router.replace(redirect);
    return;
  }
  startTimer();
});

onUnmounted(() => {
  if (timerInterval)
    clearInterval(timerInterval);
});

const displayEmail = computed(() => {
  return (
    authStore.user.email
    || (route.query.email as string)
    || "your email address"
  );
});

const verifySchema = z
  .object({
    code: z.string().min(1, "Verification code is required"),
  })
  .superRefine((_, ctx) => {
    if (apiError.value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["code"],
        message: apiError.value,
      });
    }
  });

const verifyFormState = reactive({ code: "" });
const verifyCode = ref(["", "", "", "", "", ""]);

function handleCodeInput(): void {
  verifyFormState.code = verifyCode.value.join("");
  apiError.value = null;
}

async function handleVerify(): Promise<void> {
  try {
    await formRef.value?.validate();
  }
  catch {
    return;
  }
  try {
    loading.value = true;
    apiError.value = null;
    await authStore.verifyEmail({ code: verifyFormState.code });
    showSuccess({ message: "Email verified successfully. Welcome to Kora!" });
    const redirect = (route.query.redirect as string) || "/";
    router.push(redirect);
  }
  catch (error: unknown) {
    const message = getApiErrorMessage(
      error,
      "Invalid or expired verification code. Please try again.",
    );
    apiError.value = message;
    formRef.value?.validate();
  }
  finally {
    loading.value = false;
  }
}

async function handleResend(): Promise<void> {
  if (resendTimer.value > 0 || resending.value)
    return;
  try {
    resending.value = true;
    await authStore.resendVerificationEmail();
    showSuccess({
      message: "A new verification code has been sent to your email.",
    });
    startTimer();
  }
  catch (error: unknown) {
    const message = getApiErrorMessage(
      error,
      "Failed to resend code. Please try again later.",
    );
    showError({ message });
  }
  finally {
    resending.value = false;
  }
}

function handleSignOut(): void {
  authStore.logout();
  router.push({ name: "login" });
}
</script>

<template>
  <div class="min-h-screen w-full flex bg-[#151515] text-white overflow-hidden">
    <!-- Left Panel: Form -->
    <div class="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 relative">
      <!-- Decorative Leaf -->
      <div
        class="absolute top-0 right-0 w-96 h-96 pointer-events-none opacity-20 -translate-y-10 translate-x-10"
      >
        <img
          :src="IMAGES.LEAF"
          class="w-full h-full object-cover rotate-12"
          alt=""
        >
      </div>

      <!-- Logo -->
      <div class="mb-16 relative z-10">
        <NuxtLink
          to="/"
          class="flex items-center gap-3"
        >
          <img
            :src="IMAGES.WHITE_LOGO"
            alt="Kora Logo"
            class="w-44 h-w-28"
            onerror="this.style.display = 'none'"
          >
        </NuxtLink>
      </div>

      <!-- Main Container -->
      <div class="w-full max-w-md mx-auto my-auto relative z-10">
        <div class="flex items-center gap-2 mb-3">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#B59A6D]/20 text-[#B59A6D]">
            <span class="i-lucide-mail-check w-4 h-4" />
          </span>
          <span class="text-xs uppercase tracking-wider text-[#B59A6D] font-medium">Verification Required</span>
        </div>

        <h1 class="font-serif text-3xl md:text-4xl mb-3 text-white">
          Verify Your Email
        </h1>
        <p class="text-sm text-secondary-400 mb-8 leading-relaxed">
          Please enter the 6-digit verification code sent to<br>
          <span class="text-white font-medium mt-1 block break-all">{{ displayEmail }}</span>
        </p>

        <UForm
          ref="formRef"
          :state="verifyFormState"
          :schema="verifySchema"
          :validate-on="['input', 'change', 'blur']"
          class="w-full space-y-6"
          @keypress.enter="handleVerify"
        >
          <UFormField
            name="code"
            class="flex"
          >
            <UPinInput
              v-model="verifyCode"
              name="code"
              type="text"
              :length="6"
              size="lg"
              :ui="{
                root: 'flex items-center justify-center gap-4',
                base: `bg-white dark:bg-transparent text-xl ring-secondary-50 dark:ring-secondary-700 focus:ring-1 focus:outline-none placeholder:text-secondary-300 rounded-xs h-12 w-12 text-center`,
              }"
              @input="handleCodeInput"
            />
          </UFormField>

          <base-button
            class="w-full mt-2"
            :loading="loading"
            @click="handleVerify"
          >
            VERIFY EMAIL
          </base-button>

          <div
            class="mt-8 text-center text-sm text-secondary-400 flex flex-col items-center gap-2"
          >
            <p>
              Didn't receive the code?
              <button
                type="button"
                class="font-medium ml-1 transition-colors"
                :class="
                  resendTimer > 0 || resending
                    ? 'text-secondary-500 cursor-not-allowed'
                    : 'text-white hover:underline'
                "
                :disabled="resendTimer > 0 || resending"
                @click="handleResend"
              >
                {{ resending ? "Resending..." : "Resend code" }}
              </button>
            </p>
            <span
              v-if="resendTimer > 0"
              class="text-xs text-secondary-500"
            >
              Wait 00:{{ resendTimer.toString().padStart(2, "0") }} before
              resending
            </span>
          </div>
        </UForm>

        <div class="mt-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-secondary-400">
          <NuxtLink
            to="/"
            class="hover:text-white transition-colors flex items-center gap-1"
          >
            <span class="i-lucide-arrow-left w-3.5 h-3.5" />
            Back to Home
          </NuxtLink>

          <button
            v-if="authStore.isAuthenticated"
            type="button"
            class="text-[#B59A6D] hover:text-[#C5AA7D] transition-colors"
            @click="handleSignOut"
          >
            Sign out
          </button>
          <NuxtLink
            v-else
            to="/login"
            class="text-[#B59A6D] hover:text-[#C5AA7D] transition-colors"
          >
            Sign in
          </NuxtLink>
        </div>
      </div>

      <div class="mt-auto relative z-10" />
    </div>

    <!-- Right Panel: Image -->
    <div class="hidden lg:block lg:w-1/2 relative h-screen">
      <img
        :src="IMAGES.LOGIN"
        alt="Meditation"
        class="w-full h-full object-cover"
      >
    </div>
  </div>
</template>
