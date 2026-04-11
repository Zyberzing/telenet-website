"use client";

import { useEffect } from "react";

export default function HtmlLanguageSync({
  lang,
  dir,
}: {
  lang: string;
  dir: "ltr" | "rtl";
}) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.body.dir = dir;
  }, [dir, lang]);

  return null;
}
