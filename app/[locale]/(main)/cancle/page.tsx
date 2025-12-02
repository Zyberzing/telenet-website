"use client";

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 dark:bg-black p-4">
      <h1 className="text-3xl font-bold text-red-800 dark:text-red-200 mb-4">
        Payment Cancelled
      </h1>
      <p className="text-red-700 dark:text-red-300">
        Your payment was not completed. You can try again or contact support.
      </p>
    </div>
  );
}
