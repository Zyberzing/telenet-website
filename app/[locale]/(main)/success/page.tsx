"use client";

import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes";
import { useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";

export default function SuccessPage() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 dark:bg-gray-900 p-4">
      <h1 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-4">
        Payment Successful!
      </h1>
      <p className="text-green-700 dark:text-green-300 mb-2">
        Your order has been processed successfully.
      </p>
      {sessionId && (
        <p className="text-green-700 dark:text-green-300 text-sm">
          Session ID: <span className="font-mono">{sessionId}</span>
        </p>
      )}
      <Button
        className="px-6 py-3 bg-primary text-white rounded-lg cursor-pointer mt-8"
        onClick={() => router.push(ROUTES.HOME(locale))}
      >
        <IoMdArrowBack /> Back to Home
      </Button>
    </div>
  );
}
