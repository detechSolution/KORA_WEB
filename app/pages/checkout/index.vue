<script setup lang="ts">
import type { PaymentProvider } from "~/types/payment";
import { computed, onUnmounted, ref } from "vue";
import { usePayment } from "~/composables/use-payment";
import { useCartStore } from "~/stores/cart";
import { calculatePrice } from "~/utils/helper";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Checkout",
});

const step = ref(1);

const inputPromoCode = ref("");
const paymentMethod = ref<PaymentProvider>("stripe");
const isRemoveItemModalOpen = ref(false);
const selectedItemId = ref<string | "">("");
const userDetail = JSON.parse(localStorage.getItem("user_data") || "{}");

const cartStore = useCartStore();
const { loading, payNow } = usePayment();

const cartItems = computed(() => cartStore.cartItems);
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.finalPrice, 0);
});

const MEMBERSHIP_DISCOUNT = userDetail?.membership?.option?.memberBenefit || 0;

const pricing = computed(() =>
  calculatePrice({
    price: subtotal.value,
    guests: 1,
    discount: MEMBERSHIP_DISCOUNT,
  }),
);

const totalPrice = computed(() => {
  return Math.max(0, pricing.value.finalPrice - cartStore.discountAmount);
});

// Count the total number of items in the cart, including visitors for each item
const totalItems = computed(() =>
  cartItems.value.reduce((total, item) => {
    const visitorsCount = item.visitors?.length ?? 0;

    return total + visitorsCount + 1;
  }, 0),
);

async function handleApplyPromo() {
  if (inputPromoCode.value.trim()) {
    await cartStore.applyPromoCode(inputPromoCode.value.trim());
  }
}

function handleRemovePromo() {
  cartStore.removePromoCode();
  inputPromoCode.value = "";
}

function openRemoveModal(id: string) {
  selectedItemId.value = id;
  isRemoveItemModalOpen.value = true;
}

function handleRemoveItem() {
  if (selectedItemId.value !== "") {
    cartStore.removeItem(selectedItemId.value);
  }

  isRemoveItemModalOpen.value = false;
  selectedItemId.value = "";
}

function goBack() {
  step.value = 1;
}

async function handlePayNowClick() {
  if (step.value === 1) {
    step.value = 2;
  }
  else {
    try {
      const payload = {
        provider: paymentMethod.value,
        items: cartItems.value.map(item => ({
          itemType: item.itemType,

          referenceId: item.referenceId,

          ...(item.itemType === "spa" && {
            bookingDate: item.bookingDate,
            bookingTime: item.bookingTime,
          }),

          ...(item.visitors?.length && {
            visitors: item.visitors.map((visitor: any) => ({
              fullName: visitor.fullName,
              phoneNumber: visitor.phone || "",
              email: visitor.email,
            })),
          }),
        })),

        promoCode: cartStore.promoCode,
      };

      await payNow(payload);
    }
    catch (error) {
      console.error("Payment failed:", error);
    }
  }
}

onUnmounted(() => {
  cartStore.removePromoCode();
});
</script>

<template>
  <div
    class="bg-background dark:bg-secondary-900 min-h-screen text-foreground pb-20 font-sans"
  >
    <div class="max-w-400 mx-auto">
      <!-- Header Section -->
      <ClassHeader
        title="Checkout"
        label="Complete your booking"
        class="pt-6"
      />

      <div
        v-if="cartItems.length > 0"
        class="grid grid-cols-1 lg:grid-cols-5 gap-x-12 gap-y-12 lg:gap-x-16 px-4 md:px-8 lg:px-12"
      >
        <!-- Left Column: Form / Payment -->
        <div class="col-span-5 lg:col-span-3 flex flex-col gap-8">
          <Transition name="fade" mode="out-in">
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
                  :key="item.referenceId"
                  class="flex gap-4 pb-6 border-b border-border/10"
                >
                  <!-- Image / Icon -->
                  <div
                    v-if="
                      item.type === 'class'
                        || item.type === 'event'
                        || item.type === 'workshop'
                        || item.type === 'spa'
                    "
                    class="w-20 h-20 bg-muted shrink-0 overflow-hidden relative"
                  >
                    <img
                      v-if="item.image"
                      :src="item.image"
                      :alt="item.title"
                      class="w-full h-full object-cover"
                    >
                  </div>
                  <div
                    v-else-if="item.itemType === 'pass'"
                    class="w-20 h-20 border border-border flex items-center justify-center shrink-0 text-primary/60"
                  >
                    <UIcon name="i-lucide-badge" class="w-6 h-6" />
                  </div>
                  <div
                    v-else-if="item.itemType === 'membership'"
                    class="w-20 h-20 border border-border flex items-center justify-center shrink-0 text-primary/60"
                  >
                    <UIcon name="i-lucide-star" class="w-6 h-6" />
                  </div>

                  <!-- Item Details -->
                  <div class="flex-1 flex flex-col">
                    <div class="flex justify-between items-start gap-4 mb-2">
                      <div class="flex flex-wrap items-start gap-2">
                        <h4 class="text-sm font-serif text-foreground">
                          {{ item.title }}
                          <br>
                          <span v-if="item.itemType !== 'membership'">
                            (<span class="text-xl">{{ item.visitors.length + 1 }} x
                              {{ formatPrice(item.price) }}</span>)
                          </span>
                        </h4>
                        <span
                          v-if="item.itemType === 'session'"
                          class="text-[8px] px-1.5 py-0.5 bg-purple-900/40 text-purple-300 font-medium tracking-wide"
                        >Session</span>
                        <span
                          v-if="item.itemType === 'spa'"
                          class="text-[8px] px-1.5 py-0.5 bg-emerald-900/40 text-emerald-400 font-medium tracking-wide"
                        >Spa</span>
                        <span
                          v-if="item.itemType === 'pass'"
                          class="text-[8px] px-1.5 py-0.5 bg-blue-900/40 text-blue-400 font-medium tracking-wide"
                        >Pass</span>
                        <span
                          v-if="item.itemType === 'membership'"
                          class="text-[8px] px-1.5 py-0.5 bg-[#B59A6D] text-white font-medium tracking-wide"
                        >Membership</span>
                      </div>
                      <div>
                        <span class="text-sm font-serif text-[#B59A6D]">Rs. {{ formatPrice(item.finalPrice) }}</span>
                      </div>
                    </div>

                    <div class="flex flex-col gap-1.5 mt-auto">
                      <div
                        v-if="item.bookingDate"
                        class="flex items-center gap-1.5 text-[9px] text-muted-foreground"
                      >
                        <UIcon name="i-lucide-calendar" class="w-3 h-3" />
                        <span>{{ item.bookingDate }}</span>
                      </div>
                      <div
                        v-if="item.bookingTime"
                        class="flex items-center gap-1.5 text-[9px] text-muted-foreground"
                      >
                        <UIcon name="i-lucide-clock" class="w-3 h-3" />
                        <span>{{ formatTime(item.bookingTime) }}</span>
                      </div>
                      <div
                        v-if="item.location"
                        class="flex items-center gap-1.5 text-[9px] text-muted-foreground"
                      >
                        <UIcon name="i-lucide-map-pin" class="w-3 h-3" />
                        <span>{{ item.location }}</span>
                      </div>
                    </div>

                    <div class="flex justify-end mt-2">
                      <button
                        class="text-destructive/80 hover:text-destructive transition-colors hover:cursor-pointer"
                        @click="openRemoveModal(item.cartId)"
                      >
                        <UIcon
                          name="i-lucide-trash-2"
                          class="w-3 h-3 text-red-800 hover:text-red-700"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Totals -->
              <div class="pt-6">
                <div class="flex items-center justify-between">
                  <span
                    class="font-serif text-xl md:text-2xl text-foreground font-bold"
                  >Total</span>
                  <span
                    class="font-serif text-xl md:text-2xl text-[#B59A6D] font-bold"
                  >{{ formatPrice(subtotal) }}</span>
                </div>
              </div>
            </div>

            <!-- Step 2: Payment Method -->
            <div
              v-else
              key="step2"
              class="flex flex-col w-full"
            >
              <div
                class="dark:bg-[#212121] border border-border p-6 flex items-center gap-3"
              >
                <UIcon name="i-lucide-wallet" class="w-4 h-4 text-[#B59A6D]" />
                <span
                  class="text-[10px] text-[#B59A6D] font-bold tracking-widest uppercase"
                >
                  CHOOSE A PAYMENT METHOD
                </span>
              </div>

              <!-- Payment Options -->
              <div
                class="dark:bg-[#212121] border border-t-0 border-border p-8"
              >
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
                      v-model="paymentMethod"
                      type="radio"
                      value="esewa"
                      class="hidden"
                    >
                    <!-- eSewa placeholder logo -->
                    <div
                      class="h-8 bg-white px-2 py-1 rounded flex items-center justify-center"
                    >
                      <span
                        class="text-[#60B54F] font-bold text-lg leading-none"
                      >eSewa</span>
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
                      v-model="paymentMethod"
                      type="radio"
                      value="fonepay"
                      class="hidden"
                    >
                    <!-- Fonepay placeholder logo -->
                    <div
                      class="h-8 bg-white px-2 py-1 rounded flex items-center justify-center"
                    >
                      <span
                        class="text-[#E31E24] font-bold text-lg leading-none"
                      >fonepay</span>
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
                      v-model="paymentMethod"
                      type="radio"
                      value="stripe"
                      class="hidden"
                    >
                    <!-- Stripe placeholder logo -->
                    <div
                      class="h-8 bg-white px-2 py-1 rounded flex items-center justify-center"
                    >
                      <span
                        class="text-[#635BFF] font-bold text-lg leading-none"
                      >stripe</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </Transition>
          <div class="hidden lg:block col-span-5 lg:col-span-3">
            <!-- Action Buttons -->
            <div
              class="flex"
              :class="step === 2 ? 'justify-between' : 'justify-end'"
            >
              <base-button
                v-if="step === 2"
                variant="outline"
                leading-icon="i-lucide-arrow-left"
                class="uppercase text-[11px] tracking-widest font-bold px-8 rounded-none border-border hover:border-primary-700"
                @click="goBack"
              >
                GO BACK
              </base-button>

              <base-button
                trailing-icon="i-lucide-arrow-right"
                class="uppercase self-end flex tracking-widest font-bold px-8 rounded-none"
                :loading="loading"
                @click="handlePayNowClick"
              >
                PAY NOW
              </base-button>
            </div>
          </div>
        </div>

        <!-- Right Column: Order Summary -->
        <div
          class="col-span-5 lg:col-span-2 h-fit flex flex-col gap-9 bg-card p-8 border border-border"
        >
          <p class="text-lg font-semibold uppercase text-primary-700">
            PAYMENT OVERVIEW
          </p>
          <div key="step1" class="flex flex-col w-full">
            <!-- Promo Code -->
            <div class="flex flex-col gap-2 w-full h-30">
              <div class="flex items-end w-full gap-4">
                <div class="flex-1">
                  <base-input
                    v-model="inputPromoCode"
                    name="promoCode"
                    label="PROMO CODE"
                    placeholder="e.g KORA20"
                    type="text"
                    :disabled="
                      cartStore.isApplyingPromo || cartStore.promoCode !== null
                    "
                    @keyup.enter="handleApplyPromo"
                  />
                </div>
                <base-button
                  v-if="!cartStore.promoCode"
                  :disabled="!inputPromoCode || cartStore.isApplyingPromo"
                  @click="handleApplyPromo"
                >
                  <span v-if="cartStore.isApplyingPromo">APPLYING...</span>
                  <span v-else>APPLY</span>
                </base-button>
                <base-button
                  v-else
                  variant="outline"
                  class=""
                  @click="handleRemovePromo"
                >
                  REMOVE
                </base-button>
              </div>
              <p v-if="cartStore.isPromoValid" class="text-xs text-emerald-500">
                Promo code applied successfully!
              </p>
              <p v-else class="text-xs text-red-500">
                {{ cartStore.promoError }}
              </p>
            </div>

            <div class="border-y border-border flex flex-col gap-3 p-4 mt-2">
              <div
                class="text-sm text-secondary dark:text-white font-normal flex justify-between"
              >
                <h2>Items Count ({{ totalItems }} items)</h2>
                <p>Rs. {{ formatPrice(subtotal) }}</p>
              </div>
              <div
                v-if="MEMBERSHIP_DISCOUNT > 0"
                class="text-sm text-secondary-500 dark:text-secondary-400 font-normal flex justify-between"
              >
                <h2>Membership Discount ({{ MEMBERSHIP_DISCOUNT }}%)</h2>
                <p>- Rs. {{ formatPrice(pricing.discountAmount) }}</p>
              </div>
              <div
                v-if="cartStore.discountAmount > 0"
                class="text-sm text-secondary-500 dark:text-secondary-400 font-normal flex justify-between border-b border-border pb-2"
              >
                <h2>
                  Promo Discount
                  <span v-if="cartStore.promoCode">({{ cartStore.promoCode }})</span>
                </h2>
                <p>- Rs. {{ formatPrice(cartStore.discountAmount) }}</p>
              </div>

              <div
                class="text-sm text-secondary dark:text-white font-normal flex justify-between pt-1"
              >
                <h2 class="font-bold">
                  Total
                </h2>
                <p class="font-bold text-primary">
                  Rs. {{ formatPrice(totalPrice) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="block lg:hidden col-span-5 lg:col-span-3">
          <!-- Action Buttons -->
          <div
            class="flex"
            :class="step === 2 ? 'justify-between' : 'justify-end'"
          >
            <base-button
              v-if="step === 2"
              variant="outline"
              leading-icon="i-lucide-arrow-left"
              class="uppercase text-[11px] tracking-widest font-bold px-8 rounded-none border-border hover:border-primary-700"
              @click="goBack"
            >
              GO BACK
            </base-button>

            <base-button
              trailing-icon="i-lucide-arrow-right"
              class="uppercase self-end flex tracking-widest font-bold px-8 rounded-none"
              @click="handlePayNowClick"
            >
              PAY NOW
            </base-button>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-20 flex flex-col items-center gap-6">
        <UIcon
          name="i-lucide-shopping-cart"
          class="w-12 h-12 text-muted-foreground"
        />
        <h2 class="text-lg text-muted-foreground">
          There are no items in this cart
        </h2>
      </div>
    </div>
    <cart-delete-modal
      :open="isRemoveItemModalOpen"
      @close="isRemoveItemModalOpen = false"
      @confirm="handleRemoveItem"
    />
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
