<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";
import { reactive, ref } from "vue";
import z from "zod";
import { useNotification } from "~/composables/use-notification";
import { API_ENDPOINTS } from "~/config/constants";
import { useAuthStore } from "~/stores/auth";
import { getApiErrorMessage } from "~/utils/error";
import { formatDate } from "~/utils/format";

type Guest = {
  guestName: string;
  guestPhone: string;
  guestEmail: string;
};

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits<{
  close: [];
  created: [];
}>();

const authStore = useAuthStore();
const http = getHttp();
const { success, error: showError } = useNotification();

const currentStep = ref(0);
const isSubmitting = ref(false);
const formRef = ref<InstanceType<typeof UForm> | null>(null);

const state = reactive({
  guests: [{ guestName: "", guestPhone: "", guestEmail: "" }] as Guest[],
  date: null as DateValue | null,
});

const steps = [{ label: "Attendees" }, { label: "Select Date" }];

const guestSchema = z.object({
  guests: z
    .array(
      z.object({
        guestName: z.string().trim().min(1, "Full name is required"),
        guestPhone: z.string().trim().optional(),
        guestEmail: z
          .string()
          .trim()
          .email("Please enter a valid email address"),
      }),
    )
    .min(1, "At least one guest is required"),
});

const dateSchema = z.object({
  date: z.any().refine(v => !!v, "Please select a date"),
});

function isDateUnavailable(date: DateValue) {
  return date.compare(today(getLocalTimeZone())) < 0;
}

function addGuest() {
  state.guests.push({ guestName: "", guestPhone: "", guestEmail: "" });
}

function removeGuest(index: number) {
  if (state.guests.length > 1) {
    state.guests.splice(index, 1);
  }
}

async function validateCurrentStep(): Promise<boolean> {
  try {
    await formRef.value?.validate();
    return true;
  }
  catch {
    return false;
  }
}

function goToStep(step: number) {
  if (step > currentStep.value) {
    void validateCurrentStep().then((isValid) => {
      if (isValid)
        currentStep.value = step;
    });
    return;
  }
  currentStep.value = step;
}

function nextStep() {
  void validateCurrentStep().then((isValid) => {
    if (isValid)
      currentStep.value = 1;
  });
}

function previousStep() {
  currentStep.value = 0;
}

function reset() {
  currentStep.value = 0;
  isSubmitting.value = false;
  state.guests = [{ guestName: "", guestPhone: "", guestEmail: "" }];
  state.date = null;
}

function close() {
  reset();
  emit("close");
}

async function createGuestPass() {
  const isValid = await validateCurrentStep();
  if (!isValid)
    return;

  if (!authStore.isAuthenticated) {
    showError({ message: "Please log in to create a guest pass." });
    return;
  }

  isSubmitting.value = true;
  try {
    await http.post(API_ENDPOINTS.PASS.CREATE_GUEST, {
      guests: state.guests.map(g => ({
        guestName: g.guestName,
        guestEmail: g.guestEmail,
        guestPhone: g.guestPhone || "",
      })),
      validOn: formatDate(state.date as any, "YYYY-MM-DD"),
    });

    success({ message: "Guest pass created successfully!" });
    emit("created");
    close();
  }
  catch (err) {
    showError({
      message: getApiErrorMessage(
        err,
        "Failed to create guest pass. Please try again.",
      ),
    });
  }
  finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <base-modal
    title=""
    :open="isOpen"
    :modal-width="700"
    modal-max-height="90vh"
    :dismissible="true"
    class="dark:bg-nirvana-mist"
    @close="close"
  >
    <div class="p-6 md:p-10">
      <!-- Stepper -->
      <base-form-stepper
        :steps="steps"
        :current-step="currentStep"
        orientation="horizontal"
        class="mb-8"
        @select="goToStep"
      />

      <UForm
        ref="formRef"
        :schema="currentStep === 0 ? guestSchema : dateSchema"
        :state="state"
      >
        <Transition name="fade" mode="out-in">
          <!-- Step 1: Guest Details -->
          <div
            v-if="currentStep === 0"
            key="step1"
            class="flex flex-col"
          >
            <div class="mb-8">
              <h2 class="text-3xl font-serif text-foreground mb-2">
                Guest Details
              </h2>
              <p class="text-xs text-[#A08860]">
                Add any additional guests joining the session, or simply click
                next to continue.
              </p>
            </div>

            <div class="w-full h-px bg-border/40 mb-6" />

            <!-- Guest forms -->
            <div class="flex flex-col gap-8">
              <div
                v-for="(guest, index) in state.guests"
                :key="index"
                class="flex flex-col gap-4"
              >
                <div v-if="index > 0" class="flex items-center justify-between">
                  <h4 class="text-sm font-serif text-[#A08860]">
                    Guest {{ index + 1 }}
                  </h4>
                  <button
                    type="button"
                    class="text-xs text-red-700 hover:text-red-600 transition-colors flex items-center gap-1"
                    @click="removeGuest(index)"
                  >
                    <UIcon name="i-lucide-trash-2" class="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>

                <base-input
                  v-model="guest.guestName"
                  :name="`guests.${index}.guestName`"
                  label="FULL NAME *"
                  placeholder="Enter guest's full name"
                  type="text"
                  class="bg-white dark:bg-transparent"
                />

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <base-input
                    v-model="guest.guestPhone"
                    :name="`guests.${index}.guestPhone`"
                    label="PHONE NUMBER"
                    placeholder="Enter guest's phone number"
                    type="text"
                    class="bg-white dark:bg-transparent"
                  />

                  <base-input
                    v-model="guest.guestEmail"
                    :name="`guests.${index}.guestEmail`"
                    label="EMAIL ADDRESS *"
                    placeholder="Enter guest's email"
                    type="email"
                    class="bg-white dark:bg-transparent"
                  />
                </div>
              </div>
            </div>

            <!-- Add Guest -->
            <button
              type="button"
              class="mt-6 w-full border border-[#A08860] text-[#A08860] hover:bg-[#A08860]/10 transition-colors py-3 text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2"
              @click="addGuest"
            >
              ADD GUEST +
            </button>

            <div class="flex justify-end mt-8">
              <base-button
                class="uppercase text-[11px] tracking-widest font-bold px-10 h-11 rounded-none bg-[#A08860] hover:bg-[#8c7550] text-white"
                @click="nextStep"
              >
                Next
              </base-button>
            </div>
          </div>

          <!-- Step 2: Select Date -->
          <div
            v-else
            key="step2"
            class="flex flex-col gap-6"
          >
            <div>
              <h2 class="text-3xl font-serif text-foreground mb-2">
                Choose Your Date &amp; Time
              </h2>
              <p class="text-xs text-[#A08860]">
                Pick a time that works best for your relaxation
              </p>
            </div>

            <UFormField name="date" class="flex flex-col gap-3">
              <p
                class="text-[10px] font-bold tracking-widest uppercase text-[#A08860]"
              >
                SELECT DATE
              </p>
              <UCalendar
                v-model="state.date"
                :is-date-unavailable="isDateUnavailable"
                :ui="{
                  headCell: 'text-xs font-normal',
                  gridBody: 'grid gap-2 sm:gap-4',
                  cellTrigger:
                    'w-full rounded-none flex flex-col h-8 w-8 p-1 sm:h-10 sm:w-10 sm:p-2 border border-border',
                }"
              />
            </UFormField>

            <div class="flex justify-between items-center mt-4">
              <base-button
                variant="outline"
                class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none"
                @click="previousStep"
              >
                Back
              </base-button>
              <base-button
                class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none bg-[#A08860] hover:bg-[#8c7550] text-white"
                :loading="isSubmitting"
                @click="createGuestPass"
              >
                Create Guest Pass
              </base-button>
            </div>
          </div>
        </Transition>
      </UForm>
    </div>
  </base-modal>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
