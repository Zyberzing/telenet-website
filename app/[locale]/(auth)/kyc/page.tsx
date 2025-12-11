"use client";

import { ROUTES } from "@/routes";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    snsWebSdk: any;
  }
}

export default function KYC() {
  const locale = useLocale();
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("sumsub_kyc_token");
    if (!storedToken) {
      router.push(ROUTES.LOGIN(locale));
      return;
    }
    setToken(storedToken);
  }, [router]);

  useEffect(() => {
    if (!token) return;

    // dynamically load Sumsub SDK
    const script = document.createElement("script");
    script.src =
      "https://static.sumsub.com/idensic/static/sns-websdk-builder.js";
    script.async = true;
    script.onload = () => {
      if (!window.snsWebSdk) {
        console.error("Sumsub SDK not loaded");
        return;
      }

      const snsWebSdkInstance = window.snsWebSdk
        .init(token, async () => {
          // Here you can implement your token refresh logic
          const newToken = await fetch("/api/get-new-sumsub-token").then(
            (res) => res.text()
          );
          return newToken;
        })
        .withConf({
          lang: "en",
          theme: "light", // pick "dark" or "light"
        })
        .withOptions({
          addViewportTag: false,
          adaptIframeHeight: true,
        })
        .on("idCheck.onStepCompleted", (payload: any) => {
          console.log("Step completed:", payload);
        })
        .on("idCheck.onError", (error: unknown) => {
          console.error("KYC error:", error);
        })
        .build();

      snsWebSdkInstance.launch("#sumsub-websdk-container");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [token]);

  return (
    <div className="my-3">
      <div id="sumsub-websdk-container"></div>
    </div>
  );
}
