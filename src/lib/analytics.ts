type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

export function initializeAnalytics() {
  const win = window as AnalyticsWindow;
  const gaId = import.meta.env.VITE_GA4_ID;
  const pixelId = import.meta.env.VITE_META_PIXEL_ID;

  if (gaId && !win.gtag) {
    win.dataLayer = win.dataLayer || [];
    win.gtag = (...args: unknown[]) => { win.dataLayer?.push(args); };
    win.gtag("js", new Date());
    win.gtag("config", gaId, { anonymize_ip: true });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(script);
  }

  if (pixelId && !win.fbq) {
    const fbq = ((...args: unknown[]) => { (fbq.queue ||= []).push(args); }) as ((...args: unknown[]) => void) & { queue?: unknown[][] };
    win.fbq = fbq;
    win.fbq("init", pixelId);
    win.fbq("track", "PageView");
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }
}

export function trackEvent(name: string, details: Record<string, string> = {}) {
  const win = window as AnalyticsWindow;
  win.gtag?.("event", name, details);
  if (name === "estimate_submit") win.fbq?.("track", "Lead");
  if (import.meta.env.DEV) console.info("[analytics event]", name, details);
}