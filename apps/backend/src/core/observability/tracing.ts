import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { ExpressLayerType } from "@opentelemetry/instrumentation-express";
import { env } from "@/config/env.js";

const OTLP_ENDPOINT =env.OTEL_EXPORTER_OTLP_ENDPOINT ?? "http://localhost:4318/v1/traces";

// Warn early — silent misconfiguration is the worst kind
if (!env.OTEL_EXPORTER_OTLP_ENDPOINT) {
  console.warn(
    "[tracing] OTEL_EXPORTER_OTLP_ENDPOINT is not set. " +
      `Falling back to default: ${OTLP_ENDPOINT}`
  );
}

const traceExporter = new OTLPTraceExporter({
  url: OTLP_ENDPOINT,
});

export const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "backend",
    [ATTR_SERVICE_VERSION]: "1.0.0",
  }),

  traceExporter,

  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-express": {
        ignoreLayersType: [
          ExpressLayerType.MIDDLEWARE,
          ExpressLayerType.ROUTER,
        ],
      },
    }),
  ],
});
