"use client";

import { useState } from "react";
import { LoadingButton } from "@/components/ui/loading-button";

export default function LoadingButtonExample() {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const handleLogin = async () => {
    setLoading1(true);
    // Simulate login API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading1(false);
  };

  const handleRegister = async () => {
    setLoading2(true);
    // Simulate register API call
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setLoading2(false);
  };

  const handleOrder = async () => {
    setLoading3(true);
    // Simulate order API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading3(false);
  };

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Simple LoadingButton Examples</h2>

      {/* Login Button */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Login Button</h3>
        <LoadingButton
          onClick={handleLogin}
          loading={loading1}
          label={loading1 ? "Signing in..." : "Sign In"}
          className="bg-blue-600 text-white px-6 py-2"
        />
      </div>

      {/* Register Button */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Register Button</h3>
        <LoadingButton
          onClick={handleRegister}
          loading={loading2}
          label={loading2 ? "Creating account..." : "Register"}
          className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-3"
        />
      </div>

      {/* Order Button */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Order Button</h3>
        <LoadingButton
          onClick={handleOrder}
          loading={loading3}
          label={loading3 ? "Processing..." : "Place Order"}
          className="bg-purple-600 text-white rounded-full px-8 py-3"
        />
      </div>

      {/* Different Styles */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Different Styles</h3>
        <div className="flex gap-4">
          <LoadingButton
            onClick={handleLogin}
            loading={loading1}
            label={loading1 ? "Loading..." : "Default"}
          />

          <LoadingButton
            onClick={handleRegister}
            loading={loading2}
            label={loading2 ? "Loading..." : "Custom Style"}
            className="bg-green-600 text-white hover:bg-green-700"
          />

          <LoadingButton
            onClick={handleOrder}
            loading={loading3}
            label={loading3 ? "Deleting..." : "Delete"}
            className="bg-red-600 text-white hover:bg-red-700"
          />
        </div>
      </div>
    </div>
  );
}
