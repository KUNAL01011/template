import { sdk } from "./core/observability/tracing.js";

sdk.start();

process.on("SIGTERM", async () => {
  await sdk.shutdown();
});

process.on("SIGINT", async () => {
  await sdk.shutdown();
});