"use client";

import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";

export default function CancelPage() {
  const router = useRouter();
  const locale = useLocale();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 dark:bg-black p-4">
      <h1 className="text-3xl font-bold text-red-800 dark:text-red-200 mb-4">
        Payment Cancelled
      </h1>
      <p className="text-red-700 dark:text-red-300">
        Your payment was not completed. You can try again or contact support.
      </p>
      <Button
        className="px-6 py-3 bg-primary text-white rounded-lg cursor-pointer mt-8"
        onClick={() => router.push(ROUTES.HOME(locale))}
      >
        <IoMdArrowBack /> Back to Home
      </Button>
    </div>
  );
}
