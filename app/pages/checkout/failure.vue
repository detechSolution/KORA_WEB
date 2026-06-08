<template>
  <div
    class="max-w-2xl mx-auto my-14 w-full bg-card border border-border p-10 md:p-16 flex flex-col items-center text-center gap-8 rounded-sm"
  >
    <div
      class="w-24 h-24 bg-card rounded-full flex items-center justify-center mb-2 z-10 border border-destructive/80"
    >
      <UIcon name="i-lucide-x" class="w-10 h-10 text-destructive" />
    </div>
    <div class="flex flex-col gap-4">
      <h1
        class="text-3xl md:text-4xl font-serif text-foreground font-medium uppercase tracking-wide"
      >
        Payment Failed
      </h1>
      <p class="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
        We couldn't process your payment. Please try again or contact support if
        the issue persists.
      </p>
    </div>
    <base-button
      to="/checkout"
      variant="outline"
      class="uppercase tracking-widest text-[11px] font-bold px-12 py-4 rounded-none mt-4"
    >
      RETURN TO CHECKOUT
    </base-button>
  </div>
</template>
