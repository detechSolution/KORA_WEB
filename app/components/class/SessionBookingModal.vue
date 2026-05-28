<script setup lang="ts">
import { ref } from "vue";
import type { PropType } from "vue";
import type { Session } from "~/types/session";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  session: {
    type: Object as PropType<Session>,
    required: true,
  },
});

const steps = [
  {
    label: "Attendees",
  },
  {
    label: "Overview",
  }
];

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
  currentStep.value = 0;
};
const nextStep = () => {
  currentStep.value = 1;
};

const addToCart = () => {
  close();
  // logic to add to cart
};

const proceedToCheckout = () => {
  close();
  navigateTo("/checkout");
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
    <div class="p-4 md:p-6">
      <!-- Step Indicators -->
      <base-form-stepper
        :steps="steps"
        :current-step="currentStep"
        orientation="horizontal"
        class="mb-8 max-w-sm mx-auto"
        @select="goToStep"
      />

      <Transition name="fade" mode="out-in">
        <!-- Step 1: Attendees -->
        <div v-if="currentStep === 0" key="step1" class="flex flex-col">
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
            <div v-for="(guest, index) in guests" :key="index" class="flex flex-col gap-6 relative">
              <div v-if="index > 0" class="w-full h-1px bg-border/40 mt-2 mb-2"></div>
              
              <div class="flex items-center justify-between">
                <h4 v-if="index > 0" class="text-sm font-serif text-[#A08860]">Guest {{ index + 1 }}</h4>
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

          <div class="flex justify-end">
            <base-button
              @click="nextStep"
              class="uppercase text-[11px] tracking-widest font-bold px-10 h-11 rounded-none bg-[#A08860] hover:bg-[#8c7550] text-white"
            >
              Next
            </base-button>
          </div>
        </div>

        <!-- Step 2: Overview -->
        <div v-else key="step2" class="flex flex-col">
          <div class="mb-8">
            <h2 class="text-3xl font-serif text-foreground mb-3">
              Review Your Booking
            </h2>
            <p class="text-xs text-[#A08860]">
              Please check your session booking details before confirming
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
                <span>{{ session.title }} X 2</span>
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

          <div class="flex flex-col sm:flex-row justify-between gap-4 mt-auto">
            <base-button class="" @click="previousStep" variant="outline">
              Back
            </base-button>
            <div class="flex flex-col sm:flex-row gap-2">
              <base-button
                @click="addToCart"
                class="bg-black dark:bg-black hover:bg-black/70"
              >
                ADD TO CART
              </base-button>

              <base-button
                @click="proceedToCheckout"
                class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none bg-[#A08860] hover:bg-[#8c7550] text-white"
              >
                PROCEED TO CHECKOUT
              </base-button>
            </div>
          </div>
        </div>
      </Transition>
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
