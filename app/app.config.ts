export default defineAppConfig({
  ui: {
    pagination: {
      slots: {
        root: "w-full",
        list: "flex flex-nowrap items-center justify-end gap-1",
        item: "cursor-pointer bg-transparent hover:bg-primary/10 data-[selected=true]:bg-primary-700 ring-secondary-200 dark:ring-secondary-700 flex items-center justify-center min-w-9 h-9 justify-center rounded-xs text-sm font-medium transition-colors sm:min-w-9 sm:h-9 sm:text-sm",
        first:
          "rounded-xs min-w-9 h-9 bg-transparent hover:bg-primary/10 disabled:bg-transparent ring-secondary-200 dark:ring-secondary-700 flex items-center justify-center",
        prev: "rounded-xs min-w-9 h-9 bg-transparent hover:bg-primary/10 disabled:bg-transparent ring-secondary-200 dark:ring-secondary-700 flex items-center justify-center",
        next: "rounded-xs min-w-9 h-9 bg-transparent hover:bg-primary/10 disabled:bg-transparent ring-secondary-200 dark:ring-secondary-700 flex items-center justify-center",
        last: "rounded-xs min-w-9 h-9 bg-transparent hover:bg-primary/10 disabled:bg-transparent ring-secondary-200 dark:ring-secondary-700 flex items-center justify-center",
      },
    },
  },
  safelist: [
    "min-w-[150px]",
    "max-w-[1000px]",
    "max-w-[900px]",
    "max-w-[800px]",
    "max-w-[700px]",
    "max-w-[600px]",
  ],
});
