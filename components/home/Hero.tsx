"use client";

import Image from "next/image";
import { Button } from "../ui/Button";
import { IoIosArrowForward } from "react-icons/io";
import { FaLocationDot, FaMagnifyingGlass } from "react-icons/fa6";

export default function Hero() {
  return (
    <section className="w-full text-center py-16 bg-gray-50 relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Rating */}
      <div className="text-black px-4 py-1 inline-block rounded-full text-sm mb-4 border border-primary">
        ★★★★☆ Rated 4.75 with 500K+ Downloads
      </div>

      {/* Title and Subtitle */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-snug">
        Travel <span className="text-primary">eSIM</span> in 170+ Countries
      </h1>
      <p className="text-base sm:text-lg text-black mb-6 max-w-2xl mx-auto">
        Stay connected anywhere. Instant eSIM activation with secure payments.
      </p>

      {/* Get Started Button */}
      <Button
        variant="default"
        size="lg"
        className="mb-8 px-5 py-2 bg-primary hover:bg-purple-700 rounded-3xl text-sm sm:text-base"
      >
        Get Started{" "}
        <span className="ml-2 rounded-full p-1 bg-white text-black">
          <IoIosArrowForward />
        </span>
      </Button>

      {/* Travel Selection Section */}
      <div className="bg-primary rounded-2xl max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 px-6 sm:px-8">
        {/* Left Section */}
        <div className="text-white w-full lg:w-1/2 text-start">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Where would you like to Travel?
          </h2>

          {/* Radio buttons */}
          <div className="flex flex-wrap items-center mb-4 gap-4 text-sm sm:text-base">
            <label className="flex items-center">
              <input
                type="radio"
                id="country"
                name="travelType"
                defaultChecked
                className="mr-2 accent-primary"
              />
              Country
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                id="region"
                name="travelType"
                className="mr-2 accent-primary"
              />
              Region
            </label>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <div className="flex items-center w-full p-2 bg-white rounded-3xl shadow-sm">
              <FaLocationDot className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search for United Kingdom"
                className="w-full border-none focus:outline-none text-black text-sm sm:text-base"
              />
            </div>
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
              <FaMagnifyingGlass />
            </span>
          </div>

          {/* Browse Plans */}
          <button className="w-full sm:w-auto px-5 py-2 bg-white rounded-3xl text-black flex items-center justify-center gap-2 hover:bg-gray-100 text-sm sm:text-base">
            Browse Plans
            <span className="ml-2 rounded-full p-1 bg-primary text-white">
              <IoIosArrowForward />
            </span>
          </button>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex justify-center relative mt-8 lg:mt-0">
          <Image
            src="/home-hero-banner.png"
            alt="Man using phone"
            width={300}
            height={400}
            className="rounded-lg object-cover max-h-[350px] sm:max-h-[400px]"
          />

          {/* Flag overlays */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="bg-white rounded-lg shadow p-2 absolute top-[6em] right-[4em] sm:top-[8em] sm:right-[6em] md:top-[10em] md:right-[7.5em]">
              <Image src="/usa-flag.png" alt="USA" width={60} height={25} />
              <span className="text-[10px] sm:text-xs leading-tight text-center block">
                United States <br /> of America
              </span>
            </div>

            <div className="bg-white rounded-lg shadow p-2 absolute bottom-[5em] left-[4em] sm:bottom-[6em] sm:left-[5em] md:bottom-[6em] md:left-[6.3em]">
              <Image
                src="/united-arab-emirates-flag.jpg"
                alt="UAE"
                width={60}
                height={25}
              />
              <span className="text-[10px] sm:text-xs leading-tight text-center block">
                United Arab <br /> Emirates
              </span>
            </div>

            <div className="bg-white rounded-lg shadow p-2 absolute bottom-[2em] right-[4em] sm:bottom-[2.5em] sm:right-[7em] md:right-[9em]">
              <Image src="/uk-flag.png" alt="UK" width={60} height={25} />
              <span className="text-[10px] sm:text-xs leading-tight text-center block">
                United <br /> Kingdom
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
