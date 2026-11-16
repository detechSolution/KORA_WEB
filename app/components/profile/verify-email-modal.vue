<script setup lang="ts">
import { onUnmounted, reactive, ref, watch } from "vue";
import z from "zod";
import { useNotification } from "~/composables/use-notification";
import { useAuthStore } from "~/stores/auth";
import { getApiErrorMessage } from "~/utils/error";

type Props = {
  open: boolean;
  email?: string;
};

const props = withDefaults(defineProps<Props>(), {
  email: "",
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success"): void;
}>();

const authStore = useAuthStore();
const { success: showSuccess, error: showError } = useNotification();

const loading = ref(false);
const resending = ref(false);
const resendTimer = ref(0);
let timerInterval: ReturnType<typeof setInterval> | null = null;

const formRef = ref<InstanceType<typeof UForm> | null>(null);
const apiError = ref<string | null>(null);

const schema = z
  .object({
    code: z.string().min(1, "Verification code is required"),
  })
  .superRefine((_, ctx) => {
    if (apiError.value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["code"],
        message: apiError.value,
      });
    }
  });

const formState = reactive({ code: "" });
const pinCode = ref(["", "", "", "", "", ""]);

function handleInput() {
  formState.code = pinCode.value.join("");
  apiError.value = null;
}

function startTimer() {
  resendTimer.value = 60;
  if (timerInterval)
    clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--;
    }
    else {
      if (timerInterval)
        clearInterval(timerInterval);
    }
  }, 1000);
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      pinCode.value = ["", "", "", "", "", ""];
      formState.code = "";
      apiError.value = null;
      if (resendTimer.value === 0) {
        startTimer();
      }
    }
  },
);

onUnmounted(() => {
  if (timerInterval)
    clearInterval(timerInterval);
});

async function handleVerify(): Promise<void> {
  try {
    await formRef.value?.validate();
  }
  catch {
    return;
  }
  try {
    loading.value = true;
    apiError.value = null;
    await authStore.verifyEmail({ code: formState.code });
    showSuccess({ message: "Email verified successfully!" });
    emit("success");
    emit("close");
  }
  catch (error: unknown) {
    apiError.value = getApiErrorMessage(
      error,
      "Invalid or expired verification code. Please try again.",
    );
    formRef.value?.validate();
  }
  finally {
    loading.value = false;
  }
}

async function handleResend(): Promise<void> {
  if (resendTimer.value > 0 || resending.value)
    return;
  try {
    resending.value = true;
    await authStore.resendVerificationEmail();
    showSuccess({
      message: "Verification code sent! Please check your email.",
    });
    startTimer();
  }
  catch (error: unknown) {
    showError({
      message: getApiErrorMessage(
        error,
        "Failed to resend code. Please try again.",
      ),
    });
  }
  finally {
    resending.value = false;
  }
}
</script>

<template>
  <base-modal
    :open="open"
    title="Verify Your Email"
    :modal-width="600"
    dismissible
    @close="emit('close')"
  >
    <div class="flex flex-col gap-5 pt-2">
      <p class="text-xs text-secondary-500 text-center leading-relaxed">
        Please enter the 6-digit verification code sent to<br>
        <strong class="text-foreground">{{ props.email || authStore.user.email }}</strong>
      </p>

      <UForm
        ref="formRef"
        :state="formState"
        :schema="schema"
        :validate-on="['input', 'change', 'blur']"
        class="space-y-6"
        @keypress.enter="handleVerify"
      >
        <UFormField
          name="code"
          class="flex justify-center"
        >
          <UPinInput
            v-model="pinCode"
            name="code"
            type="text"
            :length="6"
            size="lg"
            :ui="{
              root: 'flex items-center justify-center gap-3',
              base: `bg-white dark:bg-transparent text-xl ring-secondary-50 dark:ring-secondary-700 focus:ring-1 focus:outline-none placeholder:text-secondary-300 rounded-xs h-12 w-12 text-center`,
            }"
            @input="handleInput"
          />
        </UFormField>

        <base-button
          class="w-full mt-2"
          :loading="loading"
          @click="handleVerify"
        >
          VERIFY EMAIL
        </base-button>

        <div
          class="text-center text-xs text-secondary-500 flex flex-col items-center gap-1.5"
        >
          <p>
            Didn't receive the code?
            <button
              type="button"
              class="font-medium ml-1 transition-colors"
              :class="
                resendTimer > 0 || resending
                  ? 'text-secondary-400 cursor-not-allowed'
                  : 'text-[#B59A6D] hover:underline cursor-pointer'
              "
              :disabled="resendTimer > 0 || resending"
              @click="handleResend"
            >
              {{ resending ? "Sending..." : "Resend code" }}
            </button>
          </p>
          <span
            v-if="resendTimer > 0"
            class="text-[11px] text-secondary-400"
          >
            Wait 00:{{ resendTimer.toString().padStart(2, "0") }} before resending
          </span>
        </div>
      </UForm>
    </div>
  </base-modal>
</template>
