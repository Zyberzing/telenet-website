"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";

const testimonials = [
  {
    name: "Musa Delimuza",
    location: "Milan, Italy",
    image: "review-user-icon.png",
    text: "Quick solutions coupled with extraordinary performance—a recommendation that’s unequivocal.",
  },
  {
    name: "MD Rashed Kabir",
    location: "California, USA",
    image: "review-user-icon-2.png",
    text: "Highly recommend this reliable SaaS provider for seamless workflow optimization.",
  },
  {
    name: "Jane Doe",
    location: "London, UK",
    image: "review-user-icon.png",
    text: "Great service and amazing customer support throughout my trip!",
  },
  {
    name: "Alex Johnson",
    location: "Sydney, Australia",
    image: "review-user-icon-2.png",
    text: "Reliable connection across countries. Totally worth it!",
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const startX = useRef(0);
  const diffX = useRef(0);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const itemsPerSlide = isMobile ? 1 : 2;
  const slides = Math.ceil(testimonials.length / itemsPerSlide);

  const handleSwipe = (distance: number) => {
    if (Math.abs(distance) > 80) {
      if (distance < 0) {
        setCurrent((prev) => (prev + 1) % slides);
      } else {
        setCurrent((prev) => (prev - 1 + slides) % slides);
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    diffX.current = e.changedTouches[0].clientX - startX.current;
    handleSwipe(diffX.current);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    diffX.current = e.clientX - startX.current;
    handleSwipe(diffX.current);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl sm:text-3xl font-[400px] mb-8 text-center leading-snug">
        Our Travellers say it all - they’ve picked the best network!
      </h1>

      {/* ✅ Carousel */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="w-full max-w-6xl overflow-hidden cursor-grab py-3 active:cursor-grabbing"
      >
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${current * (100 / slides)}%)`,
            width: `${slides * 100}%`,
          }}
        >
          {Array.from({ length: slides }).map((_, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 sm:grid-cols-2 gap-1 flex-shrink-0 px-14`}
              style={{
                width: `${100 / slides}%`,
              }}
            >
              {testimonials
                .slice(
                  index * itemsPerSlide,
                  index * itemsPerSlide + itemsPerSlide
                )
                .map((t, i) => (
                  <div
                    key={i}
                    className="bg-white p-10 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-[100px] h-[100px] rounded-full mr-4"
                      />
                    </div>
                    <p className="text-[25px] mb-8">“{t.text}”</p>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-900 font-semibold">{t.name}</p>
                        <p className="text-gray-600 text-xs">{t.location}</p>
                      </div>
                      <div className="flex justify-end">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <span key={i} className="text-yellow-400 text-lg">
                              ★
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Dots */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: slides }).map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 w-2 sm:h-3 sm:w-3 mx-1 rounded-full cursor-pointer transition-all ${
              i === current
                ? "bg-gray-800 scale-110"
                : "bg-white border border-black"
            }`}
          ></span>
        ))}
      </div>

      {/* ✅ Bottom Section */}
      <div className="mt-12 text-center max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-[400px] text-gray-900 mb-4">
          Enjoy Unlimited Browsing
        </h2>
        <p className="mb-4 text-[20px]">
          Stay connected on WhatsApp, Instagram & YouTube without roaming
          charges.
        </p>
        <div className="flex flex-wrap justify-center mt-6 gap-3 sm:gap-4">
          <Image
            src="/social-media/Instagram.svg"
            alt="Instagram Logo"
            width={100}
            height={100}
          />
          <Image
            src="/social-media/Whatsapp.svg"
            alt="whatsapp Logo"
            width={100}
            height={100}
          />
          <Image
            src="/social-media/Youtube.svg"
            alt="youtube Logo"
            width={100}
            height={100}
          />
          <Image
            src="/social-media/Spotify.svg"
            alt="spotify Logo"
            width={100}
            height={100}
          />
          <Image
            src="/social-media/Facebook.svg"
            alt="facebook Logo"
            width={100}
            height={100}
          />
          <Image
            src="/social-media/Facetime.svg"
            alt="facetime Logo"
            width={100}
            height={100}
          />
        </div>
        <p className="gap-3 mt-8 flex items-center justify-center text-sm sm:text-base">
          <Image
            src="/social-media/VPN.svg"
            alt="VPN Logo"
            width={32}
            height={32}
            className="h-8 w-auto"
          />{" "}
          No VPN Required
        </p>
      </div>
    </div>
  );
};

export default Testimonials;
