<script setup lang="ts">
import { WAIVER } from "~/data/waiver";

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits<{
  close: [];
  agree: [];
}>();

function close() {
  emit("close");
}

function agree() {
  emit("agree");
  emit("close");
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
      <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-[#A08860] mb-3">
        {{ WAIVER.documentName }}
      </p>
      <h2 class="text-3xl font-serif text-foreground mb-3">
        {{ WAIVER.title }}
      </h2>
      <div class="border border-[#A08860]/30 bg-[#A08860]/5 rounded-xs px-4 py-3 mb-8">
        <p class="text-xs leading-relaxed text-foreground/80">
          {{ WAIVER.governingLaw }}
        </p>
      </div>

      <div class="flex flex-col gap-7">
        <section v-for="section in WAIVER.sections" :key="section.heading">
          <h3 class="text-sm font-bold uppercase tracking-wider text-foreground mb-2">
            {{ section.heading }}
          </h3>
          <p
            v-for="(paragraph, index) in section.paragraphs"
            :key="index"
            class="text-sm leading-7 text-foreground/80"
          >
            {{ paragraph }}
          </p>
        </section>
      </div>

      <div class="border-t border-border/40 mt-8 pt-6">
        <p class="text-xs font-semibold uppercase tracking-wider text-foreground mb-6">
          {{ WAIVER.acceptance }}
        </p>
        <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
          <base-button variant="outline" @click="close">
            Close
          </base-button>
          <base-button
            class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none bg-[#A08860] hover:bg-[#8c7550] text-white"
            @click="agree"
          >
            I Have Read & Agree
          </base-button>
        </div>
      </div>
    </div>
  </base-modal>
</template>
