<script setup lang="ts">
import { onUnmounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import z from "zod";
import { useNotification } from "~/composables/use-notification";
import { useAuthStore } from "~/stores/auth";
import { getApiErrorMessage, isApiError } from "~/utils/error";
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Kora | Create Account",
  description: "Begin your ritual of becoming. Join the sanctuary.",
});

const authStore = useAuthStore();
const router = useRouter();
const { error: showError, success: showSuccess } = useNotification();

// ── Step management ───────────────────────────────────────────────────────────
type Step = "register" | "verify";
const step = ref<Step>("register");
const submittedEmail = ref("");

// ── Resend timer ──────────────────────────────────────────────────────────────
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

// ── Register step ─────────────────────────────────────────────────────────────
const loading = ref(false);
const apiError = reactive({
  email: null as string | null,
  phone: null as string | null,
  password: null as string | null,
});
const formRef = ref<InstanceType<typeof UForm> | null>(null);

const schema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    phone: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => {
          if (!val)
            return true;
          // Accept international phone formats (optional leading '+', digits, spaces, hyphens, dots, parentheses)
          if (!/^\+?[\d\s\-().]+$/.test(val))
            return false;
          const digits = val.replace(/\D/g, "");
          return digits.length >= 7 && digits.length <= 15;
        },
        "Please enter a valid phone number (e.g. +1 555 123 4567 or 98XXXXXXXX)",
      ),
    password: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
      .regex(/\d/, "New password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`';]/,
        "New password must contain at least one special character",
      ),
  })
  .superRefine((data, ctx) => {
    if (apiError.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: apiError.email,
      });
    }

    if (apiError.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: apiError.phone,
      });
    }

    if (apiError.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: apiError.password,
      });
    }
  });

type Schema = z.output<typeof schema>;

const registerFormState = reactive<Partial<Schema>>({
  fullName: "",
  email: "",
  phone: "",
  password: "",
});

function setApiError(
  field: "email" | "phone" | "password",
  message: string,
): void {
  apiError[field] = message;
}

function clearApiError(): void {
  apiError.email = null;
  apiError.phone = null;
  apiError.password = null;
}

async function handleGoogleLogin(): Promise<void> {
  try {
    loading.value = true;
    await authStore.loginWithGoogle();
  }
  catch (error) {
    console.error(error);
  }
  finally {
    loading.value = false;
  }
}

async function handleRegister(): Promise<void> {
  try {
    await formRef.value?.validate();
  }
  catch {
    return;
  }
  try {
    loading.value = true;
    clearApiError();
    const phoneTrimmed = registerFormState.phone?.trim();
    const payload = {
      fullName: registerFormState.fullName,
      email: registerFormState.email,
      phoneNumber: phoneTrimmed,
      password: registerFormState.password,
    };
    if (!payload.phoneNumber) {
      delete payload.phoneNumber;
    }
    const result = await authStore.register(
      payload as {
        fullName: string;
        email: string;
        phoneNumber?: string;
        password: string;
      },
    );

    if (result.verificationRequired) {
      submittedEmail.value = registerFormState.email ?? "";
      startTimer();
      step.value = "verify";
    }
    else {
      router.push({ name: "index" });
    }
  }
  catch (error: unknown) {
    const message = getApiErrorMessage(
      error,
      "Something went wrong. Please try again.",
    );

    if (isApiError(error)) {
      switch (error.data.code) {
        case "auth.password.invalid":
        case "auth.password.too_short":
          setApiError("password", message);
          formRef.value?.validate();
          return;

        case "conflict.this_phone_number_is_already_linked_to_another_user":
        case "auth.phone_number.invalid":
          setApiError("phone", message);
          formRef.value?.validate();
          return;

        case "conflict.this_email_is_already_linked_to_another_phone_number":
        case "conflict.a_member_account_already_exists_for_this_email":
          setApiError("email", message);
          formRef.value?.validate();
          return;
      }
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
    showSuccess({ message: "Email verified successfully. Welcome to Kora!" });
    router.push({ name: "index" });
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

function goBackToRegister(): void {
  step.value = "register";
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
    <!-- Left Panel: Form -->
    <div class="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 relative">
      <!-- Decorative Leaf (Top Right of Left Panel) -->
      <div
        class="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-20 -translate-y-10 translate-x-10"
      >
        <img
          :src="IMAGES.LEAF"
          class="w-full h-full object-cover rotate-12"
          alt=""
        >
      </div>

      <!-- Form Container -->
      <div class="w-full max-w-md mx-auto my-auto relative z-10">
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

        <!-- Step: Register -->
        <template v-if="step === 'register'">
          <h1 class="font-serif text-4xl mb-3 text-white">
            Create Account
          </h1>
          <p class="text-xs text-secondary-400 mb-10">
            Begin your ritual of becoming. Join the sanctuary.
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
            :state="registerFormState"
            :schema="schema"
            :validate-on="['input', 'change', 'blur']"
            class="mt-8 w-full space-y-4"
            @keypress.enter="handleRegister"
          >
            <base-input
              v-model="registerFormState.fullName"
              name="fullName"
              label="FULL NAME *"
              placeholder="Your full name"
              type="text"
              leading-icon="i-lucide-user"
            />
            <base-input
              v-model="registerFormState.email"
              name="email"
              label="EMAIL ADDRESS *"
              placeholder="Your email address"
              type="email"
              leading-icon="i-lucide-mail"
              @input="clearApiError"
            />
            <base-input
              v-model="registerFormState.phone"
              name="phone"
              label="PHONE NUMBER (OPTIONAL)"
              placeholder="e.g. +1 555 123 4567 or 98XXXXXXXX"
              type="tel"
              leading-icon="i-lucide-phone"
              @input="clearApiError"
            />
            <base-input
              v-model="registerFormState.password"
              name="password"
              label="PASSWORD *"
              placeholder="Create a password"
              type="password"
              leading-icon="i-lucide-lock"
              @input="clearApiError"
            />

            <base-button
              class="w-full"
              :loading="loading"
              @click="handleRegister"
            >
              REGISTER
            </base-button>
          </UForm>

          <p class="text-center text-xs text-secondary-400 mt-5">
            Already have an account?
            <NuxtLink
              to="/login"
              class="text-[#B59A6D] hover:text-[#C5AA7D] underline decoration-[#B59A6D]/30 underline-offset-4"
            >
              Log In
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
              We've sent a 6-digit verification code to<br>
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
            @click="goBackToRegister"
          >
            <span class="i-lucide-arrow-left w-3 h-3" />
            Change email address
          </button>
        </template>
      </div>

      <!-- Footer spacer -->
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
