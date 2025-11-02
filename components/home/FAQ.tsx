"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useGetFaqMutation } from "@/services/cms-content/faqApi";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

type FaqItem = {
  _id: string;
  question: string;
  answer: string;
};

export default function FAQ() {
  const t = useTranslations("FAQ");
  const [getFaqs, { isLoading }] = useGetFaqMutation();
  const [faqList, setFaqList] = useState<FaqItem[]>([]);

  // 🔹 Fetch FAQs when component mounts
  useEffect(() => {
    (async () => {
      try {
        const response = await getFaqs(null).unwrap();
        setFaqList(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      }
    })();
  }, [getFaqs]);

  return (
    <section className="w-full py-16 px-2">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-[400px] mb-10">
          {t("title")}
        </h2>

        {isLoading ? (
          <p className="w-full items-center text-center">
            <FaSpinner />
          </p>
        ) : faqList.length === 0 ? (
          <p>{t("notFound")}</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {faqList.map((faq: FaqItem) => (
              <Accordion
                key={faq._id}
                type="single"
                collapsible
                className="p-4 px-6 border rounded-xl border-[#F1F1F1]"
              >
                <AccordionItem value={faq._id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
