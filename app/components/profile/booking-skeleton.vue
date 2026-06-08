<template>
  <div class="flex flex-col">
    <div
      v-for="i in 3"
      :key="i"
      class="flex flex-col sm:flex-row justify-between py-6 border-b border-border gap-6"
    >
      <!-- Left side: Image and details -->
      <div class="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
        <!-- Thumbnail -->
        <USkeleton
          class="w-24 h-24 rounded-xs shrink-0 bg-muted/60 dark:bg-muted/10"
        />

        <!-- Details -->
        <div class="flex flex-col justify-center gap-3 w-full">
          <!-- Title and Badge -->
          <div class="flex items-center gap-3">
            <USkeleton class="h-6 w-40 sm:w-48 bg-muted/60 dark:bg-muted/10 rounded" />
            <USkeleton class="h-4 w-16 bg-muted/60 dark:bg-muted/10 rounded" />
          </div>

          <!-- Date / Time / Location -->
          <div class="flex flex-wrap items-center gap-4">
            <USkeleton class="h-3 w-20 bg-muted/60 dark:bg-muted/10 rounded" />
            <USkeleton class="h-3 w-16 bg-muted/60 dark:bg-muted/10 rounded" />
            <USkeleton class="h-3 w-24 bg-muted/60 dark:bg-muted/10 rounded" />
          </div>
        </div>
      </div>

      <!-- Right side: Price & Buttons -->
      <div
        class="flex flex-col justify-between sm:items-end gap-6 sm:gap-0 mt-4 sm:mt-0 shrink-0"
      >
        <USkeleton class="h-6 w-20 bg-muted/60 dark:bg-muted/10 rounded self-start sm:self-end" />

        <div class="w-full md:w-auto flex items-center gap-3 self-start sm:self-end">
          <USkeleton class="h-8 w-28 bg-muted/60 dark:bg-muted/10 rounded" />
          <USkeleton class="h-8 w-28 bg-muted/60 dark:bg-muted/10 rounded" />
        </div>
      </div>
    </div>
  </div>
</template>
