"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const validMeasurementId = measurementId && /^G-[A-Z0-9]+$/i.test(measurementId)
  ? measurementId.toUpperCase()
  : null;

function PageViewTracker({ id }: { id: string }) {
  const pathname = usePathname();

  useEffect(() => {
    let attempts = 0;
    let timer: number | undefined;

    const sendPageView = () => {
      if (window.gtag) {
        window.gtag("event", "page_view", {
          page_location: `${window.location.origin}${pathname}`,
          page_path: pathname,
          page_title: document.title,
          send_to: id,
        });
        return;
      }
      attempts += 1;
      if (attempts < 20) timer = window.setTimeout(sendPageView, 250);
    };

    sendPageView();
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [id, pathname]);

  return null;
}

export function GoogleAnalytics() {
  if (!validMeasurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(validMeasurementId)}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${validMeasurementId}', { send_page_view: false });
        `}
      </Script>
      <PageViewTracker id={validMeasurementId} />
    </>
  );
}
