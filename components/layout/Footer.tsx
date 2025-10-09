import { ROUTES } from "@/routes";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaApple, FaGooglePlay } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-5 gap-8 content-center">
        {/* Logo & About */}
        <div>
          <Image
            src="/logo.svg"
            alt="Telenet Logo"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
          <p className="mt-4 text-sm">
            Telenet Global helps travelers stay connected with eSIMs in 170+
            countries. Secure payments, instant activation, global support
          </p>
          <div className="flex justify-center lg:justify-start gap-4 mt-6">
            <div className="flex gap-3 items-center border border-white rounded-md px-3 py-1 bg-transparent">
              <FaGooglePlay className="text-white text-3xl" />
              <div className="text-start leading-none">
                <p className="text-[10px] m-0 p-0">GET IT ON</p>
                <p className="text-xs font-semibold m-0 p-0">Google Play</p>
              </div>
            </div>

            <div className="flex gap-3 items-center border border-white rounded-md px-3 py-1 bg-transparent">
              <FaApple className="text-white text-4xl" />
              <div className="text-start leading-none">
                <p className="text-[10px] m-0 p-0">Download on the</p>
                <p className="text-xs font-semibold m-0 p-0">App Store</p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase */}
        <div>
          <h3 className="font-semibold text-white">Purchase</h3>
          <ul className="mt-4 space-y-2 text-sm">
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
        <div>
          <h3 className="font-semibold text-white">Top Destinations</h3>
          <ul className="mt-4 space-y-2 text-sm">
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
              <Link href="#">United States</Link>
            </li>
            <li>
              <Link href="#">Canada</Link>
            </li>
            <li>
              <Link href="#">UAE</Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold text-white">Telenet Global</h3>
          <ul className="mt-4 space-y-2 text-sm">
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

        {/* resources */}
        <div>
          <h3 className="font-semibold text-white">Resources</h3>
          <ul className="mt-4 space-y-2 text-sm">
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

      {/* Bottom bar */}
      <div className="border-t border-gray-700 mt-6 py-4 px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-xs">
          Copyright © www.Telnet.com | All rights reserved.
        </p>
        <div className="flex gap-4 mt-3 md:mt-0">
          <Instagram className="w-5 h-5 cursor-pointer" />
          <Facebook className="w-5 h-5 cursor-pointer" />
          <Youtube className="w-5 h-5 cursor-pointer" />
          <Linkedin className="w-5 h-5 cursor-pointer" />
        </div>
        <div className="flex gap-6 items-center">
          <p>Cookie Preference</p>
          <p>|</p>
          <p>Terms & Conditions</p>
          <p>|</p>
          <p>Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
}
