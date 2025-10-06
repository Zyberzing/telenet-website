"use client";

import Image from "next/image";
import { useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FaLocationDot, FaMagnifyingGlass } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { Button } from "../ui/Button";

export default function Hero() {
  const [travelType, setTravelType] = useState("country");

  return (
    <section className="w-full bg-[url(/grid.svg)] bg-center bg-cover bg-no-repeat">
      <div className="text-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        {/* Rating */}
        <div className="px-4 py-1 inline-flex items-center rounded-full text-xs sm:text-sm mb-4 border border-primary bg-white">
          <div className="flex items-center gap-0.5 text-yellow-400">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStarHalfAlt /> {/* half star for 4.75 */}
          </div>
          <span className="ml-2 text-black">
            Rated 4.75 with 500K+ Downloads
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 text-gray-900 leading-snug">
          Travel <span className="text-primary">eSIM</span> in 170+ Countries
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-black mb-6 max-w-2xl mx-auto">
          Stay connected anywhere. Instant eSIM activation with secure payments.
        </p>

        {/* Get Started Button */}
        <Button
          variant="default"
          size="lg"
          className="mb-10 px-5 py-2 bg-primary hover:bg-primary rounded-3xl text-xs sm:text-sm md:text-base"
        >
          Get Started{" "}
          <span className="ml-2 rounded-full p-1 bg-white text-black">
            <IoIosArrowForward />
          </span>
        </Button>

        {/* Travel Section */}
        <div
          className="relative bg-primary max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 px-5 sm:px-8 overflow-hidden"
          style={{
            clipPath: "polygon(60px 0, 100% 0, 100% 100%, 0 100%, 0 60px)",
            borderRadius: "1rem",
          }}
        >
          {/* Left Section */}
          <div className="relative z-10 text-white w-full lg:w-1/2 text-start ml-0 sm:ml-[25px]">
            <h2 className="text-base pt-[50px] md:pt-[40px] lg:pt-0 sm:pt-0 sm:text-lg md:text-xl font-semibold mb-4">
              Where would you like to Travel?
            </h2>

            {/* Radio buttons */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm md:text-base mb-5">
              {["country", "region"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer select-none"
                  onClick={() => setTravelType(type)}
                >
                  <span
                    className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition-all duration-200 ${
                      travelType === type
                        ? "bg-white text-primary border-white"
                        : "border-white"
                    }`}
                  >
                    {travelType === type && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex gap-3 sm:gap-4 mb-5 bg-[#B882DB] p-2 sm:p-3 rounded-[40px] w-full">
              <div className="flex items-center w-full p-2 px-3 sm:px-4 bg-white rounded-3xl shadow-sm">
                <FaLocationDot className="text-primary mr-2 sm:mr-3" />
                <input
                  type="text"
                  placeholder="Search for United Kingdom"
                  className="w-full border-none focus:outline-none text-black text-xs sm:text-sm md:text-base"
                />
              </div>
              <span className="flex items-center justify-center text-white bg-primary rounded-full p-3 sm:p-4 cursor-pointer">
                <FaMagnifyingGlass className="text-sm sm:text-base md:text-lg" />
              </span>
            </div>

            {/* Browse Plans */}
            <button className="w-full sm:w-auto px-5 font-semibold py-2 sm:py-3 bg-white rounded-3xl text-black flex items-center justify-center sm:justify-between gap-3 sm:gap-4 hover:bg-gray-100 text-xs sm:text-sm md:text-base">
              Browse Plans
              <span className="ml-1 sm:ml-2 rounded-full p-1 bg-primary text-white">
                <IoIosArrowForward fontSize={18} />
              </span>
            </button>
          </div>

          {/* Right Section */}
          <div className="relative z-10 w-full lg:w-1/2 flex justify-center">
            <Image
              src="/home-hero-banner.png"
              alt="Man using phone"
              width={350}
              height={400}
              className="rounded-lg object-cover max-h-[300px] sm:max-h-[350px] md:max-h-[400px] w-auto"
            />

            {/* Flag overlays */}
            <div className="absolute inset-0 pointer-events-none">
              {/* USA Flag */}
              <div className="bg-white rounded-lg shadow p-2 absolute top-[5em] right-[2.5em] sm:top-[6em] sm:right-[5em] md:top-[8em] md:right-[7em]">
                <Image src="/usa-flag.png" alt="USA" width={55} height={25} />
                <span className="text-[9px] sm:text-[10px] md:text-xs text-center block leading-tight">
                  United States <br /> of America
                </span>
              </div>

              {/* UAE Flag */}
              <div className="bg-white items-center rounded-lg shadow p-2 absolute bottom-[4em] left-[2.5em] sm:bottom-[5em] sm:left-[4em] md:bottom-[6em] md:left-[6em]">
                <Image
                  src="/united-arab-emirates-flag.jpg"
                  alt="UAE"
                  width={55}
                  height={25}
                />
                <span className="text-[9px] sm:text-[10px] md:text-xs text-center block leading-tight">
                  United Arab <br /> Emirates
                </span>
              </div>

              {/* UK Flag */}
              <div className="bg-white rounded-lg shadow p-2 absolute bottom-[2em] right-[3em] sm:bottom-[2.5em] sm:right-[5em] md:right-[7em]">
                <Image src="/uk-flag.png" alt="UK" width={55} height={25} />
                <span className="text-[9px] sm:text-[10px] md:text-xs text-center block leading-tight">
                  United <br /> Kingdom
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
