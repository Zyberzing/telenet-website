"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FaBookmark, FaUser } from "react-icons/fa";
import { FaGem } from "react-icons/fa6";

export default function AboutUs() {
  const t = useTranslations("AboutUs");

  const exploreCards = [
    {
      title: t("explore.cards.0.title"),
      desc: t("explore.cards.0.desc"),
      color: "bg-[#FF63CE]",
      icon: <FaGem color="white" />,
    },
    {
      title: t("explore.cards.1.title"),
      desc: t("explore.cards.1.desc"),
      color: "bg-[#A8E461]",
      icon: <FaBookmark color="white" />,
    },
    {
      title: t("explore.cards.2.title"),
      desc: t("explore.cards.2.desc"),
      color: "bg-[#BA89FE]",
      icon: <FaUser color="white" />,
    },
  ];

  const values = [
    {
      title: t("values.list.0.title"),
      desc: t("values.list.0.desc"),
    },
    {
      title: t("values.list.1.title"),
      desc: t("values.list.1.desc"),
    },
    {
      title: t("values.list.2.title"),
      desc: t("values.list.2.desc"),
    },
    {
      title: t("values.list.3.title"),
      desc: t("values.list.3.desc"),
    },
  ];

  const stats = [
    { value: "80K+", label: t("impact.stats.0.label") },
    { value: "170+", label: t("impact.stats.1.label") },
    { value: "6+", label: t("impact.stats.2.label") },
    { value: "90K+", label: t("impact.stats.3.label") },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="relative">
        <Image
          src="/banner-about-us.svg"
          alt={t("heroAlt")}
          width={1500}
          height={1000}
        />
      </div>

      <section className="bg-[#F4FAFE] py-16 px-6 md:px-12 lg:px-20 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
          {t("explore.title")}{" "}
          <span className="text-primary">{t("explore.highlight")}</span>
        </h2>
        <p className="text-gray-600 mt-2 max-w-lg mx-auto">
          {t("explore.subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
          {exploreCards.map((item, index) => (
            <Card
              key={index}
              className="border-none shadow-sm hover:shadow-md transition"
            >
              <CardContent className="p-8 flex flex-col items-start text-start">
                <div
                  className={`h-14 w-14 flex items-center justify-center rounded-full ${item.color} text-2xl mb-4`}
                >
                  {item.icon}
                </div>
                <h3 className="font-semibold text-[18px] text-gray-900 mb-2 w-12">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= OUR VALUES ================= */}
      <section className="bg-[#F4FAFE] py-16 px-6 md:px-12 lg:px-20 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
          {t("values.title")}{" "}
          <span className="text-primary">{t("values.highlight")}</span>
        </h2>
        <p className="text-gray-600 mt-2 max-w-lg mx-auto">
          {t("values.subtitle")}
        </p>

        <div className="mt-10 max-w-3xl mx-auto space-y-8">
          {values.map((val, i) => (
            <Card
              key={i}
              className="border-none bg-gray-50 mb-14 rounded-2xl shadow-sm hover:shadow-md transition text-center p-6 sm:p-8"
            >
              <CardContent className="flex flex-col items-center space-y-4">
                {/* Number Circle */}
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white font-semibold text-lg shadow-md -mt-14">
                  {i + 1}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-xl sm:text-2xl text-gray-900">
                  {val.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-[15px] leading-relaxed max-w-md">
                  {val.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= IMPACT SECTION ================= */}
      <section className="bg-[#F9FAFB] pt-16 px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center gap-0">
        {/* Text */}
        <div className="flex-1 text-center md:text-left order-1 md:order-1">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            {t("impact.title")}
            <br />
            <span className="text-primary">{t("impact.highlight")}</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto md:mx-0">
            {t("impact.subtitle")}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
            {stats.map((stat, i) => (
              <div key={i}>
                <h3 className="text-2xl font-semibold text-primary">
                  {stat.value}
                </h3>
                <p className="text-[15px]">{stat.label}</p>
              </div>
            ))}
          </div>

          <p className="my-8 max-w-md mx-auto md:mx-0 text-md">
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
