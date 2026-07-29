<template>
  <div class="flex flex-col gap-6">
    <div
      v-for="i in 3"
      :key="i"
      class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10 py-10 border-b border-border last:border-b-0 w-full"
    >
      <USkeleton
        class="relative w-full md:w-[260px] lg:w-[300px] shrink-0 aspect-[1.15] shadow-sm"
      />

      <div class="grow flex flex-col items-start gap-3 py-1 w-full">
        <USkeleton class="h-6 w-20 rounded-xs" />
        <USkeleton class="h-3 w-28 mt-1 rounded" />
        <USkeleton
          class="h-7 w-3/4 max-w-sm mt-1 mb-1 rounded"
        />
        <USkeleton
          class="h-10 w-full max-w-xl rounded"
        />
        <div class="flex gap-5 mt-1">
          <USkeleton class="h-3 w-16 rounded" />
          <USkeleton class="h-3 w-16 rounded" />
        </div>
      </div>

      <div
        class="flex flex-col justify-center items-start md:items-end gap-3 min-w-[160px] pt-4 md:pt-0 shrink-0 w-full md:w-auto"
      >
        <div class="h-2 w-20 rounded" />
        <div class="h-7 w-16 rounded" />
        <div class="h-10 w-32 rounded mt-2" />
      </div>
    </div>
  </div>
</template>
