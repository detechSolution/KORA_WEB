<script setup lang="ts">
import { onUnmounted, reactive, ref } from "vue";
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
  title: "Kora | Login",
  description: "Sign in to access your account and continue your experience.",
});

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { error: showError, success: showSuccess } = useNotification();

type Step = "login" | "verify";
const step = ref<Step>("login");
const submittedEmail = ref("");

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

onUnmounted(() => {
  if (timerInterval)
    clearInterval(timerInterval);
});

const loading = ref(false);
const apiError = ref<string | null>(null);
const formRef = ref<InstanceType<typeof UForm> | null>(null);

const schema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  })
  .superRefine((data, ctx) => {
    if (apiError.value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: apiError.value,
      });
    }
  });

type Schema = z.output<typeof schema>;

const loginFormState = reactive<Partial<Schema>>({
  email: "",
  password: "",
});

function setApiError(error: string): void {
  apiError.value = error;
}

function clearApiError(): void {
  apiError.value = null;
}

async function handleGoogleLogin(): Promise<void> {
  try {
    loading.value = true;
    await authStore.loginWithGoogle();
  }
  catch (error) {
    console.error("Error occurred while logging in with Google:", error);
  }
  finally {
    loading.value = false;
  }
}

async function handleLogin(): Promise<void> {
  try {
    await formRef.value?.validate();
  }
  catch {
    return;
  }
  try {
    loading.value = true;
    clearApiError();
    const payload = {
      email: loginFormState.email,
      password: loginFormState.password,
    };
    const result = await authStore.login(
      payload as { email: string; password: string },
    );

    // If user's email is not verified, require verification before proceeding
    if (result.isEmailVerified === false) {
      submittedEmail.value = loginFormState.email ?? "";
      step.value = "verify";
      startTimer();
      authStore.resendVerificationEmail().catch(() => {});
      return;
    }

    const redirect = route.query.redirect as string;
    if (redirect) {
      router.push(redirect);
    }
    else {
      router.push("/");
    }
  }
  catch (error: unknown) {
    const message = getApiErrorMessage(
      error,
      "Something went wrong. Please try again.",
    );
    if (message !== "Something went wrong. Please try again.") {
      setApiError(message);
      formRef.value?.validate();
      return;
    }
    showError({ message });
  }
  finally {
    loading.value = false;
  }
}

// ── Verify step ───────────────────────────────────────────────────────────────
const verifyFormRef = ref<InstanceType<typeof UForm> | null>(null);
const verifyApiError = ref<string | null>(null);

const verifySchema = z
  .object({
    code: z.string().min(1, "Verification code is required"),
  })
  .superRefine((_, ctx) => {
    if (verifyApiError.value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["code"],
        message: verifyApiError.value,
      });
    }
  });

const verifyFormState = reactive({ code: "" });
const verifyCode = ref(["", "", "", "", "", ""]);

function handleVerifyCodeInput(): void {
  verifyFormState.code = verifyCode.value.join("");
  verifyApiError.value = null;
}

async function handleVerifyEmail(): Promise<void> {
  try {
    await verifyFormRef.value?.validate();
  }
  catch {
    return;
  }
  try {
    loading.value = true;
    verifyApiError.value = null;
    await authStore.verifyEmail({ code: verifyFormState.code });
    showSuccess({ message: "Email verified successfully. Welcome back!" });
    const redirect = route.query.redirect as string;
    if (redirect) {
      router.push(redirect);
    }
    else {
      router.push("/");
    }
  }
  catch (error: unknown) {
    const message = getApiErrorMessage(
      error,
      "Something went wrong. Please try again.",
    );
    verifyApiError.value = message;
    verifyFormRef.value?.validate();
  }
  finally {
    loading.value = false;
  }
}

async function handleResendVerification(): Promise<void> {
  if (resendTimer.value > 0 || loading.value)
    return;
  try {
    loading.value = true;
    await authStore.resendVerificationEmail();
    showSuccess({ message: "Verification code resent. Please check your email." });
    startTimer();
  }
  catch (error: unknown) {
    const message = getApiErrorMessage(
      error,
      "Failed to resend verification code. Please try again.",
    );
    showError({ message });
  }
  finally {
    loading.value = false;
  }
}

function goBackToLogin(): void {
  step.value = "login";
  verifyCode.value = ["", "", "", "", "", ""];
  verifyFormState.code = "";
  verifyApiError.value = null;
  if (timerInterval)
    clearInterval(timerInterval);
  resendTimer.value = 0;
}
</script>

<template>
  <div class="min-h-screen w-full flex bg-[#151515] text-white overflow-hidden">
    <div class="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 relative">
      <div
        class="absolute top-0 right-0 w-96 h-w-96 pointer-events-none opacity-20 -translate-y-10 translate-x-10"
      >
        <img
          :src="IMAGES.LEAF"
          class="w-full h-full object-cover rotate-12"
          alt=""
        >
      </div>

      <!-- Form Container -->
      <div class="w-full max-w-md mx-auto relative z-10">
        <!-- Logo -->
        <div class="mb-26 relative z-10">
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

        <!-- Step: Login -->
        <template v-if="step === 'login'">
          <h1 class="font-serif text-4xl mb-3 text-white">
            Login
          </h1>
          <p class="text-xs text-secondary-400 mb-6">
            Sign in to access your account and continue your experience.
          </p>

          <base-button
            class="w-full h-11 bg-[#252525] dark:bg-[#252525] border border-white/5 hover:bg-[#2A2A2A] font-medium text-[11px] mb-5"
            @click="handleGoogleLogin"
          >
            <img
              :src="IMAGES.GOOGLE_LOGO"
              alt="Google"
              class="w-4 h-4"
            >
            Log in with Google
          </base-button>

          <base-section-label
            label="Or"
            align="center"
            class="mb-5"
          />

          <UForm
            ref="formRef"
            :state="loginFormState"
            :schema="schema"
            :validate-on="['input', 'change', 'blur']"
            class="mt-8 w-full space-y-4"
            @keypress.enter="handleLogin"
          >
            <base-input
              v-model="loginFormState.email"
              name="email"
              label="EMAIL ADDRESS"
              placeholder="Your email address"
              type="email"
              leading-icon="i-lucide-mail"
              class="bg-transparent"
              @input="clearApiError"
            />
            <base-input
              v-model="loginFormState.password"
              name="password"
              label="PASSWORD"
              placeholder="Your Password"
              type="password"
              leading-icon="i-lucide-lock"
              class="bg-transparent"
              @input="clearApiError"
            />

            <div class="flex items-center justify-between mt-1">
              <label
                class="flex items-center gap-2 cursor-pointer text-xs text-secondary-400 hover:text-white transition-colors"
              >
                <input
                  type="checkbox"
                  class="w-4 h-4 rounded-xs border-white/20 bg-transparent text-[#B59A6D] focus:ring-[#B59A6D] focus:ring-offset-0 focus:ring-offset-transparent"
                >
                Remember me
              </label>
              <NuxtLink
                to="/forgot-password"
                class="text-[11px] text-[#B59A6D] hover:text-[#C5AA7D] transition-colors"
              >
                Forgot Password?
              </NuxtLink>
            </div>

            <base-button
              class="w-full"
              :loading="loading"
              @click="handleLogin"
            >
              SIGN IN
            </base-button>
          </UForm>

          <p class="text-center text-xs text-secondary-400 mt-10">
            Don't have an account?
            <NuxtLink
              to="/register"
              class="text-[#B59A6D] hover:text-[#C5AA7D] underline decoration-[#B59A6D]/30 underline-offset-4"
            >
              Register Now
            </NuxtLink>
          </p>
        </template>

        <!-- Step: Verify Email -->
        <template v-else-if="step === 'verify'">
          <div class="flex flex-col">
            <h1 class="font-serif text-3xl md:text-4xl mb-3 text-white">
              Verify Your Email
            </h1>
            <p class="text-sm text-secondary-400 mb-8 max-w-sm">
              Your email is not verified yet. We've sent a 6-digit verification code to<br>
              <span class="text-white font-medium mt-1 block">{{ submittedEmail }}</span>
            </p>
          </div>

          <UForm
            ref="verifyFormRef"
            :state="verifyFormState"
            :schema="verifySchema"
            :validate-on="['input', 'change', 'blur']"
            class="w-full space-y-6"
            @keypress.enter="handleVerifyEmail"
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
                @input="handleVerifyCodeInput"
              />
            </UFormField>

            <base-button
              class="w-full mt-2"
              :loading="loading"
              @click="handleVerifyEmail"
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
                    resendTimer > 0
                      ? 'text-secondary-500 cursor-not-allowed'
                      : 'text-white hover:underline'
                  "
                  :disabled="resendTimer > 0"
                  @click="handleResendVerification"
                >
                  Resend code
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

          <button
            type="button"
            class="mt-6 text-xs text-secondary-400 hover:text-white transition-colors flex items-center gap-1 mx-auto"
            @click="goBackToLogin"
          >
            <span class="i-lucide-arrow-left w-3 h-3" />
            Back to login
          </button>
        </template>
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
