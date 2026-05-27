<script setup lang="ts">
import { ref } from "vue";
import { availableDays, offerings } from "~/data/spa";

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const steps = [
  {
    label: "Select Sub-Type",
  },
  {
    label: "Date & Time",
  },
  {
    label: "Add Guest",
  },
  {
    label: "Overview",
  },
];
const accordionItems = offerings.map((o) => ({
  id: o.id,
  label: o.label,
  description: o.description,
  prices: o.prices,
}));
function goToStep(step: number) {
  if (step > currentStep.value) {
    void validateCurrentStep().then((isValid) => {
      if (isValid) {
        currentStep.value = step;
      }
    });
    return;
  }

  currentStep.value = step;
}

async function validateCurrentStep(): Promise<boolean> {
  try {
    // await formRef.value?.validate();
    return true;
  } catch {
    return false;
  }
}

const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};

const currentStep = ref(0);
const value = ref();

const guests = ref([
  {
    fullName: "Shyam Shrestha",
    phone: "9845738746",
    email: "shyam@gmail.com",
  },
]);

const addGuest = () => {
  guests.value.push({ fullName: "", phone: "", email: "" });
};

const removeGuest = (index: number) => {
  if (guests.value.length > 1) {
    guests.value.splice(index, 1);
  }
};

const previousStep = () => {
  currentStep.value -= 1;
};
const nextStep = () => {
  currentStep.value += 1;
};
const addToCart = () => {
  close();
  // logic to add to cart
};
</script>

<template>
  <base-modal
    title=""
    :open="isOpen"
    @close="close"
    :modal-width="700"
    modal-max-height="90vh"
    :dismissible="true"
    class="dark:bg-nirvana-mist"
  >
    <div class="p-4 gap-6">
      <!-- Step Indicators -->
      <base-form-stepper
        :steps="steps"
        :current-step="currentStep"
        orientation="horizontal"
        class="mb-8"
        @select="goToStep"
      />
      <Transition name="fade" mode="out-in">
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
            :items="accordionItems"
            class="mb-6"
            :ui="{
              root: 'w-full flex flex-col gap-4',
              item: 'border border-border dark:bg-[#212121] p-6 dark:text-white font-serif rounded-xs',
              label: 'text-xl',
              body: 'mt-4',
            }"
          >
            <template #default="{ item }">
              <div class="flex flex-col">
                <span>{{ item.label }}</span>
                <p
                  class="text-sm text-foreground/80 dark:text-secondary-500 mt-4"
                >
                  {{ item.description }}
                </p>
              </div>
            </template>
            <template #content="{ item }">
              <!-- Pricing Cards -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div
                  v-for="(duration, index) in item.prices"
                  :key="index"
                  class="group relative border border-white/10 dark:border-white/10 bg-[#c9a55a]/10 dark:bg-[#2A2722] rounded-xs p-4 flex flex-col justify-between transition-all duration-300"
                >
                  <div>
                    <div
                      class="flex items-center gap-2 text-xs uppercase text-secondary-500"
                    >
                      <UIcon
                        name="i-lucide-clock"
                        class="h-3.5 w-3.5 text-primary"
                      />
                      <span class="text-primary text-sm">{{
                        duration.duration
                      }}</span>
                    </div>

                    <p class="text-3xl font-medium text-foreground mt-3">
                      {{ duration.price }}
                    </p>
                  </div>

                  <div class="mt-3 flex items-center justify-between">
                    <base-button variant="link" class="text-primary p-0">
                      Tap to Book
                      <UIcon
                        name="i-lucide-arrow-right"
                        class="h-4 w-4 transition-transform group-hover:translate-x-1"
                      />
                    </base-button>
                  </div>
                </div>
              </div>
            </template>
          </UAccordion>
        </div>

        <div v-else-if="currentStep === 1" key="step2" class="flex flex-col gap-8">
          <div class="">
            <h2 class="text-3xl font-serif text-foreground mb-3">
              Choose Your Date & Time
            </h2>
            <p class="text-xs text-[#A08860]">
              Pick a time that works best for your relaxation
            </p>
          </div>

          <div class="flex flex-col gap-4 border-b border-border pb-6">
            <p class="text-primary-700 font-medium text-sm capitalize">
              Select Date
            </p>
            <UCalendar
              :ui="{
                headCell: 'text-xs font-normal',
                gridBody: 'grid gap-2 sm:gap-4',
                cellTrigger: 'w-full rounded-none flex flex-col h-8 w-8 p-1 sm:h-12 sm:w-12 sm:p-2 border border-border',
            }"
          />

        </div>
        <div class="flex flex-col gap-4 mb-6">
            <p class="text-primary-700 font-medium text-sm capitalize">
              Select Date
            </p>

            <div class="grid grid-cols-3 gap-4">
            <div 
            v-for="time in 9"
            :key="time"
            >
                
                <div class="border border-stone-200 py-4 text-center text-secondary">10:30 AM</div>
        
            </div>
            </div>
        </div>
        </div>

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
          <div class="w-full h-px bg-border/40 mb-8"></div>

          <div class="flex flex-col gap-6 mb-8">
            <div
              v-for="(guest, index) in guests"
              :key="index"
              class="flex flex-col gap-6 relative"
            >
              <div
                v-if="index > 0"
                class="w-full h-1px bg-border/40 mt-2 mb-2"
              ></div>

              <div class="flex items-center justify-between">
                <h4 v-if="index > 0" class="text-sm font-serif text-[#A08860]">
                  Guest {{ index + 1 }}
                </h4>
                <button
                  v-if="guests.length > 1"
                  @click="removeGuest(index)"
                  class="text-xs text-red-800 hover:text-red-600 transition-colors flex items-center gap-1 absolute right-0 top-2"
                >
                  <UIcon name="i-lucide-trash-2" class="w-3.5 h-3.5" /> Remove
                </button>
              </div>

              <base-input
                v-model="guest.fullName"
                :name="`fullName_${index}`"
                label="FULL NAME *"
                type="text"
                class="bg-white dark:bg-transparent"
              />

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <base-input
                  v-model="guest.phone"
                  :name="`phone_${index}`"
                  label="PHONE NUMBER"
                  type="text"
                  class="bg-white dark:bg-transparent"
                />
                <base-input
                  v-model="guest.email"
                  :name="`email_${index}`"
                  label="EMAIL ADDRESS *"
                  type="email"
                  class="bg-white dark:bg-transparent"
                />
              </div>
            </div>

            <base-button
              @click="addGuest"
              variant="outline"
              class="w-full border-[#A08860] text-[#A08860] hover:bg-[#A08860]/10 uppercase text-[11px] tracking-widest font-bold h-12 mt-4"
            >
              ADD GUEST +
            </base-button>
          </div>
        </div>

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
                <span>Hello X 2</span>
                <span>Rs. 2,000</span>
              </div>
              <div
                class="flex justify-between items-center text-sm text-muted-foreground"
              >
                <span>Membership Discount</span>
                <span>20%</span>
              </div>
            </div>

            <div
              class="flex justify-between items-center border-t border-border/40 pt-4 text-foreground"
            >
              <span class="font-serif font-bold">Total</span>
              <span class="font-serif font-bold">Rs. 1,800</span>
            </div>
            <div class="border-b border-border/40 pb-6 mb-8"></div>
          </div>
        </div>
      </Transition>

      <div
        class="flex flex-col sm:flex-row gap-4"
        :class="currentStep === 0 ? 'justify-end' : 'justify-between'"
      >
        <base-button
          v-if="currentStep > 0"
          @click="previousStep"
          class=""
          variant="outline"
        >
          Back
        </base-button>

        <base-button
          @click="nextStep"
          class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none text-white"
        >
          NEXT
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