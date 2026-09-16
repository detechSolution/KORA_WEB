<script setup lang="ts">
import type { PropType } from "vue";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import * as z from "zod";
import { useNotification } from "~/composables/use-notification";
import { useCartStore } from "~/stores/cart";

type Recipient = {
  fullName: string;
  phone: string;
  email: string;
};

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  membership: {
    type: Object as PropType<any>,
    required: true,
  },
  option: {
    type: Object as PropType<any>,
    required: true,
  },
});

const emit = defineEmits<{
  close: [];
}>();

const router = useRouter();
const cartStore = useCartStore();
const { success } = useNotification();
const formRef = ref<InstanceType<typeof UForm> | null>(null);
const currentStep = ref(0);
const state = reactive({
  recipient: {
    fullName: "",
    phone: "",
    email: "",
  } as Recipient,
});

const steps = [
  { label: "Recipient Detail" },
  { label: "Overview" },
];

const recipientSchema = z.object({
  recipient: z.object({
    fullName: z.string().trim().min(1, "Full name is required"),
    phone: z.string().trim().optional(),
    email: z.string().trim().email("Please enter a valid email address"),
  }),
});

const frequency = computed(() => {
  const value = props.option?.frequency || "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
});

const price = computed(() => Number(props.option?.price ?? 0));
const formattedPrice = computed(() =>
  new Intl.NumberFormat("en-IN").format(price.value),
);

const membershipItem = computed(() => ({
  referenceId: props.option.id,
  membershipPlanId: props.option.membershipPlanId,
  title: props.membership.name,
  frequency: props.option.frequency,
  price: price.value,
  finalPrice: price.value,
  itemType: "membership",
  memberBenefit: props.option.memberBenefit,
  isGift: true,
  recipient: { ...state.recipient },
}));

async function validateRecipient(): Promise<boolean> {
  try {
    await formRef.value?.validate();
    return true;
  }
  catch {
    return false;
  }
}

function reset() {
  currentStep.value = 0;
  state.recipient.fullName = "";
  state.recipient.phone = "";
  state.recipient.email = "";
}

function close() {
  reset();
  emit("close");
}

function goToStep(step: number) {
  if (step <= currentStep.value) {
    currentStep.value = step;
    return;
  }

  void validateRecipient().then((isValid) => {
    if (isValid)
      currentStep.value = step;
  });
}

function nextStep() {
  void validateRecipient().then((isValid) => {
    if (isValid)
      currentStep.value = 1;
  });
}

function addToCart() {
  cartStore.addToCart(membershipItem.value);
  success({ message: "Gift membership added to cart successfully!" });
  close();
}

function proceedToCheckout() {
  cartStore.addToCart(membershipItem.value);
  close();
  router.push("/checkout");
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
    <div class="p-6 md:p-12">
      <base-form-stepper
        :steps="steps"
        :current-step="currentStep"
        orientation="horizontal"
        class="mb-8"
        @select="goToStep"
      />

      <UForm
        ref="formRef"
        :schema="currentStep === 0 ? recipientSchema : undefined"
        :state="state"
      >
        <Transition name="fade" mode="out-in">
          <div v-if="currentStep === 0" key="recipient">
            <div class="mb-8">
              <h2 class="text-3xl font-serif text-foreground mb-3">
                Who Is This Gift For?
              </h2>
              <p class="text-xs text-[#A08860]">
                Enter the details of the person receiving this gifted membership package.
              </p>
            </div>

            <div class="border-t border-border/40 pt-6">
              <base-input
                v-model="state.recipient.fullName"
                name="recipient.fullName"
                label="FULL NAME *"
                placeholder="Enter recipient's full name"
                type="text"
                class="bg-white dark:bg-transparent"
              />

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <base-input
                  v-model="state.recipient.phone"
                  name="recipient.phone"
                  label="PHONE NUMBER"
                  placeholder="Enter recipient's phone number"
                  type="text"
                  class="bg-white dark:bg-transparent"
                />
                <base-input
                  v-model="state.recipient.email"
                  name="recipient.email"
                  label="EMAIL ADDRESS *"
                  placeholder="Enter recipient's email"
                  type="email"
                  class="bg-white dark:bg-transparent"
                />
              </div>
            </div>

            <div class="border-b border-border/40 pb-6 mt-6 mb-8" />

            <div class="flex justify-end">
              <base-button
                class="uppercase text-[11px] tracking-widest font-bold px-10 h-11 rounded-none bg-[#A08860] hover:bg-[#8c7550] text-white"
                @click="nextStep"
              >
                Next
              </base-button>
            </div>
          </div>

          <div v-else key="overview">
            <div class="mb-8">
              <h2 class="text-3xl font-serif text-foreground mb-3">
                Gift A Membership
              </h2>
              <p class="text-xs text-[#A08860]">
                Give the gift of metamorphosis
              </p>
            </div>

            <h3 class="text-[10px] font-bold tracking-widest uppercase text-[#A08860] mb-2">
              GIFT BOOKING OVERVIEW
            </h3>
            <p class="text-xs text-foreground mb-4">
              Recipient: {{ state.recipient.fullName }}
            </p>

            <div class="border-y border-border/40 py-4">
              <h4 class="font-serif text-lg font-medium text-foreground mb-5">
                Overview
              </h4>
              <div class="flex justify-between items-center text-sm text-foreground">
                <span>{{ membership.name }} - {{ frequency }}</span>
                <span>Rs. {{ formattedPrice }}</span>
              </div>
              <div class="flex justify-between items-center border-t border-border/40 pt-4 mt-4 text-foreground">
                <span class="font-serif font-bold text-2xl">Total</span>
                <span class="font-serif font-bold text-2xl">Rs. {{ formattedPrice }}</span>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-between gap-4 mt-8">
              <base-button variant="outline" @click="currentStep = 0">
                Back
              </base-button>
              <div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <base-button
                  class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none bg-[#1C1C1C] hover:bg-[#111111] dark:bg-black dark:hover:bg-[#111] text-white"
                  @click="addToCart"
                >
                  Add To Cart
                </base-button>
                <base-button
                  class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none bg-[#A08860] hover:bg-[#8c7550] text-white"
                  @click="proceedToCheckout"
                >
                  Proceed To Checkout
                </base-button>
              </div>
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
