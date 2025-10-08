import Image from "next/image";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { Button } from "../ui/Button";

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
      <section className="max-w-6xl mx-auto px-6 pt-12">
        <div className="relative overflow-hidden bg-gradient text-white rounded-2xl pt-3 flex flex-col-reverse lg:flex-row items-center justify-between gap-6">
          {/* background pattern */}
          <div className="absolute inset-0 bg-[url(/line-press-award.svg)] bg-center bg-no-repeat rounded-4xl" />

          {/* Visual Section */}
          <div className="flex flex-1 justify-center flex-row items-center gap-4 sm:gap-6 flex-wrap sm:flex-nowrap px-4">
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
                width={90}
                height={90}
                className="-mt-[30px] sm:w-[100px]"
              />
            </div>
            <Image
              src="/girl-with-phone.png"
              alt="App Promo 2"
              width={100}
              height={80}
              className="sm:w-[120px]"
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
                width={90}
                height={90}
                className=""
              />
            </div>
          </div>

          {/* Text + Buttons */}
          <div className="flex flex-row gap-4 px-6 text-center sm:text-left mt-6 lg:mt-0">
            <h1 className="text-2xl md:text-3xl mb-3 leading-snug">
              Download Telenet <br />
              25% OFF
            </h1>

            <div className="flex justify-center sm:justify-start flex-wrap gap-4 my-4 sm:my-6 h-auto">
              <div className="flex gap-3 items-center border border-white rounded-md px-3 py-2 bg-transparent">
                <FaGooglePlay className="text-white text-2xl sm:text-3xl" />
                <div className="text-start leading-none">
                  <p className="text-[10px] sm:text-xs m-0 p-0">GET IT ON</p>
                  <p className="text-sm sm:text-base font-semibold m-0 p-0">
                    Google Play
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-center border border-white rounded-md px-3 py-2 bg-transparent">
                <FaApple className="text-white text-3xl sm:text-4xl" />
                <div className="text-start leading-none">
                  <p className="text-[10px] sm:text-xs m-0 p-0">
                    Download on the
                  </p>
                  <p className="text-sm sm:text-base font-semibold m-0 p-0">
                    App Store
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Countries */}
      <section className="pb-8 my-4 text-center bg-[url(/alldots.svg)] bg-no-repeat bg-center bg-cover px-6 ">
        <h2 className="text-2xl pt-12 md:text-3xl font-[400px] mb-10">
          Popular Countries
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-10">
          {[
            { flag: "/flags/usa2.svg", name: "United States of America" },
            { flag: "/flags/uk2.svg", name: "United Kingdom" },
            {
              flag: "/flags/uae2.svg",
              name: "United Arab Emirates",
            },
            { flag: "/flags/canada.svg", name: "Canada" },
          ].map((c, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition justify-items-center"
            >
              <Image
                src={c.flag}
                alt={c.name}
                width={135}
                height={100}
                className="rounded mb-3"
              />
              <h3 className="font-[400px] text-[19.75px] md:text-base">
                {c.name}
              </h3>
              <p className="text-[17.34px] text-[#8606D0] mt-2">
                Starts @ $0.7 Onwards
              </p>
            </div>
          ))}
        </div>

        <Button
          variant="default"
          size="lg"
          className="mt-10 gap-8 px-5 bg-gradient hover:bg-primary rounded-3xl text-xs sm:text-sm md:text-base"
        >
          View All{" "}
          <span className="ml-2 rounded-full p-1 bg-white text-black">
            <IoIosArrowForward />
          </span>
        </Button>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#0D1C2B] text-white py-16 px-6 sm:px-10 md:px-16 lg:px-32">
        <div>
          <h2 className="text-2xl md:text-3xl font-[400] mb-10 text-center">
            Why Choose Us
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-3xl bg-[#0F2031] overflow-hidden">
            {[
              {
                img: "/instant-activation.svg",
                title: "Instant Activation",
                desc: "Activate your eSIM instantly by scanning a QR code. Enjoy seamless connectivity without the need for a physical SIM card.",
              },
              {
                img: "/global-coverage.svg",
                title: "Global Coverage",
                desc: "Stay connected with a single device across borders, no matter where your travels take you.",
              },
              {
                img: "/secure-payments.svg",
                title: "Secure Payments",
                desc: "Enjoy a hassle-free and protected setup, eliminating the need to handle a physical card.",
              },
              {
                img: "/support.svg",
                title: "24/7 Support",
                desc: "Our dedicated 24/7 support team is always available to help. We'll guide you through the process, ensuring a smooth and successful setup.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 hover:bg-[#102336] hover:rounded-3xl transition flex flex-col items-start text-left border-b border-[#13283d] sm:border-b-0 sm:border-r last:border-r-0 sm:last:border-r-0"
              >
                <Image
                  src={item.img}
                  alt={`Why choose us ${i + 1}`}
                  width={56}
                  height={56}
                  className="mb-8"
                />
                <h3 className="font-[400] text-[24px] md:text-2xl mb-10">
                  {item.title}
                </h3>
                <p className="text-[14px] leading-relaxed opacity-90">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        className="relative py-16 text-center px-6 md:px-[8em] overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #F4F9FE 0%, white 100%)",
        }}
      >
        {/* Decorative Background Curves */}
        <div className="absolute left-1 -top-28 w-[200px] md:w-[400px]">
          <Image
            src="/how-work-bg-curve-left.svg"
            alt="left decorative curve"
            width={400}
            height={400}
            className="opacity-80 rotate-12"
          />
        </div>
        <div className="absolute right-0 bottom-0 md:bottom-[10%] w-[200px] md:w-[300px]">
          <Image
            src="/how-work-bg-curve-right.svg"
            alt="right decorative curve"
            width={300}
            height={300}
            className="opacity-80"
          />
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-[400px] mb-10 relative z-10">
          How It Works
        </h2>

        {/* Steps */}
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-0 px-8 relative z-10">
          {/* Step 1 */}
          <div className="max-w-xs flex flex-col items-center relative">
            <div className="p-4 rounded-3xl bg-white shadow transition z-10">
              <Image
                src="/browse-plan.svg"
                alt="Browse a Plan"
                width={56}
                height={56}
              />
            </div>
            <h3 className="text-base md:text-lg mt-6">Browse a Plan</h3>
            <p className="mt-2 text-sm md:text-base px-2">
              Pick the data plan you need for your trip.
            </p>

            {/* Arrow 1 */}
            <div className="hidden md:block absolute top-8 right-[-100px] z-0">
              <Image src="/arrow1.svg" alt="arrow" width={120} height={50} />
            </div>
          </div>

          {/* Step 2 */}
          <div className="max-w-xs flex flex-col items-center relative md:ml-[100px]">
            <div className="p-4 rounded-3xl bg-white shadow transition z-10">
              <Image
                src="/buy-plan.svg"
                alt="Buy a Plan"
                width={56}
                height={56}
              />
            </div>
            <h3 className="text-base md:text-lg mt-6">Buy a Plan</h3>
            <p className="mt-2 text-sm md:text-base px-2">
              Your plan activates automatically when you land, no SIM swapping
              needed.
            </p>

            {/* Arrow 2 */}
            <div className="hidden md:block absolute top-8 right-[-100px] z-0">
              <Image src="/arrow2.svg" alt="arrow" width={120} height={50} />
            </div>
          </div>

          {/* Step 3 */}
          <div className="max-w-xs flex flex-col items-center relative md:ml-[100px]">
            <div className="p-4 rounded-3xl bg-white shadow transition z-10">
              <Image
                src="/start-browse.svg"
                alt="Start Browsing"
                width={56}
                height={56}
              />
            </div>
            <h3 className="text-base md:text-lg mt-6">Start Browsing</h3>
            <p className="mt-2 text-sm md:text-base px-2">
              Receive a QR code, scan it, and your eSIM is instantly installed.
            </p>
          </div>
        </div>
      </section>

      {/*  Video Tutorial */}
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
