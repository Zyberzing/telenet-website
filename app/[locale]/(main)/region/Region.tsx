"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo, useState } from "react";

export type Region = {
  id: string;
  name: string;
  slug?: string;
  image?: string; // url
  description?: string;
};

type Props = {
  regions: Region[];
  onSelect?: (region: Region) => void;
};

export default function Region({ regions, onSelect }: Props) {
  const t = useTranslations("Region");
  const alphaGroups = [
    { key: "All", label: t("all") },
    { key: "A-B", label: "A-B", range: ["A", "B"] },
    { key: "C-E", label: "C-E", range: ["C", "E"] },
    { key: "F-H", label: "F-H", range: ["F", "H"] },
    { key: "I-K", label: "I-K", range: ["I", "K"] },
    { key: "L-M", label: "L-M", range: ["L", "M"] },
    { key: "N-Q", label: "N-Q", range: ["N", "Q"] },
    { key: "R-S", label: "R-S", range: ["R", "S"] },
    { key: "T-Z", label: "T-Z", range: ["T", "Z"] },
  ];
  const [activeAlpha, setActiveAlpha] = useState<string>("All");
  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = regions ?? [];

    // alpha filtering
    if (activeAlpha !== "All") {
      const group = alphaGroups.find((g) => g.key === activeAlpha);
      if (group?.range) {
        const [start, end] = group.range as [string, string];
        list = list.filter((r) => {
          const first = (r.name?.[0] ?? "").toUpperCase();
          return first >= start && first <= end;
        });
      }
    }

    if (q) {
      list = list.filter((r) => {
        return (
          r.name?.toLowerCase().includes(q) ||
          (r.description ?? "").toLowerCase().includes(q)
        );
      });
    }

    return list;
  }, [regions, activeAlpha, query]);

  return (
    <div className="max-w-7xl mx-auto py-12">
      {/* Hero / header */}
      <div className="text-center px-3 mb-10 bg-gradient-to-b from-white via-[#F4F7FF] to-[#E4ECFF] dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 pt-12 pb-16">
        <h1 className="text-4xl md:text-[60px] font-bold tracking-tight text-[#111111] dark:text-white">
          {t("title")} <span className="block">{t("titleHighlight")}</span>
        </h1>
        <p className="text-sm text-primary dark:text-blue-300 mt-2">
          {t("subtitle")}
        </p>

        {/* alpha pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {alphaGroups.map((g) => (
            <button
              key={g.key}
              onClick={() => setActiveAlpha(g.key)}
              className={`px-3 py-1 rounded-full text-sm border cursor-pointer transition
                ${activeAlpha === g.key
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* search */}
        <div className="mt-6 flex justify-center">
          <div className="w-full md:w-2/3 lg:w-1/2 relative">
            <input
              aria-label={t("searchAria")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full py-4 px-6 border-2 rounded-full shadow-sm placeholder-gray-400 text-gray-800 dark:text-gray-200 dark:placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={() => { }}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-gradient dark:bg-gradient-to-r dark:from-gray-600 dark:to-gray-800 text-white flex items-center justify-center shadow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-5 mx-1 md:mx-10">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            {t("noRegions")}
          </div>
        ) : null}

        {filtered.map((r) => (
          <div
            key={r.id}
            role="button"
            onClick={() => onSelect?.(r)}
            className="group rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer bg-white dark:bg-gray-800"
          >
            <div className="h-[15em] w-full relative">
              {r?.image ? (
                <Image
                  src={r.image}
                  alt={r.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                  className="object-cover"
                />
              ) : (
                <div className="bg-gray-100 dark:bg-gray-700 w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  {t("noImage")}
                </div>
              )}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-[#343a16] bg-opacity-55 text-white border border-[stroke weight/2] text-sm py-1 px-3 rounded-md max-w-xs text-center">
                  {r.name}
                </div>
              </div>
            </div>

            {/* <div className="p-3">
              <p className="text-sm text-gray-600 line-clamp-2">
                {r.description ?? "Explore plans, prices and more."}
              </p>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
