<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import * as z from "zod";
import { useSpaStore } from "~/stores/spa";
import { getApiErrorMessage } from "~/utils/error";
import { useCartStore } from "~/stores/cart";
import { getLocalTimeZone } from "@internationalized/date";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);

const spaStore = useSpaStore();
const { error: showError, success } = useNotification();
const cartStore = useCartStore();
const spa = computed(() => spaStore.spa);

const steps = [
  { label: "Select Sub-Type" },
  { label: "Date & Time" },
  { label: "Add Guest" },
  { label: "Overview" },
];


const currentStep = ref(0);
const formRef = ref<InstanceType<typeof UForm> | null>(null);
const availableTimeSlots = ref<{ time: string; label: string }[]>([]);
const isTimeSlotLoading = ref(false);
const selectedSpaModel = defineModel<any>("selectedSpa");

const defaultOpenSubtype = computed(() => {
  if (!selectedSpaModel.value?.referenceId || !spa.value?.subTypes) return undefined;
  const index = spa.value.subTypes.findIndex((st: any) => st.id === selectedSpaModel.value.referenceId);
  return index !== -1 ? String(index) : undefined;
});

const state = reactive({
  selectedSpa: null as any,
  selectedDate: null as any,
  selectedTime: undefined as string | undefined,
  guests: [] as { fullName: string; phone: string; email: string }[],
});

const schema = [
  // Step 0
  z.object({
    selectedSpa: z.object(
      { id: z.union([z.string(), z.number()]) },
      {
        message: "Please select a spa",
      },
    ),
  }),
  // Step 1
  z.object({
    selectedDate: z.any().refine((v) => !!v, "Please select a date"),
    selectedTime: z.string().min(1, "Please select a time"),
  }),
 // Step 2
z.object({
  guests: z.array(
    z.object({
      fullName: z.string().min(1, "Please enter the full name"),
      phone: z.string().min(1, "Please enter a phone number"),
      email: z.string().email("Please enter a valid email"),
    }),
  ),
}),
];

async function validateCurrentStep(): Promise<boolean> {
  try {
    await formRef.value?.validate({ name: undefined });
    return true;
  } catch {
    return false;
  }
}

function goToStep(step: number) {
  if (step <= currentStep.value) {
    currentStep.value = step;
    return;
  }
  void validateCurrentStep().then((isValid) => {
    if (isValid) currentStep.value = step;
  });
}

function nextStep() {
  void validateCurrentStep().then((isValid) => {
    if (isValid && currentStep.value < steps.length - 1) {
      currentStep.value += 1;
    }
  });
}

function previousStep() {
  if (currentStep.value > 0) currentStep.value -= 1;
}

const handleBookingClick = (spaData: any) => {
  state.selectedSpa = spaData;
  selectedSpaModel.value = spaData;
}

function selectTime(time: string) {
  state.selectedTime = time;
}

function addGuest() {
  state.guests.push({ fullName: "", phone: "", email: "" });
}

function removeGuest(index: number) {
  if (state.guests.length > 1) state.guests.splice(index, 1);
}

function close() {
  emit("close");
}

const spaItem = computed(() => ({
  id: spa.value?.id,
  title: spa.value?.name,
  price: state.selectedSpa?.price,
  duration: state.selectedSpa?.duration,
  timeUnit: state.selectedSpa?.timeUnit,
  bookingDate: state.selectedDate.toDate(getLocalTimeZone()),
  bookingTime: state.selectedTime,
  visitors: state.guests.slice(1),
  referenceId: state.selectedSpa?.referenceId,
}));

const addToCart = () => {
  cartStore.addToCart(spaItem.value);
  success({ message: "Item added to cart successfully!" });
  close();
  state.selectedSpa = null;
  state.selectedDate = null;
  state.selectedTime = undefined;
  selectedSpaModel.value = null;
  state.guests = [];
};

async function fetchAvailableTimes() {
  if (!state.selectedDate || !state.selectedSpa) return;
  try {
    isTimeSlotLoading.value = true;
    const params = {
      bookingDate: state.selectedDate?.toString?.() ?? state.selectedDate,
      duration: state.selectedSpa?.duration,
      timeUnit: state.selectedSpa?.timeUnit,
    };
    const response = await spaStore.getAvailableTimes(params);
    availableTimeSlots.value = Array.isArray(response) ? response : [];
  } catch (error) {
    showError({
      message: getApiErrorMessage(error, "Failed to load available times"),
    });
  }finally{
    isTimeSlotLoading.value = false;
  }
}
onMounted(() => {
  try {
    const raw = localStorage.getItem("user_data");
    if (raw) {
      const user = JSON.parse(raw);
      state.guests[0] = {
        fullName: user.name ?? "",
        phone: user.phone ?? "",
        email: user.email ?? "",
      };
    }
  } catch(error) {
    console.log(error);
  }

  if (selectedSpaModel.value) {
    state.selectedSpa = selectedSpaModel.value;
  }
});
watch(
  () => state.selectedDate,
  () => {
    state.selectedTime = undefined;
    fetchAvailableTimes();
  },
);
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
    <div class="p-4">
      <base-form-stepper
        :steps="steps"
        :current-step="currentStep"
        orientation="horizontal"
        class="mb-8"
        @select="goToStep"
      />

      <UForm ref="formRef" :schema="schema[currentStep]" :state="state">
        <Transition name="fade" mode="out-in">
          <!-- Step 1: Select Spa Type -->
          <div v-if="currentStep === 0" key="step1" class="flex flex-col">
            <div class="mb-8">
              <h2 class="text-3xl font-serif text-foreground mb-3">
                Select a Spa Type
              </h2>
              <p class="text-xs text-[#A08860]">
                Choose your ideal massage treatment
              </p>
            </div>

            <UAccordion
              :items="spa?.subTypes"
              :default-value="defaultOpenSubtype"
              class="mb-2"
              :ui="{
                root: 'w-full flex flex-col gap-4',
                item: 'border border-border dark:bg-[#212121] p-6 dark:text-white font-serif rounded-xs',
                label: 'text-xl',
                body: 'mt-4',
              }"
            >
              <template #default="{ item }">
                <div class="flex flex-col">
                  <span>{{ item.name }}</span>
                  <p
                    class="text-sm text-foreground/80 dark:text-secondary-500 mt-4"
                  >
                    {{ item.description }}
                  </p>
                </div>
              </template>

              <template #content="{ item }">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div
                    v-for="duration in item.prices"
                    :key="duration.id"
                    class="group relative border border-white/10 rounded-xs p-4 flex flex-col justify-between transition-all duration-300 cursor-pointer"
                    :class="
                      state.selectedSpa?.id === duration.id
                        ? 'bg-primary-500 text-white dark:bg-primary'
                        : 'bg-[#c9a55a]/10 dark:bg-[#2A2722]'
                    "
                    @click="handleBookingClick({ ...duration, name: item.name, referenceId: item.id })"
                  >
                    <div
                      class="flex items-center gap-2 text-xs uppercase"
                      :class="
                        state.selectedSpa?.id === duration.id
                          ? 'text-white'
                          : 'text-primary-700'
                      "
                    >
                      <UIcon name="i-lucide-clock" class="h-3.5 w-3.5" />
                      <span class="text-sm">
                        {{ duration.duration }} {{ duration.timeUnit }}
                      </span>
                    </div>
                    <p class="text-3xl font-medium text-foreground mt-3">
                      {{ duration.price }}
                    </p>
                  </div>
                </div>
              </template>
            </UAccordion>

            <p
              v-if="formRef?.errors?.selectedSpa"
              class="text-xs text-red-600 mt-2"
            >
              Please select a spa.
            </p>
          </div>

          <!-- Step 2: Date & Time -->
          <div
            v-else-if="currentStep === 1"
            key="step2"
            class="flex flex-col gap-8"
          >
            <div>
              <h2 class="text-3xl font-serif text-foreground mb-3">
                Choose Your Date & Time
              </h2>
              <p class="text-xs text-[#A08860]">
                Pick a time that works best for your relaxation
              </p>
            </div>

            <UFormField
              name="selectedDate"
              class="flex flex-col gap-4 border-b border-border pb-6"
            >
              <p class="text-primary-700 font-medium text-sm capitalize">
                Select Date
              </p>
              <UCalendar
                v-model="state.selectedDate"
                :ui="{
                  headCell: 'text-xs font-normal',
                  gridBody: 'grid gap-2 sm:gap-4',
                  cellTrigger:
                    'w-full rounded-none flex flex-col h-8 w-8 p-1 sm:h-12 sm:w-12 sm:p-2 border border-border',
                }"
              />
            </UFormField>

            <div>
              <!-- Loading skeleton -->
              <div v-if="isTimeSlotLoading" class="flex flex-col gap-4 mb-6">
                <p class="text-primary-700 font-medium mb-2 text-sm capitalize">
                  Select Time
                </p>
                <div class="grid grid-cols-3 gap-4">
                  <div
                    v-for="n in 6"
                    :key="n"
                    class="h-[56px] border border-border bg-stone-100 dark:bg-[#2A2722] animate-pulse"
                  />
                </div>
              </div>

              <UFormField
                v-else-if="availableTimeSlots.length > 0"
                name="selectedTime"
                class="flex flex-col gap-4 mb-6"
              >
                <p class="text-primary-700 font-medium mb-2 text-sm capitalize">
                  Select Time
                </p>
                <div class="grid grid-cols-3 gap-4">
                  <div
                    v-for="time in availableTimeSlots"
                    :key="time.time"
                    class="border py-4 text-center transition-colors cursor-pointer"
                    :class="
                      state.selectedTime === time.time
                        ? 'border-primary-500 bg-primary-700 text-white'
                        : 'border-stone-200 dark:border-border dark:text-white hover:border-primary-500'
                    "
                    @click="selectTime(time.time)"
                  >
                    {{ time?.label }}
                  </div>
                </div>
              </UFormField>

              <div v-else class="py-6">
                <p>No available times for the selected date.</p>
              </div>
            </div>
          </div>

          <!-- Step 3: Guests -->
          <div v-else-if="currentStep === 2" key="step3" class="flex flex-col">
            <div class="mb-8">
              <h2 class="text-3xl font-serif text-foreground mb-3">
                Who's Joining?
              </h2>
              <p class="text-xs text-[#A08860]">
                Add any additional guests joining the session, or simply click
                next to continue.
              </p>
            </div>
            <div class="w-full h-px bg-border/40 mb-8" />

            <div class="flex flex-col gap-6 mb-8">
              <div
                v-for="(guest, index) in state.guests"
                :key="index"
                class="flex flex-col gap-6 relative"
              >
                <div
                  v-if="index > 0"
                  class="w-full h-px bg-border/40 mt-2 mb-2"
                />

                <div v-if="index > 0" class="flex items-center justify-between">
                  <h4 class="text-sm font-serif text-[#A08860]">
                    Guest {{ index + 1 }}
                  </h4>
                  <button
                    type="button"
                    class="text-xs text-red-800 hover:text-red-600 transition-colors flex items-center gap-1 absolute right-0 top-2"
                    @click="removeGuest(index)"
                  >
                    <UIcon name="i-lucide-trash-2" class="w-3.5 h-3.5" /> Remove
                  </button>
                </div>

        
                  <base-input
                    v-model="guest.fullName"
                    placeholder="Enter your full name"
                    type="text"
                    name="fullName"
                    label="Full Name"
                  />

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                    <base-input
                      v-model="guest.phone"
                      placeholder="Enter your phone number"
                      type="tel"
                      name="phone"
                      label="Phone Number"
                    />
               
                    <base-input
                      v-model="guest.email"
                      name="email"
                      placeholder="Enter your email address"
                      label="Email"
                    />
                </div>
              </div>

              <base-button
                variant="outline"
                class="w-full border-[#A08860] text-[#A08860] hover:bg-[#A08860]/10 uppercase text-[11px] tracking-widest font-bold h-12 mt-4"
                @click="addGuest"
              >
                ADD GUEST +
              </base-button>
            </div>
          </div>

          <!-- Step 4: Overview -->
          <div v-else key="step4" class="flex flex-col">
            <div class="mb-8">
              <h2 class="text-3xl font-serif text-foreground mb-3">
                Review Your Booking
              </h2>
              <p class="text-xs text-[#A08860]">
                Please check your reservation details before confirming
              </p>
            </div>
            <h3
              class="text-[10px] font-bold tracking-widest uppercase text-[#A08860] mb-4"
            >
              BOOKING OVERVIEW
            </h3>

            <div class="border-t border-border/40 pt-6">
              <h4 class="font-serif text-lg font-medium text-foreground mb-6">
                Overview
              </h4>

              <div class="flex flex-col gap-4 mb-6">
                <div
                  class="flex justify-between items-center text-sm text-foreground"
                >
                  <span
                    >{{ state.selectedSpa?.name }} ×
                    {{ state.guests.length }}</span
                  >
                  <span
                    >Rs.
                    {{
                      (state.selectedSpa?.price ?? 0) * state.guests.length
                    }}</span
                  >
                </div>
              </div>

              <div
                class="flex justify-between items-center border-t border-border/40 pt-4 text-foreground"
              >
                <span class="font-serif font-bold">Total</span>
                <span class="font-serif font-bold">
                  Rs.
                  {{ (state.selectedSpa?.price ?? 0) * state.guests.length }}
                </span>
              </div>
              <div class="border-b border-border/40 pb-6 mb-8" />
            </div>
          </div>
        </Transition>
      </UForm>

      <div
        class="flex flex-col sm:flex-row gap-4"
        :class="currentStep === 0 ? 'justify-end' : 'justify-between'"
      >
        <base-button
          v-if="currentStep > 0"
          variant="outline"
          @click="previousStep"
        >
          Back
        </base-button>

        <base-button
          v-if="currentStep < steps.length - 1"
          class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none text-white"
          @click="nextStep"
        >
          NEXT
        </base-button>

        <base-button
          v-else
          class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none text-white"
          @click="addToCart"
        >
          ADD TO CART
        </base-button>
      </div>
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