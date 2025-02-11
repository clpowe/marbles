export default defineAppConfig({
  uiPro: {
    main: {
      base: "min-h-[calc(100vh-var(--ui-header-height))] h-full",
    },
    carousel: {
      item: "min-w-0 shrink-0 basis-full relative",
    },
  },
});
