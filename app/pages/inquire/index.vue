<script setup lang="ts">
import type { Inquire } from "~/types/inquire";
import { reactive, ref } from "vue";

import z from "zod";
import { useNotification } from "~/composables/use-notification";
import { useInquireStore } from "~/stores/inquire";
import { getApiErrorMessage } from "~/utils/error";
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Inquire For Residency",
  description:
    "Connect with Kora to begin your residency inquiry and explore a more intentional way of living.",
});

const inquireStore = useInquireStore();
const { error: showError, success: showSuccess } = useNotification();

const loading = ref(false);
const apiError = ref<string | null>(null);
const formRef = ref<InstanceType<typeof UForm> | null>(null);

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Invalid email address"),
  inquiry: z.string().min(1, "Inquiry is required"),
});

type Schema = z.output<typeof schema>;

const inquiryFormState = reactive<Partial<Schema>>({
  fullName: "",
  phone: "",
  email: "",
  inquiry: "",
});

function setApiError(error: string): void {
  apiError.value = error;
}

function clearApiError(): void {
  apiError.value = null;
}

const contactItems = [
  {
    icon: "i-lucide-mail",
    label: "Email",
    value: "info@koranepal.com",
    href: "mailto:info@koranepal.com",
    external: false,
  },
  {
    icon: "i-lucide-phone",
    label: "Phone",
    value: "01-4785467, 9845787654",
    href: "tel:+97714785467",
    external: false,
  },
  {
    icon: "i-lucide-map-pin",
    label: "Address",
    value: "Hattisar, Kathmandu, Nepal",
  },
  {
    icon: "i-lucide-instagram",
    label: "Instagram",
    value: "@lifeatkora",
    href: "https://instagram.com",
    external: true,
  },
];
function resetForm() {
  inquiryFormState.fullName = "";
  inquiryFormState.phone = "";
  inquiryFormState.email = "";
  inquiryFormState.inquiry = "";
}

async function handleInquireSubmit() {
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
      fullName: inquiryFormState.fullName,
      phone: inquiryFormState.phone,
      email: inquiryFormState.email,
      inquiry: inquiryFormState.inquiry,
    };
    await inquireStore.createInquire(payload as Inquire);
    showSuccess({ message: "Inquiry submitted successfully" });
    resetForm();
  }
  catch (error) {
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
  <section
    class="relative bg-background dark:bg-secondary-900 text-foreground dark:text-white transition-colors duration-300"
  >
    <div
      class="absolute z-100 top-0 right-0 pointer-events-none select-none opacity-35 md:opacity-45"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage decoration"
        class="w-full h-full object-cover -translate-y-20"
      >
    </div>

    <ClassHeader
      label="Inquiry Application"
      title="Inquire For Residency"
      class=""
    />
    <div class="relative z-10 max-w-400 mx-auto px-4 md:px-8 lg:px-12">
      <div class="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12 py-12">
        <div class="space-y-6 lg:col-span-1">
          <p
            class="max-w-sm text-sm md:text-[15px] leading-7 text-foreground/75 dark:text-white/70"
          >
            Contact us directly for more information, and our team will be happy
            to assist you with any questions or guidance you may need.
          </p>

          <div
            class="border border-border bg-card/70 dark:bg-card px-5 py-6 md:px-6 md:py-7"
          >
            <p
              class="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary"
            >
              Direct Contact
            </p>

            <div class="mt-6 space-y-5">
              <div
                v-for="item in contactItems"
                :key="item.label"
                class="flex items-start gap-3 text-sm text-foreground/75 dark:text-white/75"
              >
                <UIcon
                  :name="item.icon"
                  class="mt-0.5 h-4 w-4 shrink-0 text-primary"
                />

                <a
                  v-if="item.href"
                  :href="item.href"
                  :target="item.external ? '_blank' : undefined"
                  :rel="item.external ? 'noopener noreferrer' : undefined"
                  class="leading-6 transition-colors duration-200 hover:text-primary"
                >
                  {{ item.value }}
                </a>

                <p v-else class="leading-6">
                  {{ item.value }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2">
          <p class="text-lg font-semibold uppercase text-primary-700">
            Inquiry Application
          </p>

          <UForm
            ref="formRef"
            :state="inquiryFormState"
            :schema="schema"
            class="mt-6 space-y-5"
            @submit.prevent="handleInquireSubmit"
          >
            <div class="grid gap-5 md:grid-cols-2">
              <base-input
                v-model="inquiryFormState.fullName"
                name="fullName"
                label="Full Name"
                placeholder="Your Name"
              />

              <base-input
                v-model="inquiryFormState.phone"
                name="phone"
                type="tel"
                label="Phone"
                placeholder="Your Phone Number"
              />
            </div>

            <base-input
              v-model="inquiryFormState.email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="Your email address"
            />

            <base-input
              v-model="inquiryFormState.inquiry"
              name="inquiry"
              type="textarea"
              label="Your Inquiry For Kora"
              placeholder="What Transformation Are You Seeking?"
            />

            <base-button
              type="submit"
              :loading="loading"
              class="w-full justify-center text-xs uppercase tracking-[0.18em]"
            >
              Submit Inquiry
            </base-button>
          </UForm>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
