import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is an eSIM?",
    answer:
      "An eSIM (embedded SIM) is a digital SIM that allows you to activate a mobile data plan without needing a physical SIM card. It works just like a regular SIM but is embedded inside your device.",
  },
  {
    question: "How do I activate an eSIM after purchase?",
    answer:
      "You can activate your eSIM by scanning the QR code provided by your carrier or following their activation steps in your device settings.",
  },
  {
    question: "Can I keep my regular SIM and use eSIM together?",
    answer:
      "Yes, many devices support dual SIM functionality, allowing you to use both a physical SIM and an eSIM simultaneously.",
  },
  {
    question: "Do I need internet to install the eSIM?",
    answer:
      "Yes, an internet connection is usually required to download and install the eSIM profile onto your device.",
  },
  {
    question: "Which devices support eSIM?",
    answer:
      "Most modern smartphones, tablets, and some smartwatches support eSIM technology. Check your device settings or manufacturer details.",
  },
  {
    question: "Can I use eSIMs while traveling abroad?",
    answer:
      "Yes, eSIMs are great for travel. You can easily switch between local carriers without changing physical SIM cards.",
  },
  {
    question: "How long does it take to activate?",
    answer:
      "Activation usually takes just a few minutes, depending on your carrier and device.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "Most providers accept credit cards, debit cards, PayPal, and other popular online payment methods.",
  },
  {
    question: "Can I top up my eSIM plan?",
    answer:
      "Yes, you can top up or recharge your eSIM plan through your provider’s app or website.",
  },
  {
    question: "What if I face issues during installation?",
    answer:
      "If you face issues, contact your provider’s support team. They will guide you step by step to resolve the problem.",
  },
];

export default function FAQ() {
  return (
    <section className="w-full py-16 px-2">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">Frequently Asked Questions</h2>

        <div className="grid md:grid-cols-2 gap-6 text-left">
          {faqs.map((faq, index) => (
            <>
              <Accordion
                type="single"
                collapsible
                className="bg-gradient-three p-2 px-6 border  rounded-xl border-[#F1F1F1]"
              >
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-normal text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600 text-sm  leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          ))}
        </div>
      </div>
    </section>
  );
}
