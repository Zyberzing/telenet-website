"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { FaApple, FaRegFilePdf } from "react-icons/fa";
import { IoLogoAndroid } from "react-icons/io";

export default function InstallationGuide() {
  const t = useTranslations("InstallationGuide");
  const [iosStep, setIosStep] = useState(1);
  const [androidStep, setAndroidStep] = useState(1);

  const StepProgress = ({
    activeStep,
    setActiveStep,
  }: {
    activeStep: number;
    setActiveStep: (s: number) => void;
  }) => (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6">
      {["1", "2", "3"].map((num, i) => {
        const stepNumber = i + 1;
        const isActive = activeStep === stepNumber;
        return (
          <button
            key={num}
            onClick={() => setActiveStep(stepNumber)}
            className={`px-6 sm:px-10 py-2 rounded-t-[20px] text-[16px] sm:text-[18px] font-[400px] min-w-[100px] sm:min-w-[150px] text-center transition-all duration-200 ${
              isActive
                ? "bg-[#3F5DDC] text-white shadow-md"
                : "bg-[#D0CEC6] text-[#7B7765] hover:bg-[#cfcfc7]"
            }`}
          >
            Step:{num}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <div className="relative w-full h-[6vh] sm:h-[25vh] md:h-[23vh]">
        <Image
          src="/banner-installation-guide.svg"
          alt=""
          fill
          className="object-contain"
          priority
        />
      </div>

      <section className="text-center py-8 sm:py-12 px-4 sm:px-6 md:px-10">
        <div className="mt-6 mx-auto w-full max-w-[90rem] px-2 sm:px-4 md:px-10">
          <Tabs defaultValue="ios" className="w-full">
            {/* =================== TAB HEADER =================== */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
              <TabsList className="bg-white flex gap-4 sm:gap-6 rounded p-1 flex-wrap justify-center">
                <TabsTrigger
                  value="ios"
                  className="w-[7em] sm:w-[8em] text-[16px] sm:text-[18px] flex items-center justify-center gap-2 px-3 sm:px-4 py-3 sm:py-4 rounded-md border-primary data-[state=active]:bg-primary data-[state=active]:text-white transition"
                >
                  <FaApple /> iOS
                </TabsTrigger>
                <TabsTrigger
                  value="android"
                  className="w-[7em] sm:w-[8em] text-[16px] sm:text-[18px] flex items-center justify-center gap-2 px-3 sm:px-4 py-3 sm:py-4 rounded-md border-primary data-[state=active]:bg-primary data-[state=active]:text-white transition"
                >
                  <IoLogoAndroid /> Android
                </TabsTrigger>
              </TabsList>

              <div className="text-center">
                <a
                  href="/installation-guide.pdf"
                  className="inline-flex items-center text-red-500 font-medium gap-2 hover:underline text-[14px] sm:text-[16px]"
                >
                  <FaRegFilePdf className="h-4 w-4 sm:h-5 sm:w-5" />
                  {t("downloadPDF")}
                </a>
              </div>
            </div>

            {/* =================== iOS TAB =================== */}
            <TabsContent value="ios" className="mt-10 space-y-10">
              <div className="text-black max-w-2xl text-start px-2 sm:px-4 md:px-0">
                <h2 className="font-[400px] text-[22px] sm:text-[26px] md:text-[30px] mb-3">
                  {t("stepsTitle")}
                </h2>
                <ul className="space-y-3 list-disc ml-6 mt-10">
                  <li className="text-[20px]">{t("ios.steps.0")}</li>
                  <li className="text-[20px]">{t("ios.steps.1")}</li>
                </ul>
              </div>

              {/* Step Progress */}
              <StepProgress activeStep={iosStep} setActiveStep={setIosStep} />

              {/* Step Content */}
              <div className="mt-8 text-center">
                {iosStep === 1 && (
                  <>
                    <p className="my-6 text-base sm:text-lg text-gray-600 px-4 sm:px-10 justify-self-center w-[20em]">
                      {t("step_suggestion")}
                    </p>
                    <Image
                      src="/ios-guide-step.svg"
                      alt="iOS Step 1"
                      width={200}
                      height={100}
                      className="mx-auto rounded-[3em] shadow-md w-[80%] sm:w-[50%] md:w-[30%]"
                    />
                  </>
                )}
                {iosStep === 2 && (
                  <p className="text-base sm:text-lg text-gray-600 px-4 sm:px-10 justify-self-center w-[20em]">
                    {t("step_suggestion")}
                  </p>
                )}
                {iosStep === 3 && (
                  <p className="text-base sm:text-lg text-gray-600 px-4 sm:px-10 justify-self-center w-[20em]">
                    {t("step_suggestion")}
                  </p>
                )}
              </div>
            </TabsContent>

            {/* =================== ANDROID TAB =================== */}
            <TabsContent value="android" className="mt-10 space-y-10">
              <div className="text-gray-700 max-w-2xl text-start px-2 sm:px-4 md:px-0">
                <h3 className="font-[400px] text-[22px] sm:text-[26px] md:text-[30px] mb-3">
                  {t("stepsTitle")}
                </h3>
                <ul className="space-y-3 list-disc ml-6 mt-10">
                  <li className="text-[20px]">{t("ios.steps.0")}</li>
                  <li className="text-[20px]">{t("ios.steps.1")}</li>
                </ul>
              </div>

              {/* Step Progress */}
              <StepProgress
                activeStep={androidStep}
                setActiveStep={setAndroidStep}
              />

              {/* Step Content */}
              <div className="mt-8 text-center">
                {androidStep === 1 && (
                  <>
                    <p className="my-6 text-base sm:text-lg text-gray-600 px-4 sm:px-10 justify-self-center w-[20em]">
                      {t("step_suggestion")}
                    </p>
                    <Image
                      src="/android-guide-step.svg"
                      alt="Android Step 1"
                      width={200}
                      height={100}
                      className="mx-auto shadow-md w-[80%] sm:w-[50%] md:w-[30%]"
                    />
                  </>
                )}
                {androidStep === 2 && (
                  <p className="text-base sm:text-lg text-gray-600 px-4 sm:px-10 justify-self-center w-[20em]">
                    {t("step_suggestion")}
                  </p>
                )}
                {androidStep === 3 && (
                  <p className="text-base sm:text-lg text-gray-600 px-4 sm:px-10 justify-self-center w-[20em]">
                    {t("step_suggestion")}
                  </p>
                )}
              </div>
            </TabsContent>

            {/* =================== VIDEO =================== */}
            <div className="flex justify-center mt-8">
              <Image
                src="/watch-video-tutorial.svg"
                alt="Video Preview"
                width={1000}
                height={1000}
                className="w-[90%] sm:w-[80%] md:w-[50em] h-auto md:h-[30em]"
              />
            </div>

            {/* =================== TROUBLESHOOTING =================== */}
            <div className="px-4 sm:px-10 md:px-20 w-full text-start my-8">
              <h3 className="font-[400px] text-[24px] sm:text-[28px] md:text-[32px] mb-4 text-center">
                {t("troubleshooting.title")}
              </h3>

              <div className="space-y-4 text-sm sm:text-base">
                <div className="p-4 rounded-md px-4 sm:px-6 border-l-4 border-l-primary shadow-sm">
                  <p className="font-medium mb-2 text-[15px] sm:text-[16px]">
                    {t("troubleshooting.qr.title")}
                  </p>
                  <p className="text-[#6B7280]">
                    {t("troubleshooting.qr.desc")}
                  </p>
                </div>

                <div className="p-4 rounded-md px-4 sm:px-6 border-l-4 border-l-primary shadow-sm">
                  <p className="font-medium mb-2 text-[15px] sm:text-[16px]">
                    {t("troubleshooting.activation.title")}
                  </p>
                  <p className="text-[#6B7280]">
                    {t("troubleshooting.activation.desc")}
                  </p>
                </div>

                <div className="p-4 rounded-md px-4 sm:px-6 border-l-4 border-l-primary shadow-sm">
                  <p className="font-medium mb-2 text-[15px] sm:text-[16px]">
                    {t("troubleshooting.support.title")}
                  </p>
                  <p className="text-[#6B7280]">
                    {t("troubleshooting.support.desc")}{" "}
                    <a
                      href="mailto:support@example.com"
                      className="text-primary break-all"
                    >
                      support@example.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
