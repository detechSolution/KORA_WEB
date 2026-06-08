<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import z from "zod";
import { useNotification } from "~/composables/use-notification";
import { useAuthStore } from "~/stores/auth";
import { getApiErrorMessage } from "~/utils/error";
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Kora | Forgot Password",
  description: "Reset your password to regain access to your account.",
});

const authStore = useAuthStore();
const router = useRouter();
const { error: showError, success: showSuccess } = useNotification();

type Step = "email" | "otp" | "reset";

const step = ref<Step>("email");
const loading = ref(false);
const submittedEmail = ref("");
const submittedCode = ref("");

const emailFormRef = ref<InstanceType<typeof UForm> | null>(null);
const emailApiError = ref<string | null>(null);

const emailSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
  })
  .superRefine((_, ctx) => {
    if (emailApiError.value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: emailApiError.value,
      });
    }
  });

const emailFormState = reactive({ email: "" });

async function handleSubmitEmail(): Promise<void> {
  try {
    await emailFormRef.value?.validate();
  }
  catch {
    return;
  }
  try {
    loading.value = true;
    emailApiError.value = null;
    await authStore.forgotPassword({ email: emailFormState.email });
    submittedEmail.value = emailFormState.email;
    step.value = "otp";
  }
  catch (error: unknown) {
    const message = getApiErrorMessage(
      error,
      "Something went wrong. Please try again.",
    );
    if (message !== "Something went wrong. Please try again.") {
      emailApiError.value = message;
      emailFormRef.value?.validate();
      return;
    }
    showError({ message });
  }
  finally {
    loading.value = false;
  }
}

const otpFormRef = ref<InstanceType<typeof UForm> | null>(null);
const otpApiError = ref<string | null>(null);

const otpSchema = z
  .object({
    code: z.string().min(1, "OTP code is required"),
  })
  .superRefine((_, ctx) => {
    if (otpApiError.value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["code"],
        message: otpApiError.value,
      });
    }
  });

const otpFormState = reactive({ code: "" });

async function handleVerifyOtp(): Promise<void> {
  try {
    await otpFormRef.value?.validate();
  }
  catch {
    return;
  }
  try {
    loading.value = true;
    otpApiError.value = null;
    await authStore.verifyResetOtp({
      email: submittedEmail.value,
      code: otpFormState.code,
    });
    submittedCode.value = otpFormState.code;
    step.value = "reset";
  }
  catch (error: unknown) {
    const message = getApiErrorMessage(
      error,
      "Something went wrong. Please try again.",
    );
    if (message !== "Something went wrong. Please try again.") {
      otpApiError.value = message;
      otpFormRef.value?.validate();
      return;
    }
    showError({ message });
  }
  finally {
    loading.value = false;
  }
}

const resetFormRef = ref<InstanceType<typeof UForm> | null>(null);
const resetApiError = ref<string | null>(null);

const resetSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .superRefine((data, ctx) => {
    if (
      data.newPassword
      && data.confirmPassword
      && data.newPassword !== data.confirmPassword
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
    if (resetApiError.value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPassword"],
        message: resetApiError.value,
      });
    }
  });

const resetFormState = reactive({ newPassword: "", confirmPassword: "" });

async function handleResetPassword(): Promise<void> {
  try {
    await resetFormRef.value?.validate();
  }
  catch {
    return;
  }
  try {
    loading.value = true;
    resetApiError.value = null;
    await authStore.resetPassword({
      code: submittedCode.value,
      newPassword: resetFormState.newPassword,
    });
    showSuccess({ message: "Password updated successfully. Please log in." });
    router.push({ name: "login" });
  }
  catch (error: unknown) {
    const message = getApiErrorMessage(
      error,
      "Something went wrong. Please try again.",
    );
    if (message !== "Something went wrong. Please try again.") {
      resetApiError.value = message;
      resetFormRef.value?.validate();
      return;
    }
    showError({ message });
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen w-full flex bg-[#151515] text-white overflow-hidden">
    <!-- Left Panel: Form -->
    <div class="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 relative">
      <!-- Decorative Leaf -->
      <div
        class="absolute top-0 right-0 w-96 h-w-96 pointer-events-none opacity-20 -translate-y-10 translate-x-10"
      >
        <img
          :src="IMAGES.LEAF"
          class="w-full h-full object-cover rotate-12"
          alt=""
        >
      </div>

      <!-- Logo -->
      <div class="relative z-10 mb-0">
        <NuxtLink to="/" class="flex items-center gap-3">
          <img
            :src="IMAGES.WHITE_LOGO"
            alt="Kora Logo"
            class="w-44 h-w-28"
            onerror="this.style.display = 'none'"
          >
        </NuxtLink>
      </div>

      <!-- Form Container -->
      <div class="flex-1 flex items-center relative z-10">
        <div class="w-full max-w-md mx-auto">
          <!-- Step 1: Enter Email -->
          <template v-if="step === 'email'">
            <h1 class="font-serif text-4xl mb-3 text-white">
              Enter Your Email Address
            </h1>
            <p class="text-xs text-secondary-400 mb-6">
              Enter your email to receive a OTP code
            </p>

            <UForm
              ref="emailFormRef"
              :state="emailFormState"
              :schema="emailSchema"
              :validate-on="['input', 'change', 'blur']"
              class="mt-8 w-full space-y-4"
            >
              <base-input
                v-model="emailFormState.email"
                name="email"
                label="EMAIL ADDRESS"
                placeholder="Your email address"
                type="email"
                leading-icon="i-lucide-mail"
                class="bg-transparent"
                @input="emailApiError = null"
              />

              <base-button
                class="w-full"
                :loading="loading"
                @click="handleSubmitEmail"
              >
                SUBMIT
              </base-button>
            </UForm>
          </template>

          <!-- Step 2: Enter OTP -->
          <template v-else-if="step === 'otp'">
            <h1 class="font-serif text-4xl mb-3 text-white">
              Enter OTP Code
            </h1>
            <p class="text-xs text-secondary-400 mb-6">
              Enter OTP code sent to your email
            </p>

            <UForm
              ref="otpFormRef"
              :state="otpFormState"
              :schema="otpSchema"
              :validate-on="['input', 'change', 'blur']"
              class="mt-8 w-full space-y-4"
            >
              <base-input
                v-model="otpFormState.code"
                name="code"
                label="OTP CODE"
                placeholder="Enter OTP Code"
                type="text"
                leading-icon="i-lucide-key-round"
                class="bg-transparent"
                @input="otpApiError = null"
              />

              <base-button
                class="w-full"
                :loading="loading"
                @click="handleVerifyOtp"
              >
                NEXT
              </base-button>
            </UForm>
          </template>

          <!-- Step 3: Create New Password -->
          <template v-else-if="step === 'reset'">
            <h1 class="font-serif text-4xl mb-3 text-white">
              Create New Password
            </h1>
            <p class="text-xs text-secondary-400 mb-6">
              Create and confirm your new password
            </p>

            <UForm
              ref="resetFormRef"
              :state="resetFormState"
              :schema="resetSchema"
              :validate-on="['input', 'change', 'blur']"
              class="mt-8 w-full space-y-4"
            >
              <base-input
                v-model="resetFormState.newPassword"
                name="newPassword"
                label="CREATE PASSWORD"
                placeholder="Create a password"
                type="password"
                leading-icon="i-lucide-lock"
                class="bg-transparent"
                @input="resetApiError = null"
              />
              <base-input
                v-model="resetFormState.confirmPassword"
                name="confirmPassword"
                label="CONFIRM PASSWORD"
                placeholder="Confirm password"
                type="password"
                leading-icon="i-lucide-lock"
                class="bg-transparent"
              />

              <base-button
                class="w-full"
                :loading="loading"
                @click="handleResetPassword"
              >
                UPDATE PASSWORD
              </base-button>
            </UForm>
          </template>
        </div>
      </div>
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
