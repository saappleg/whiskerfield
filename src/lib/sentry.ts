const dsn = import.meta.env.VITE_SENTRY_DSN?.trim();

export function initSentry() {
  if (!dsn) return;

  void import('@sentry/react').then((Sentry) => {
    Sentry.init({
      dsn,
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: 0.2,
      sampleRate: 1.0,
      environment: import.meta.env.MODE,
    });
  });
}
