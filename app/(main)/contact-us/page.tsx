"use client";

import { Input } from "@/components/ui/Index";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import Image from "next/image";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🌆 Hero Section */}
      <div className="relative w-full h-[22.6vh]">
        <Image
          src="/contact-us-banner.svg"
          alt="Contact Us"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* 📩 Contact Info + Form */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Left: Contact Info */}
          <div className="bg-white p-8 rounded-2xl shadow-md w-full lg:w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Get in touch</h2>
            <p className="text-gray-600 mb-6">
              Want to get in touch? We'd love to hear from you. Here's how you
              can reach us.
            </p>

            <div className="space-y-5">
              {/* Email */}
              <div className="flex items-center gap-4 border p-4 rounded-b-2xl rounded-tl-2xl hover:shadow">
                <Image src="/mail.svg" alt="Mail" width={40} height={40} />
                <div>
                  <p>We’re always happy to help.</p>
                  <a
                    href="mailto:ask@retro.ai.com"
                    className="text-[#848484] text-sm"
                  >
                    ask@retro.ai.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 border p-4 rounded-b-2xl rounded-tl-2xl hover:shadow">
                <Image src="/phone.png" alt="Phone" width={40} height={40} />
                <div>
                  <p>Our hotline number</p>
                  <p className="text-[#848484] text-sm">
                    +757 889 4478, +21 377 9731
                  </p>
                </div>
              </div>

              {/* Chat */}
              <div className="flex items-center gap-4 border p-4 rounded-b-2xl rounded-tl-2xl hover:shadow">
                <Image
                  src="/live-chat.svg"
                  alt="Live Chat"
                  width={40}
                  height={40}
                />
                <div>
                  <p>Live chat</p>
                  <a
                    href="https://www.retrolivechat.com"
                    className="text-[#848484] text-sm"
                  >
                    www.retrolivechat.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white p-10 rounded-2xl shadow-md w-full lg:w-1/2 border border-gray-100">
            <form className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-gray-600 text-sm">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Rashed Kabir"
                  className="px-0 border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus:border-primary"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-600 text-sm">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="rshdkabir@gmail.com"
                  className="px-0 border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus:border-primary"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-gray-600 text-sm">
                  Your Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  className="px-0 border-0 border-b border-gray-300 rounded-none resize-none focus-visible:ring-0 focus:border-primary"
                  rows={4}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white font-medium py-3 rounded-md mt-2 hover:opacity-90 transition-all duration-200"
              >
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
