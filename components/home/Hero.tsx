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
            <FaStarHalfAlt />
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

        {/* Button */}
        <Button
          variant="default"
          size="lg"
          className="mb-10 px-5 py-2 bg-gradient hover:bg-primary rounded-3xl text-xs sm:text-sm md:text-base"
        >
          Get Started{" "}
          <span className="ml-2 rounded-full p-1 bg-white text-black">
            <IoIosArrowForward />
          </span>
        </Button>

        {/* Travel Section */}
        <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 px-5 sm:px-8 rounded-4xl">
          {/* SVG for same curve */}
          <div className="absolute w-full h-20 left-0 -bottom-6 bg-gradient-two blur-[150px]" />
          <div className="absolute inset-0 bg-[url(/dots.svg)] bg-center bg-cover bg-no-repeat z-30  rounded-4xl" />
          <svg className="absolute w-full h-full rounded-4xl">
            <defs>
              <clipPath id="hero-clip" clipPathUnits="objectBoundingBox">
                {/* Converted from your original path */}
                <path
                  d="
                    M0.06,0
                    Q0.05,0,0.04,0.02
                    L0.015,0.07
                    Q0,0.09,0,0.12
                    L0,1
                    L1,1
                    L1,0
                    Z
                  "
                />
              </clipPath>
            </defs>
          </svg>

          <div
            className="absolute inset-0 bg-gradient z-0 rounded-4xl"
            style={{ clipPath: "url(#hero-clip)" }}
          />

          {/* Left Side */}
          <div className="relative z-10 text-white w-full lg:w-1/2 text-start ml-0 sm:ml-[25px] py-[50px] ">
            <h2 className="text-base pt-[50px] md:pt-[40px] lg:pt-0 sm:pt-0 sm:text-lg md:text-3xl font-medium mb-4">
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

            {/* Search */}
            <div className="flex gap-3 sm:gap-4 mb-5 bg-[#B882DB] p-2 sm:p-3 rounded-[40px] w-full">
              <div className="flex items-center w-full p-2 px-3 sm:px-4 bg-white rounded-3xl shadow-sm">
                <FaLocationDot className="text-primary mr-2 sm:mr-3" />
                <input
                  type="text"
                  placeholder="Search for United Kingdom"
                  className="w-full border-none focus:outline-none text-black text-xs sm:text-sm md:text-base"
                />
              </div>
              <span className="flex items-center justify-center text-white bg-gradient rounded-full p-3 sm:p-4 cursor-pointer">
                <FaMagnifyingGlass className="text-sm sm:text-base md:text-lg" />
              </span>
            </div>

            <button className="w-full sm:w-auto px-5 font-semibold py-2 sm:py-3 bg-white rounded-3xl text-black flex items-center justify-center sm:justify-between gap-3 sm:gap-4 hover:bg-gray-100 text-xs sm:text-sm md:text-base">
              Browse Plans
              <span className="ml-1 sm:ml-2 rounded-full p-1 bg-primary text-white">
                <IoIosArrowForward fontSize={18} />
              </span>
            </button>
          </div>

          {/* Right Side */}
          <div className="relative z-10 w-full lg:w-1/2 flex justify-center hidden lg:flex">
            {/* Image Wrapper */}
            <div className="absolute -top-10 sm:-top-16 md:-top-[20em] lg:-top-[13.3em] xl:-top-[14.4em]">
              <Image
                src="/home-hero-banner.png"
                alt="Man using phone"
                width={350}
                height={400}
                className="object-cover max-h-[300px] sm:max-h-[350px] md:max-h-[400px] w-auto"
              />
              {/* United States */}
              <div className="absolute top-[11rem] right-[0rem] rounded-b-md bg-white shadow-md flex flex-col items-center w-[70px]">
                <Image
                  src="/flags/usa.svg"
                  alt="USA flag"
                  width={100}
                  height={35}
                />
                <span className="text-[11px] my-[2px] leading-[1.1] text-center">
                  United States
                  <br />
                  of America
                </span>
              </div>

              {/* United Arab Emirates */}
              <div className="absolute bottom-[7rem] -left-[0.8rem] bg-white rounded-b-md shadow-md flex flex-col items-center w-[70px]">
                <Image
                  src="/flags/uae.svg"
                  alt="UAE flag"
                  width={100}
                  height={35}
                />
                <span className="text-[11px] text-gray-700 font-medium my-[2px] leading-[1.1] text-center">
                  United Arab
                  <br />
                  Emirates
                </span>
              </div>

              {/* United Kingdom */}
              <div className="absolute bottom-[3.2rem] right-[2rem] bg-white rounded-b-md shadow-md flex flex-col items-center w-[70px]">
                <Image
                  src="/flags/uk.svg"
                  alt="UK flag"
                  width={100}
                  height={35}
                />
                <span className="text-[11px] text-gray-700 font-medium my-[2px] leading-[1.1] text-center">
                  United
                  <br />
                  Kingdom
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
