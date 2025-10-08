import {
  Badge,
  Calculator,
  ChevronRight,
  Clock,
  Globe,
  Grid,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { FaApple, FaGooglePlay } from "react-icons/fa";

export default function Features() {
  return (
    <div className="w-full">
      {/* 🏆 Press & Awards */}
      <section className="py-12 text-center px-4">
        <h2 className="text-2xl md:text-3xl  mb-8">Press, Media & Awards</h2>

        <div className="flex flex-col md:flex-row items-center justify-center ">
          {[
            {
              img: "/award-logo.png",
              text: "Best Travel Tech Product in IITM Chennai, Hyderabad & Bengaluru",
            },
            {
              img: "/award-logo-2.png",
              text: "Most Innovative Product of the Year at BLTM, Delhi",
            },
            {
              img: "/award-logo-3.png",
              text: "Top 5 Best eSIM Provider at MVNO World 2025, Vienna, Austria",
            },
          ].map((award, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-center w-full gap-1 text-center sm:text-left"
            >
              <Image
                src={award.img}
                alt={`Award ${i + 1}`}
                width={100}
                height={60}
                className="mx-auto sm:mx-0"
              />
              <p className="text-[13.13px]">{award.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 📱 Download Banner */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="relative overflow-hidden bg-gradient text-white rounded-2xl pt-3 flex flex-col lg:flex-row items-center justify-between gap-2">
          <div className="absolute inset-0 bg-[url(/line-press-award.svg)] bg-center  bg-no-repeat  rounded-4xl" />
          <div className="flex flex-1 justify-center flex-row items-center gap-6">
            <div className="relative">
              <Image
                src="/man-talking-mobile.svg"
                alt=""
                width={60}
                height={60}
                className="absolute inset-0 bg-center bg-cover bg-no-repeat -top-[3em] left-[1.3em] z-30"
              />
              <Image
                src="/voice.svg"
                alt="App Promo 1"
                width={100}
                height={100}
                className="-mt-[30px]"
              />
            </div>
            <Image
              src="/girl-with-phone.png"
              alt="App Promo 2"
              width={120}
              height={80}
            />
            <div className="relative">
              <Image
                src="/girl-talking-mobile.svg"
                alt=""
                width={60}
                height={60}
                className="absolute inset-0 bg-center bg-cover bg-no-repeat -top-[1.2em] left-[1.3em] z-30"
              />
              <Image
                src="/voice.svg"
                alt="App Promo 3"
                width={100}
                height={100}
                className=""
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 px-6">
            <h1 className="text-2xl md:text-3xl mb-3 leading-snug">
              Download Telenet <br />
              25% OFF
            </h1>
            <div className="flex justify-center lg:justify-start gap-4 mt-6 h-[2.8em]">
              <div className="flex gap-3 items-center border border-white rounded-md px-2 bg-transparent">
                <FaGooglePlay className="text-white text-3xl" />
                <div className="text-start leading-none">
                  <p className="text-[10px] m-0 p-0">GET IT ON</p>
                  <p className="text-sm font-semibold m-0 p-0">Google Play</p>
                </div>
              </div>

              <div className="flex flex-row px-2 gap-3 items-center border border-white rounded-md bg-transparent">
                <FaApple className="text-white text-4xl" />
                <div className="text-start leading-none">
                  <p className="text-[10px] m-0 p-0">Download on the</p>
                  <p className="text-sm font-semibold m-0 p-0">App Store</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌍 Popular Countries */}
      <section className="py-16 text-center bg-[url(/alldots.svg)] bg-no-repeat bg-center bg-cover px-6 ">
        <h2 className="text-2xl md:text-3xl font-bold mb-10">
          Popular Countries
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { flag: "/usa-flag.png", name: "United States of America" },
            { flag: "/uk-flag.png", name: "United Kingdom" },
            {
              flag: "/united-arab-emirates-flag.jpg",
              name: "United Arab Emirates",
            },
            { flag: "/canada-flag.jpg", name: "Canada" },
          ].map((c, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <Image
                src={c.flag}
                alt={c.name}
                width={80}
                height={80}
                className="mx-auto mb-4 rounded"
              />
              <h3 className="font-semibold text-sm md:text-base">{c.name}</h3>
              <p className="text-sm text-[#8606D0] mt-2">
                Starts @ $0.7 Onwards
              </p>
            </div>
          ))}
        </div>

        <Button className="mt-10 px-8 py-2 bg-gradient rounded-full flex items-center gap-2 mx-auto">
          View All
          <ChevronRight className="w-4 h-4 bg-white text-black rounded-full" />
        </Button>
      </section>

      {/* 💜 Why Choose Us */}
      <section className="bg-[#0d1b2a] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Clock className="w-8 h-8 mb-3 text-[#8606D0]" />,
                title: "Instant Activation",
                desc: "Activate your eSIM instantly by scanning a QR code. Enjoy seamless connectivity without a physical SIM card.",
              },
              {
                icon: <Globe className="w-8 h-8 mb-3 text-[#8606D0]" />,
                title: "Global Coverage",
                desc: "Stay connected with a single device across borders, no matter where your travels take you.",
              },
              {
                icon: <ShieldCheck className="w-8 h-8 mb-3 text-[#8606D0]" />,
                title: "Secure Payments",
                desc: "Enjoy a hassle-free and protected setup, eliminating the need to handle physical cards.",
              },
              {
                icon: <Headphones className="w-8 h-8 mb-3 text-[#8606D0]" />,
                title: "24/7 Support",
                desc: "Our support team is available 24/7 to guide you through setup and ensure smooth service.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/10 p-6 rounded-2xl hover:bg-white/20 transition flex flex-col items-start text-left"
              >
                {item.icon}
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm mt-2 text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⚙️ How It Works */}
      <section className="py-16 text-center px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-10">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-12">
          {[
            {
              icon: <Calculator width={60} height={60} />,
              title: "Browse a Plan",
              desc: "Pick the data plan you need for your trip.",
            },
            {
              icon: <Badge width={60} height={60} />,
              title: "Buy a Plan",
              desc: "Your plan activates automatically when you land.",
            },
            {
              icon: <Grid width={60} height={60} />,
              title: "Start Browsing",
              desc: "Receive a QR code, scan it, and your eSIM is installed.",
            },
          ].map((step, i) => (
            <div key={i} className="max-w-xs">
              <div className="text-[#8606D0] flex justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="font-semibold text-base md:text-lg">
                {step.title}
              </h3>
              <p className="text-gray-600 mt-2 text-sm md:text-base px-2">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ▶️ Video Tutorial */}
      <section className="py-16 text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Watch Video Tutorial
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
            <Image
              src="/watch-video-tutorial.png"
              alt="Play Video"
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
}
