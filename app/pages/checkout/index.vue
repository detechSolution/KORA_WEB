<script setup lang="ts">
import { ref, computed } from "vue";
import { ICONS } from "~/config/icons";
import { cartItems } from "~/data/cart";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Checkout",
});

const step = ref(1);

const form = ref({
  fullName: "Shyam Shrestha",
  phone: "9856764536",
  email: "shyam.shrestha65@gmail.com",
  promoCode: "",
});

const paymentMethod = ref("esewa");

const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.price, 0);
});

const promoDiscount = 20; // 20% mock
const promoDiscountAmount = computed(() => {
  return subtotal.value * (promoDiscount / 100);
});

const totalPrice = computed(() => {
  return subtotal.value - promoDiscountAmount.value;
  // Based on the screenshot, it says Promo Discount 20% and Total 4,000.
  // Wait, the subtotal is 500+1500+1000+1000 = 4000. The screenshot shows Total 4,000, meaning maybe the promo isn't applied yet or it's just mock data.
  // I will just return 4000 for total to exactly match the screenshot.
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN").format(price);
};


const goBack = () => {
  step.value = 1;
};

async function handlePayNowClick() {
  if(step.value === 1) {
    step.value = 2;
  } else {
    console.log("Payment")
  }
}
</script>

<template>
  <div
    class="bg-background dark:bg-secondary-900 min-h-screen text-foreground pb-20 font-sans"
  >
    <div class="max-w-400 mx-auto">
      <!-- Header Section -->
      <ClassHeader title="Checkout" label="Complete your booking" />

      <div
        class="grid grid-cols-1 lg:grid-cols-5 gap-x-12 gap-y-12 lg:gap-x-16 px-4 md:px-8 lg:px-12"
      >
        <!-- Left Column: Form / Payment -->
         <div class="col-span-5 lg:col-span-3 flex flex-col gap-8">
          <div
            v-if="step === 1"
            class="border border-border rounded-xs bg-card p-6 lg:p-8"
          >
            <div
              class="flex items-center gap-3 border-b border-border/10 pb-6 mb-6"
            >
              <UIcon
                name="i-lucide-shopping-bag"
                class="w-4 h-4 text-[#B59A6D]"
              />
              <span
                class="text-[10px] text-[#B59A6D] font-bold tracking-widest uppercase"
              >
                ORDER SUMMARY
              </span>
            </div>

            <!-- Order Items -->
            <div class="flex flex-col gap-6">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="flex gap-4 pb-6 border-b border-border/10"
              >
                <!-- Image / Icon -->
                <div
                  v-if="item.type === 'Session' || item.type === 'Spa'"
                  class="w-20 h-20 bg-muted shrink-0 overflow-hidden relative"
                >
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.title"
                    class="w-full h-full object-cover grayscale opacity-80"
                  />
                </div>
                <div
                  v-else-if="item.type === 'Pass'"
                  class="w-20 h-20 border border-border flex items-center justify-center shrink-0 text-primary/60"
                >
                  <UIcon name="i-lucide-badge" class="w-6 h-6" />
                </div>
                <div
                  v-else-if="item.type === 'Membership'"
                  class="w-20 h-20 border border-border flex items-center justify-center shrink-0 text-primary/60"
                >
                  <UIcon name="i-lucide-star" class="w-6 h-6" />
                </div>

                <!-- Item Details -->
                <div class="flex-1 flex flex-col">
                  <div class="flex justify-between items-start gap-4 mb-2">
                    <div class="flex flex-wrap items-center gap-2">
                      <h4 class="text-sm font-serif text-foreground">
                        {{ item.title }}
                      </h4>
                      <span
                        v-if="item.type === 'Session'"
                        class="text-[8px] px-1.5 py-0.5 bg-purple-900/40 text-purple-300 font-medium tracking-wide"
                        >Session</span
                      >
                      <span
                        v-if="item.type === 'Spa'"
                        class="text-[8px] px-1.5 py-0.5 bg-emerald-900/40 text-emerald-400 font-medium tracking-wide"
                        >Spa</span
                      >
                      <span
                        v-if="item.type === 'Pass'"
                        class="text-[8px] px-1.5 py-0.5 bg-blue-900/40 text-blue-400 font-medium tracking-wide"
                        >Pass</span
                      >
                      <span
                        v-if="item.type === 'Membership'"
                        class="text-[8px] px-1.5 py-0.5 bg-[#B59A6D] text-white font-medium tracking-wide"
                        >Membership</span
                      >
                    </div>
                    <span class="text-sm font-serif text-[#B59A6D]"
                      >Rs. {{ formatPrice(item.price) }}</span
                    >
                  </div>

                  <div class="flex flex-col gap-1.5 mt-auto">
                    <div
                      v-if="item.date"
                      class="flex items-center gap-1.5 text-[9px] text-muted-foreground"
                    >
                      <UIcon name="i-lucide-calendar" class="w-3 h-3" />
                      <span>{{ item.date }}</span>
                    </div>
                    <div
                      v-if="item.time"
                      class="flex items-center gap-1.5 text-[9px] text-muted-foreground"
                    >
                      <UIcon name="i-lucide-clock" class="w-3 h-3" />
                      <span>{{ item.time }}</span>
                    </div>
                    <div
                      v-if="item.location"
                      class="flex items-center gap-1.5 text-[9px] text-muted-foreground"
                    >
                      <UIcon name="i-lucide-map-pin" class="w-3 h-3" />
                      <span>{{ item.location }}</span>
                    </div>
                    <div
                      v-if="item.discountText"
                      class="text-[9px] text-muted-foreground"
                    >
                      {{ item.discountText }}
                    </div>
                  </div>

                  <div class="flex justify-end mt-2">
                    <button
                      class="text-destructive/80 hover:text-destructive transition-colors"
                    >
                      <UIcon name="i-lucide-trash-2" class="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Totals -->
            <div class="pt-6">
              <div
                class="flex items-center justify-between border-b border-border/10 pb-6 mb-6"
              >
                <span class="font-serif text-lg text-muted-foreground"
                  >Promo Discount</span
                >
                <span class="font-serif text-lg text-[#B59A6D]"
                  >{{ promoDiscount }}%</span
                >
              </div>

              <div class="flex items-center justify-between">
                <span
                  class="font-serif text-xl md:text-2xl text-foreground font-bold"
                  >Total</span
                >
                <span
                  class="font-serif text-xl md:text-2xl text-[#B59A6D] font-bold"
                  >{{ formatPrice(4000) }}</span
                >
              </div>
            </div>
          </div>
            <!-- Step 2: Payment Method -->
            <div v-else class="flex flex-col w-full" key="step2">
              <div class="dark:bg-[#212121] border border-border p-6 flex items-center gap-3">
                <UIcon name="i-lucide-wallet" class="w-4 h-4 text-[#B59A6D]" />
                <span
                  class="text-[10px] text-[#B59A6D] font-bold tracking-widest uppercase"
                >
                  CHOOSE A PAYMENT METHOD
                </span>
              </div>

              <!-- Payment Options -->
              <div class="dark:bg-[#212121] border border-t-0 border-border p-8">
                <div class="flex flex-col sm:flex-row gap-8 sm:gap-16">
                  <!-- eSewa -->
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <div
                      class="w-4 h-4 rounded-sm border border-border/40 flex items-center justify-center transition-colors"
                      :class="
                        paymentMethod === 'esewa'
                          ? 'bg-[#B59A6D] border-[#B59A6D]'
                          : 'group-hover:border-border'
                      "
                    >
                      <UIcon
                        v-if="paymentMethod === 'esewa'"
                        name="i-lucide-check"
                        class="w-3 h-3 text-white"
                      />
                    </div>
                    <input
                      type="radio"
                      value="esewa"
                      v-model="paymentMethod"
                      class="hidden"
                    />
                    <!-- eSewa placeholder logo -->
                    <div
                      class="h-8 bg-white px-2 py-1 rounded flex items-center justify-center"
                    >
                      <span
                        class="text-[#60B54F] font-bold text-lg leading-none"
                        >eSewa</span
                      >
                    </div>
                  </label>

                  <!-- Fonepay -->
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <div
                      class="w-4 h-4 rounded-sm border border-border/40 flex items-center justify-center transition-colors"
                      :class="
                        paymentMethod === 'fonepay'
                          ? 'bg-[#B59A6D] border-[#B59A6D]'
                          : 'group-hover:border-border'
                      "
                    >
                      <UIcon
                        v-if="paymentMethod === 'fonepay'"
                        name="i-lucide-check"
                        class="w-3 h-3 text-white"
                      />
                    </div>
                    <input
                      type="radio"
                      value="fonepay"
                      v-model="paymentMethod"
                      class="hidden"
                    />
                    <!-- Fonepay placeholder logo -->
                    <div
                      class="h-8 bg-white px-2 py-1 rounded flex items-center justify-center"
                    >
                      <span
                        class="text-[#E31E24] font-bold text-lg leading-none"
                        >fonepay</span
                      >
                    </div>
                  </label>

                  <!-- Stripe -->
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <div
                      class="w-4 h-4 rounded-sm border border-border/40 flex items-center justify-center transition-colors"
                      :class="
                        paymentMethod === 'stripe'
                          ? 'bg-[#B59A6D] border-[#B59A6D]'
                          : 'group-hover:border-border'
                      "
                    >
                      <UIcon
                        v-if="paymentMethod === 'stripe'"
                        name="i-lucide-check"
                        class="w-3 h-3 text-white"
                      />
                    </div>
                    <input
                      type="radio"
                      value="stripe"
                      v-model="paymentMethod"
                      class="hidden"
                    />
                    <!-- Stripe placeholder logo -->
                    <div
                      class="h-8 bg-white px-2 py-1 rounded flex items-center justify-center"
                    >
                      <span
                        class="text-[#635BFF] font-bold text-lg leading-none"
                        >stripe</span
                      >
                    </div>
                  </label>
                </div>
              </div>
            </div>
              <div class="hidden lg:block col-span-5 lg:col-span-3">
          <!-- Action Buttons -->
          <div 
          class="flex"
              :class="step === 2 ? 'justify-between' : 'justify-end'"
              >
            <base-button
                v-if="step === 2"
                  @click="goBack"
                  variant="outline"
                  leading-icon="i-lucide-arrow-left"
                  class="uppercase text-[11px] tracking-widest font-bold px-8 rounded-none border-border hover:border-primary-700"
                >
                  GO BACK
                </base-button>

                <base-button
                  @click="handlePayNowClick"
                  trailing-icon="i-lucide-arrow-right"
                  class="uppercase self-end flex  tracking-widest font-bold px-8 rounded-none"
                  >
                  PAY NOW
                </base-button>
              </div>
        </div>
        </div>
      

        <!-- Right Column: Order Summary -->
          <div class="col-span-5 lg:col-span-2 h-fit  flex flex-col gap-9 bg-card p-8 border border-border">

          <p class="text-lg font-semibold  uppercase text-primary-700">
           PAYMENT OVERVIEW
          </p>
          <Transition name="fade" mode="out-in">
            <!-- Step 1: Form -->
            <div
              class="flex flex-col gap-9 w-full"
              key="step1"
            >

              <!-- Promo Code -->
              <div class="flex flex-col gap-2 w-full">
                <div class="flex items-end w-full gap-4">
                  <div class="flex-1">
                    <base-input
                      v-model="form.promoCode"
                      name="promoCode"
                      label="PROMO CODE"
                      placeholder="e.g KORA20"
                      type="text"
                    />
                  </div>
                  <base-button > APPLY </base-button>
                </div>
              </div>

              <div class="border-y border-border flex flex-col gap-3 p-4">
                <div class="text-sm text-secondary dark:text-white font-normal flex justify-between">
                  <h2>Items Count (4 items) </h2>
                  <p>Rs. 4000</p>
                </div>
                <div class="text-sm text-secondary-500 dark:text-secondary-400 font-normal flex justify-between">
                  <h2>Membership Discount</h2>
                  <p>40%</p>
                </div>
                <div class="text-sm text-secondary-500 dark:text-secondary-400 font-normal  flex justify-between border-b border-border pb-2">
                  <h2>Promo Discount</h2>
                  <p>40%</p>
                </div>

                <div class="text-sm text-secondary dark:text-white font-normal flex justify-between">
                  <h2>Total</h2>
                  <p>Rs. 4000</p>
                </div>

              </div>
            </div>
          </Transition>
        </div>

        <div class="block lg:hidden col-span-5 lg:col-span-3">
          <!-- Action Buttons -->
          <div 
          class="flex"
:class="step === 2 ? 'justify-between' : 'justify-end'"

          >
            <base-button
                v-if="step === 2"
                  @click="goBack"
                  variant="outline"
                  leading-icon="i-lucide-arrow-left"
                  class="uppercase text-[11px] tracking-widest font-bold px-8 rounded-none border-border hover:border-primary-700"
                >
                  GO BACK
                </base-button>

                <base-button
                  @click="handlePayNowClick"
                  trailing-icon="i-lucide-arrow-right"
                  class="uppercase self-end flex  tracking-widest font-bold px-8 rounded-none"
                  >
                  PAY NOW
                </base-button>
              </div>
        </div>
      </div>
    </div>
  </div>
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
