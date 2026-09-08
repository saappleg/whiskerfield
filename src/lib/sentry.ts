const dsn = import.meta.env.VITE_SENTRY_DSN?.trim();

export function initSentry() {
  if (!dsn) {
    if (import.meta.env.DEV) {
      console.info('[Sentry] VITE_SENTRY_DSN not detected. Error tracking is idle in local development.');
    }
    return;
  }

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

export async function captureError(error: unknown, context?: Record<string, unknown>) {
  if (!dsn) {
    console.error('[App Error]', error, context);
    return;
  }

  try {
    const Sentry = await import('@sentry/react');
    Sentry.captureException(error, { extra: context });
  } catch {
    console.error(error);
  }
}
