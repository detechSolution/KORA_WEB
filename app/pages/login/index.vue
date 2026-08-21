<script setup lang="ts">
import { reactive, ref } from "vue";
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
const { error: showError } = useNotification();

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
    await authStore.login(payload as { email: string; password: string });
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
          <NuxtLink to="/" class="flex items-center gap-3">
            <img
              :src="IMAGES.WHITE_LOGO"
              alt="Kora Logo"
              class="w-44 h-w-28"
              onerror="this.style.display = 'none'"
            >
          </NuxtLink>
        </div>

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
