<script setup lang="ts">
import { ref, reactive } from "vue";
import z from "zod";
import { useNotification } from "~/composables/use-notification";
import { useNewsletterStore } from "~/stores/newsletter";

const { error: showError, success: showSuccess } = useNotification();

const newsletterStore = useNewsletterStore();

const loading = ref(false);
const apiError = ref<string | null>(null);
const formRef = ref<InstanceType<typeof UForm> | null>(null);

const schema = z.object({
  lastName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

type Schema = z.output<typeof schema>;

const newsletterFormState = reactive<Schema>({
  lastName: "",
  email: "",
});

function resetForm() {
  newsletterFormState.lastName = "";
  newsletterFormState.email = "";
}

function setApiError(error: string): void {
  apiError.value = error;
}

function clearApiError(): void {
  apiError.value = null;
}

async function onSubmit() {
  clearApiError();
  loading.value = true;

  try {
   await newsletterStore.createNewsletter(newsletterFormState);
    showSuccess({ message: "Thank you for subscribing to our newsletter!"});
    resetForm();
  } catch (error: any) {
    const message = error?.data?.message || "Failed to subscribe. Please try again.";
    setApiError(message);
    showError(message);
  } finally {
    loading.value = false;
  }
}

</script>

<template>
  <section
    class="w-full bg-[#EDEAE7] dark:bg-[#212121] relative py-4 md:py-4 px-6 md:px-6 lg:px-6"
  >
    <div
      class="mx-auto relative z-20 flex flex-col lg:flex-row gap-6 lg:gap-12 items-center justify-between"
    >
      <!-- Left side: Serif title -->
      <div class="flex items-center gap-3">
        <h4
          class="font-serif text-lg md:text-xl text-foreground tracking-wide font-normal"
        >
          Newsletter Sign Up
        </h4>
      </div>

      <!-- Right side: Sleek, horizontal form -->
      <form
        @submit.prevent
        class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center"
      >
        <base-input
          v-model="newsletterFormState.lastName"
          type="text"
          name="lastName"
          placeholder="Enter your name"
          class="w-full sm:w-[220px] md:w-[260px] bg-white dark:bg-transparent"
          required
        />

        <base-input
          v-model="newsletterFormState.email"
          type="email"
          name="email"
          placeholder="Enter your email"
          class="w-full sm:w-[220px] md:w-[260px] bg-white dark:bg-transparent"
        />

        <base-button 
        type="submit"
        :loading="loading"
        :disabled="loading"
        @click="onSubmit"
        >
         SUBSCRIBE 
        </base-button>
      </form>
    </div>
  </section>
</template>
