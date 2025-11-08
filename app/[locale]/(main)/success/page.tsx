"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
      <h1 className="text-3xl font-bold text-green-800 mb-4">
        Payment Successful!
      </h1>
      <p className="text-green-700 mb-2">
        Your order has been processed successfully.
      </p>
      {sessionId && (
        <p className="text-green-700 text-sm">
          Session ID: <span className="font-mono">{sessionId}</span>
        </p>
      )}
    </div>
  );
}
