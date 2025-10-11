"use client";

import { ROUTES } from "@/routes";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 px-4 sm:px-6 md:px-10 lg:px-[6em]">
      {/* Top Section */}
      <div className="mx-auto max-w-7xl py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {/* Logo & About */}
        <div className="lg:col-span-2 flex flex-col items-start text-left">
          <Image
            src="/transparent-logo.svg"
            alt="Telenet Logo"
            width={150}
            height={56}
            className="h-[56px] w-[150px]"
          />
          <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed">
            Telenet Global helps travelers stay connected with eSIMs in 170+
            countries. Secure payments, instant activation, global support.
          </p>

          <div className="flex justify-start mt-5 gap-4 flex-wrap">
            <Image
              src="/app-store.svg"
              alt="App Store"
              width={135}
              height={65}
              className="h-[55px] w-[125px]"
            />
            <Image
              src="/play-store.svg"
              alt="Play Store"
              width={135}
              height={65}
              className="h-[55px] w-[125px]"
            />
          </div>
        </div>

        {/* Purchase */}
        <div className="flex flex-col items-start">
          <h3 className="font-semibold text-[18px] sm:text-[20px] text-primary">
            Purchase
          </h3>
          <ul className="mt-4 space-y-2 text-[15px] sm:text-[16px] text-left">
            <li>
              <Link href="#">Destinations</Link>
            </li>
            <li>
              <Link href="#">Regions</Link>
            </li>
            <li>
              <Link href="#">Top Up Now</Link>
            </li>
            <li>
              <Link href="#">Download App</Link>
            </li>
          </ul>
        </div>

        {/* Top Destinations */}
        <div className="flex flex-col items-start">
          <h3 className="font-semibold text-[18px] sm:text-[20px] text-primary">
            Top Destinations
          </h3>
          <ul className="mt-4 space-y-2 text-[15px] sm:text-[16px] text-left">
            <li>
              <Link href="#">Australia</Link>
            </li>
            <li>
              <Link href="#">United Kingdom</Link>
            </li>
            <li>
              <Link href="#">Thailand</Link>
            </li>
            <li>
              <Link href="#">United States of America</Link>
            </li>
            <li>
              <Link href="#">Canada</Link>
            </li>
            <li>
              <Link href="#">United Arab Emirates</Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div className="flex flex-col items-start">
          <h3 className="font-semibold text-[18px] sm:text-[20px] text-primary">
            Telenet Global
          </h3>
          <ul className="mt-4 space-y-2 text-[15px] sm:text-[16px] text-left">
            <li>
              <Link href="#">About Us</Link>
            </li>
            <li>
              <Link href="#">Careers</Link>
            </li>
            <li>
              <Link href={ROUTES.CONTACT_US}>Contact Us</Link>
            </li>
            <li>
              <Link href="#">Partner with Us</Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div className="flex flex-col items-start">
          <h3 className="font-semibold text-[18px] sm:text-[20px] text-primary">
            Resources
          </h3>
          <ul className="mt-4 space-y-2 text-[15px] sm:text-[16px] text-left">
            <li>
              <Link href="#">Blog</Link>
            </li>
            <li>
              <Link href="#">Help Center</Link>
            </li>
            <li>
              <Link href="#">Events</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-6 py-6 flex flex-col md:flex-row items-start justify-between gap-4 text-start">
        {/* Copyright */}
        <p className="text-sm sm:text-[15px]">
          Copyright ©{" "}
          <span className="text-primary font-medium">www.Telnet.com</span> All
          rights reserved. v1.0.3A
        </p>

        {/* Social Icons */}
        <div className="flex justify-start gap-4">
          {[
            "instagram-footer.svg",
            "facebook-footer.svg",
            "youtube-footer.svg",
            "linkedin-footer.svg",
            "x-footer.svg",
          ].map((icon, idx) => (
            <Image
              key={idx}
              src={`/social-media/${icon}`}
              alt="Social Icon"
              width={28}
              height={28}
              className="h-[26px] w-[26px] hover:opacity-80 transition"
            />
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-start gap-2 sm:gap-4 text-sm sm:text-[15px]">
          <Link href="#">Cookie Preference</Link>
          <span className="hidden sm:inline">|</span>
          <Link href="#">Terms & Conditions</Link>
          <span className="hidden sm:inline">|</span>
          <Link href="#">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
