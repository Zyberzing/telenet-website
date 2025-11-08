"use client";

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
      <h1 className="text-3xl font-bold text-red-800 mb-4">
        Payment Cancelled
      </h1>
      <p className="text-red-700">
        Your payment was not completed. You can try again or contact support.
      </p>
    </div>
  );
}
