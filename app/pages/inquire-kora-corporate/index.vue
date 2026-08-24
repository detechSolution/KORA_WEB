<script setup lang="ts">
import type { CorporateInquire } from "~/types/inquire";
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
  title: "Kora Corporate | Inquiry Application",
  description: "Connect with Kora to begin your corporate inquiry.",
});

const inquireStore = useInquireStore();
const { error: showError, success: showSuccess } = useNotification();

const loading = ref(false);
const apiError = ref<string | null>(null);
const formRef = ref<any>(null);

const schema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  // company_phone: z.string().min(1, "Company phone number is required"),
  company_phone: z.string().min(1, "Company phone number is required"),
  company_mail: z
    .string()
    .min(1, "Company email address is required")
    .email("Invalid email address"),
  no_of_employees: z
    .number()
    .or(
      z
        .string()
        .min(1, "Number of employees is required")
        .regex(/^\d+$/, "Must be a valid number")
        .transform(Number),
    ),
  company_contact_person: z.string().min(1, "Contact person name is required"),
  company_contact_number: z
    .string()
    .min(1, "Contact person phone number is required"),
  message: z.string().min(1, "Inquiry is required"),
});

type Schema = z.output<typeof schema>;

const inquiryFormState = reactive<Partial<Schema>>({
  company_name: "",
  company_phone: "",
  company_mail: "",
  no_of_employees: undefined,
  company_contact_person: "",
  company_contact_number: "",
  message: "",
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
    value: "kora@gmail.com",
    href: "mailto:kora@gmail.com",
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
    value: "Golfutar, Budhanilkantha-08, Kathmandu 44600",
  },
  {
    icon: "i-lucide-instagram",
    label: "Instagram",
    value: "@lifeatkora",
    href: "https://www.instagram.com/lifeatkora/",
    external: true,
  },
];

function resetForm() {
  inquiryFormState.company_name = "";
  inquiryFormState.company_phone = "";
  inquiryFormState.company_mail = "";
  inquiryFormState.no_of_employees = undefined;
  inquiryFormState.company_contact_person = "";
  inquiryFormState.company_contact_number = "";
  inquiryFormState.message = "";
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
      company_name: inquiryFormState.company_name,
      company_phone: inquiryFormState.company_phone,
      company_mail: inquiryFormState.company_mail,
      no_of_employees: Number(inquiryFormState.no_of_employees),
      company_contact_person: inquiryFormState.company_contact_person,
      company_contact_number: inquiryFormState.company_contact_number,
      message: inquiryFormState.message,
    };

    await inquireStore.createCorporateInquire(payload as CorporateInquire);

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
    class="relative bg-background dark:bg-secondary-900 text-foreground dark:text-white transition-colors duration-300 min-h-screen"
  >
    <div
      class="absolute z-10 top-0 right-0 pointer-events-none select-none opacity-35 md:opacity-45 h-full overflow-hidden"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage decoration"
        class="w-full h-auto object-cover -translate-y-20 translate-x-20 opacity-50"
      >
    </div>

    <ClassHeader
      label="INQUIRY APPLICATION"
      title="Kora Corporate"
      class="relative z-20"
    />
    <div class="relative z-20 max-w-400 mx-auto px-4 md:px-8 lg:px-12">
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
          <p
            class="text-[10px] md:text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-6"
          >
            INQUIRY APPLICATION
          </p>

          <UForm
            ref="formRef"
            :state="inquiryFormState"
            :schema="schema"
            class="space-y-6"
            @submit.prevent="handleInquireSubmit"
          >
            <div class="grid gap-6 md:grid-cols-2">
              <base-input
                v-model="inquiryFormState.company_name"
                name="company_name"
                label="COMPANY NAME"
                placeholder="Company Name"
              />

              <base-input
                v-model="inquiryFormState.company_phone"
                name="company_phone"
                type="tel"
                label="COMPANY PHONE"
                placeholder="Company Phone Number"
              />
            </div>

            <div class="grid gap-6 md:grid-cols-2">
              <base-input
                v-model="inquiryFormState.company_mail"
                name="company_mail"
                type="email"
                label="COMPANY EMAIL ADDRESS"
                placeholder="Company Email Address"
              />

              <base-input
                v-model="inquiryFormState.no_of_employees"
                name="no_of_employees"
                type="text"
                label="NUMBER OF EMPLOYEES"
                placeholder="No. of Employees Using the Package"
              />
            </div>

            <div class="grid gap-6 md:grid-cols-2">
              <base-input
                v-model="inquiryFormState.company_contact_person"
                name="company_contact_person"
                label="COMPANY CONTACT PERSON NAME"
                placeholder="Contact Person Name"
              />

              <base-input
                v-model="inquiryFormState.company_contact_number"
                name="company_contact_number"
                type="tel"
                label="CONTACT PERSON PHONE"
                placeholder="Contact Person Phone Number"
                @keydown="preventInvalidNumberInput"
              />
            </div>

            <base-input
              v-model="inquiryFormState.message"
              name="message"
              type="textarea"
              label="YOUR INQUIRY FOR KORA"
              placeholder="What Transformation Are You Seeking?"
            />

            <base-button
              type="submit"
              :loading="loading"
              class="w-full justify-center text-xs font-bold uppercase tracking-[0.18em] py-3.5 mt-2"
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
