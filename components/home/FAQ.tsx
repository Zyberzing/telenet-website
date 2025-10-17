"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

const faqsData = [
  { questionKey: "faq.q1", answerKey: "faq.a1" },
  { questionKey: "faq.q2", answerKey: "faq.a2" },
  { questionKey: "faq.q3", answerKey: "faq.a3" },
  { questionKey: "faq.q4", answerKey: "faq.a4" },
  { questionKey: "faq.q5", answerKey: "faq.a5" },
  { questionKey: "faq.q6", answerKey: "faq.a6" },
  { questionKey: "faq.q7", answerKey: "faq.a7" },
  { questionKey: "faq.q8", answerKey: "faq.a8" },
  { questionKey: "faq.q9", answerKey: "faq.a9" },
  { questionKey: "faq.q10", answerKey: "faq.a10" },
];

export default function FAQ() {
  const t = useTranslations("FAQ");

  return (
    <section className="w-full py-16 px-2">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-[400px] mb-10">
          {t("title")}
        </h2>

        <div className="grid md:grid-cols-2 gap-6 text-left">
          {faqsData.map((faq, index) => (
            <Accordion
              key={index}
              type="single"
              collapsible
              className="p-4 px-6 border rounded-xl border-[#F1F1F1]"
            >
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger>{t(faq.questionKey)}</AccordionTrigger>
                <AccordionContent>{t(faq.answerKey)}</AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}
