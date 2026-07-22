<script setup lang="ts">
import { reactive, ref } from "vue";
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
const { error: showError } = useNotification();

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
    phone: z.string().min(1, "Phone number is required"),
    password: z.string().min(1, "Password is required"),
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

function setApiError(field: "email" | "phone" | "password", message: string): void {
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
    const payload = {
      fullName: registerFormState.fullName,
      email: registerFormState.email,
      phoneNumber: registerFormState.phone,
      password: registerFormState.password,
    };
    await authStore.register(
      payload as {
        fullName: string;
        email: string;
        phoneNumber?: string;
        password: string;
      },
    );
    router.push({ name: "index" });
  }
  catch (error: unknown) {
    const message = getApiErrorMessage(
      error,
      "Something went wrong. Please try again.",
    );
    if (message !== "Something went wrong. Please try again.") {
      if (isApiError(error) && error.data.code === "auth.password.invalid") {
        setApiError("password", message);
      }
      if (isApiError(error) && error.data.code === "conflict.this_phone_number_is_already_linked_to_another_user") {
        setApiError("phone", message);
      }
      if (isApiError(error) && error.data.code === "conflict.this_email_is_already_linked_to_another_phone_number") {
        setApiError("email", message);
      }
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
            label="PHONE NUMBER *"
            placeholder="Your phone number"
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
