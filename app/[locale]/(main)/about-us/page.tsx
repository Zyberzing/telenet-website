import AboutUs from "./AboutUs";
import { getPageMetadata } from "@/services/seo";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "about-us");
}

export default async function Page() {
  // 🧠 SSR: This function runs on the server
  const t = await getTranslations("AboutUs");

  // Build your translated JSON arrays using t() server-side
  const exploreCards = [
    {
      title: t("explore.cards.0.title"),
      desc: t("explore.cards.0.desc"),
      color: "bg-[#FF63CE]",
      icon: "gem",
    },
    {
      title: t("explore.cards.1.title"),
      desc: t("explore.cards.1.desc"),
      color: "bg-[#A8E461]",
      icon: "bookmark",
    },
    {
      title: t("explore.cards.2.title"),
      desc: t("explore.cards.2.desc"),
      color: "bg-[#BA89FE]",
      icon: "user",
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

  // ✅ Pass these as props to the client component
  return (
    <AboutUs
      exploreCards={exploreCards}
      values={values}
      stats={stats}
    />
  );
}
