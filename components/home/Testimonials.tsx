"use client";
import React, { useRef, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaSpotify,
  FaVideo,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center leading-snug">
        Our Travellers say it all — they’ve picked the best network!
      </h1>

      {/* ✅ Carousel */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="w-full max-w-6xl overflow-hidden cursor-grab active:cursor-grabbing"
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
              className={`grid grid-cols-1 sm:grid-cols-2 gap-6 w-full flex-shrink-0 px-4`}
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
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <p className="text-gray-900 font-semibold">{t.name}</p>
                        <p className="text-gray-600 text-xs">{t.location}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 italic">“{t.text}”</p>
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
              i === current ? "bg-gray-800 scale-110" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>

      {/* ✅ Bottom Section */}
      <div className="mt-12 text-center max-w-3xl">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Enjoy Unlimited Browsing
        </h2>
        <p className="mb-4 text-gray-700 text-sm sm:text-base">
          Stay connected on WhatsApp, Instagram & YouTube without roaming
          charges.
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <FaInstagram className="w-14 h-14 sm:w-16 sm:h-16 text-pink-500 p-2 border rounded-xl" />
          <FaWhatsapp className="w-14 h-14 sm:w-16 sm:h-16 text-green-500 p-2 border rounded-xl" />
          <FaYoutube className="w-14 h-14 sm:w-16 sm:h-16 text-red-500 p-2 border rounded-xl" />
          <FaSpotify className="w-14 h-14 sm:w-16 sm:h-16 text-green-600 p-2 border rounded-xl" />
          <FaFacebook className="w-14 h-14 sm:w-16 sm:h-16 text-blue-600 p-2 border rounded-xl" />
          <FaVideo className="w-14 h-14 sm:w-16 sm:h-16 text-blue-500 p-2 border rounded-xl" />
        </div>
        <p className="text-gray-600 mt-4 flex items-center justify-center text-sm sm:text-base">
          <span className="text-green-600 mr-2">🌐</span> No VPN Required
        </p>
      </div>
    </div>
  );
};

export default Testimonials;
