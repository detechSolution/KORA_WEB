<script setup lang="ts">
import { computed } from "vue";

type Props = {
  name: string; // Required for UFormField
  label?: string;
  placeholder?: string;
  required?: boolean;
  modelValue: any;
  options: {
    label: string;
    value: any;
  }[];
  loading?: boolean;
  disabled?: boolean;
  leadingIcon?: string;
  inputBgPrimary?: boolean;
  isBorderless?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  label: "",
  required: false,
  placeholder: "",
  loading: false,
  disabled: false,
  inputBgPrimary: true,
  isBorderless: false,
});

const emit = defineEmits(["update:modelValue"]);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <UFormField
    :label="props.label"
    :name="props.name"
    :required="props.required"
    :ui="{
      error: 'mt-1 text-red-500 text-xs',
    }"
  >
    <USelect
      v-model="inputValue"
      :items="props.options"
      :placeholder="props.placeholder"
      :loading="props.loading"
      :disabled="props.disabled"
      variant="outline"
      class="w-full"
      size="lg"
      :ui="{
        base: `px-4 py-2 border border-border bg-transparent hover:bg-[#C9A55A1A]/50 transition-colors rounded-xs flex items-center gap-2 text-foreground font-normal focus:ring-1 dark:ring-secondary-800`,
        item: 'hover:bg-background dark:hover:bg-secondary-800 hover:text-foreground rounded-xs overflow-hidden cursor-pointer',
        content: 'bg-card border border-border rounded-xs',
        trailingIcon: 'h-5 w-5 text-foreground',
        leadingIcon: 'h-5 w-5 text-foreground',
      }"
    >
      <template v-if="props.leadingIcon" #leading>
        <UIcon :name="props.leadingIcon" />
      </template>
    </USelect>
  </UFormField>
</template>
