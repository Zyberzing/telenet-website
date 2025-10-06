"use client";

import { Mail, Lock, Chrome, Apple, Facebook } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Index";

export default function LoginForm() {
  return (
    <div className="w-full max-w-md space-y-6 mx-6">
      <div className="text-start">
        <p className="text-gray-500">Welcome back! 👋</p>
        <h2 className="text-2xl font-bold">Login to your account</h2>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input type="email" placeholder="Please enter your email" />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input type="password" placeholder="Enter password" />
      </div>

      {/* Login Button */}
      <Button className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white">
        Login
      </Button>

      {/* Forgot Password */}
      <div className="">
        <a href="#" className="text-sm text-primary hover:underline">
          Forgot Password?
        </a>
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
        <span className="h-px w-16 bg-gray-200"></span>
        or
        <span className="h-px w-16 bg-gray-200"></span>
      </div>

      {/* Social Login */}
      <div className="flex gap-3 justify-center">
        <Button variant="outline" size="default">
          <Chrome className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="default">
          <Apple className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="default">
          <Facebook className="h-5 w-5" />
        </Button>
      </div>

      {/* Register */}
      <div className="text-center text-sm">
        Not registered?{" "}
        <a href="/register" className="text-primary hover:underline">
          Create an account
        </a>
      </div>
    </div>
  );
}
