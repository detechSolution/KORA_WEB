<script setup lang="ts">
import type { CorporateInquire } from "~/types/inquire";
import { reactive, ref, watch } from "vue";
import z from "zod";
import { useNotification } from "~/composables/use-notification";
import { useInquireStore } from "~/stores/inquire";
import { getApiErrorMessage } from "~/utils/error";

const props = defineProps<{
  open: boolean;
  initialInterest?: string;
}>();
const emit = defineEmits<{ close: [] }>();

const inquireStore = useInquireStore();
const { error: showError, success: showSuccess } = useNotification();
const formRef = ref<any>(null);
const loading = ref(false);
const apiError = ref("");

const interestOptions = [
  { label: "Executive Membership (min 5)", value: "Executive Membership (min 5)" },
  { label: "Executive Membership (min 10)", value: "Executive Membership (min 10)" },
  { label: "Day-Pass Bundle (10-pack)", value: "Day-Pass Bundle (10-pack)" },
  { label: "Day-Pass Bundle (20-pack)", value: "Day-Pass Bundle (20-pack)" },
  { label: "Day-Pass Bundle (50-pack)", value: "Day-Pass Bundle (50-pack)" },
  { label: "Full-Day Sanctuary Buyout", value: "Full-Day Sanctuary Buyout" },
];

const schema = z.object({
  fullNameTitle: z.string().trim().min(1, "Full name and title are required"),
  organization: z.string().trim().min(1, "Company or organization is required"),
  email: z.string().trim().email("Enter a valid work email"),
  phone: z.string().trim().min(1, "Phone or WhatsApp number is required"),
  interest: z.string().min(1, "Select an area of interest"),
  preferredDate: z.string().min(1, "Select a preferred start or event date"),
  notes: z.string().optional(),
});

const formState = reactive({
  fullNameTitle: "",
  organization: "",
  email: "",
  phone: "",
  interest: "",
  preferredDate: "",
  notes: "",
});

function resetForm() {
  formState.fullNameTitle = "";
  formState.organization = "";
  formState.email = "";
  formState.phone = "";
  formState.interest = props.initialInterest || "";
  formState.preferredDate = "";
  formState.notes = "";
  apiError.value = "";
  formRef.value?.clear?.();
}

watch(() => props.open, (open) => {
  if (open)
    resetForm();
});

watch(() => props.initialInterest, (interest) => {
  if (props.open)
    formState.interest = interest || "";
});

function getRequestedGroupSize(interest: string): number {
  if (interest.includes("min 5"))
    return 5;
  if (interest.includes("min 10"))
    return 10;
  if (interest.includes("10-pack"))
    return 10;
  if (interest.includes("20-pack"))
    return 20;
  if (interest.includes("50-pack"))
    return 50;
  // The buyout is listed for up to 250 guests; this preserves the legacy
  // required API field while the inquiry details remain explicit in message.
  return 250;
}

async function submitInquiry() {
  try {
    await formRef.value?.validate();
  }
  catch {
    return;
  }

  loading.value = true;
  apiError.value = "";
  const message = [
    `Contact title: ${formState.fullNameTitle}`,
    `Area of interest: ${formState.interest}`,
    `Preferred start/event date: ${formState.preferredDate}`,
    formState.notes.trim() ? `Additional notes: ${formState.notes.trim()}` : "",
  ].filter(Boolean).join("\n");

  const payload: CorporateInquire = {
    company_name: formState.organization,
    company_phone: formState.phone,
    company_mail: formState.email,
    no_of_employees: getRequestedGroupSize(formState.interest),
    company_contact_person: formState.fullNameTitle,
    company_contact_number: formState.phone,
    message,
  };

  try {
    await inquireStore.createCorporateInquire(payload);
    showSuccess({ message: "Thank you. Our team will contact you shortly." });
    emit("close");
  }
  catch (error) {
    const message = getApiErrorMessage(error, "We couldn’t send your inquiry. Please try again.");
    apiError.value = message;
    showError({ message });
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <base-modal
    :open="open"
    title="Corporate Inquiry"
    description="Tell us a little about your team and we’ll be in touch."
    :modal-width="700"
    modal-max-height="90vh"
    dismissible
    @close="emit('close')"
  >
    <UForm
      ref="formRef"
      :state="formState"
      :schema="schema"
      class="space-y-5"
      @submit.prevent="submitInquiry"
    >
      <div class="grid gap-4 sm:grid-cols-2">
        <base-input
          v-model="formState.fullNameTitle"
          name="fullNameTitle"
          label="FULL NAME & TITLE"
          placeholder="e.g. Alex Smith, HR Director"
          required
        />
        <base-input
          v-model="formState.organization"
          name="organization"
          label="COMPANY / ORGANIZATION"
          placeholder="Organization name"
          required
        />
        <base-input
          v-model="formState.email"
          name="email"
          type="email"
          label="WORK EMAIL"
          placeholder="you@company.com"
          required
        />
        <base-input
          v-model="formState.phone"
          name="phone"
          type="tel"
          label="PHONE / WHATSAPP"
          placeholder="+977 ..."
          required
        />
      </div>

      <base-select
        v-model="formState.interest"
        name="interest"
        label="AREA OF INTEREST"
        placeholder="Choose an option"
        :options="interestOptions"
        required
      />

      <base-input
        v-model="formState.preferredDate"
        name="preferredDate"
        type="date"
        label="PREFERRED START OR EVENT DATE"
        required
      />

      <base-input
        v-model="formState.notes"
        name="notes"
        type="textarea"
        label="ADDITIONAL NOTES (OPTIONAL)"
        placeholder="Share any preferences or questions"
      />

      <p
        v-if="apiError"
        role="alert"
        class="text-sm text-red-600"
      >
        {{ apiError }}
      </p>

      <base-button
        type="submit"
        :loading="loading"
        :disabled="loading"
        class="w-full justify-center"
      >
        Send inquiry
      </base-button>
    </UForm>
  </base-modal>
</template>
