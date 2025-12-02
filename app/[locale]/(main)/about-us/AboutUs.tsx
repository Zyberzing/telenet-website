"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FaBookmark, FaUser } from "react-icons/fa";
import { FaGem } from "react-icons/fa6";
import { useEffect, useState } from "react";

interface AboutUsProps {
  exploreCards: {
    title: string;
    desc: string;
    color: string;
    icon: string;
  }[];
  values: {
    title: string;
    desc: string;
  }[];
  stats: {
    value: string;
    label: string;
  }[];
}

export default function AboutUs({ exploreCards, values, stats }: AboutUsProps) {
  const t = useTranslations("AboutUs");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const getIcon = (name: string) => {
    switch (name) {
      case "gem":
        return <FaGem color="white" />;
      case "bookmark":
        return <FaBookmark color="white" />;
      case "user":
        return <FaUser color="white" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300 ${isDarkMode ? "dark" : ""
        }`}
    >
      {/* ================= BANNER ================= */}
      <div className="relative">
        <Image
          src="/banner-about-us.svg"
          alt="banner"
          width={1500}
          height={1000}
          className="w-full h-auto"
        />
      </div>

      {/* ================= EXPLORE SECTION ================= */}
      <section className="bg-card py-16 px-6 md:px-12 lg:px-20 text-center transition-colors duration-300">
        <h2 className="text-2xl md:text-3xl font-[400] text-foreground">
          {t("explore.title")}{" "}
          <span className="text-primary">{t("explore.highlight")}</span>
        </h2>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          {t("explore.subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
          {exploreCards.map((item, index) => (
            <Card
              key={index}
              className="border border-border bg-card shadow-sm hover:shadow-md transition-colors duration-300"
            >
              <CardContent className="p-8 flex flex-col items-start text-start">
                <div
                  className={`h-14 w-14 flex items-center justify-center rounded-full ${item.color} text-2xl mb-4`}
                >
                  {getIcon(item.icon)}
                </div>
                <h3 className="font-[400] text-[18px] text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-[15px] leading-relaxed">
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= OUR VALUES ================= */}
      <section className="bg-muted py-16 px-6 md:px-12 lg:px-20 text-center transition-colors duration-300">
        <h2 className="text-2xl md:text-3xl font-[400] text-foreground">
          {t("values.title")}{" "}
          <span className="text-primary">{t("values.highlight")}</span>
        </h2>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          {t("values.subtitle")}
        </p>

        <div className="mt-10 max-w-3xl mx-auto space-y-8">
          {values.map((val, i) => (
            <Card
              key={i}
              className="border-none bg-card mb-14 rounded-2xl shadow-sm hover:shadow-md transition-colors duration-300 text-center p-6 sm:p-8"
            >
              <CardContent className="flex flex-col items-center space-y-4">
                {/* Number Circle */}
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-[400] text-lg shadow-md -mt-14">
                  {i + 1}
                </div>

                {/* Title */}
                <h3 className="font-[400] text-xl sm:text-2xl text-foreground">
                  {val.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-[15px] leading-relaxed max-w-md">
                  {val.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= IMPACT SECTION ================= */}
      <section className="bg-card pt-16 px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center gap-0 transition-colors duration-300">
        {/* Text */}
        <div className="flex-1 text-center md:text-left order-1 md:order-1">
          <h2 className="text-2xl md:text-3xl font-[400] text-foreground">
            {t("impact.title")}
            <br />
            <span className="text-primary">{t("impact.highlight")}</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto md:mx-0">
            {t("impact.subtitle")}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
            {stats.map((stat, i) => (
              <div key={i}>
                <h3 className="text-2xl font-[400] text-primary">
                  {stat.value}
                </h3>
                <p className="text-[15px] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <p className="my-8 max-w-md mx-auto md:mx-0 text-md text-muted-foreground">
            {t("impact.content")}
          </p>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center order-2 md:order-2 mt-8 md:mt-0">
          <Image
            src="/about-impact.svg"
            alt="Impact Image"
            width={1000}
            height={1000}
            className="object-contain w-full max-w-sm md:max-w-md lg:max-w-lg -mb-24 md:-mb-72 lg:-mb-32"
          />
        </div>
      </section>
    </div>
  );
}
