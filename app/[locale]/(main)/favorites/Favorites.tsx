"use client";

import { PlanDetailsModal } from "@/components/modals";
import { Button } from "@/components/ui/Button";
import { orderDetails, Plan } from "@/lib/types";
import { createCheckout } from "@/services/payment";
import { getProfile } from "@/services/auth";
import { upsertWishlist } from "@/services/wishlist";
import {
  ArrowDownUp,
  Calendar,
  MessageCircleMore,
  Phone,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { User } from "@/app/[locale]/(main)/profile-setting/ProfileSetting";

interface FavoritesProps {
  initialPlans: Plan[];
  isLoggedIn: boolean;
}

export default function Favorites({ initialPlans, isLoggedIn }: FavoritesProps) {
  const t = useTranslations("Favorites");
  const [favoritePlans, setFavoritePlans] = useState<Plan[]>(initialPlans);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setUserProfile(null);
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        setUserProfile(profile);
      } catch {
        setUserProfile(null);
      }
    };

    void loadProfile();
  }, [isLoggedIn]);

  const resolveCountryCode = (plan: Plan): string =>
    plan.countries?.[0]?.countryiso2 ||
    plan.countryIso2 ||
    plan.country_code ||
    plan.country ||
    "";

  const handleBuy = async (
    promotionId?: string,
    travelStartDate?: string,
    travelEndDate?: string,
  ): Promise<void> => {
    if (!selectedPlan || orderLoading) return Promise.resolve();

    const countryCode = resolveCountryCode(selectedPlan);
    if (!countryCode) {
      toast.error(t("countryDetectFailed"));
      return Promise.resolve();
    }

    const orderBody: orderDetails = {
      packageId: selectedPlan._id,
      country: countryCode,
      providerId: selectedPlan?.provider,
      customerDOB: userProfile?.customerDOB,
      customerPassportDOB: userProfile?.customerPassportDOB,
      travelStartDate,
      travelEndDate,
      ...(promotionId ? { couponId: promotionId } : {}),
    };

    try {
      setOrderLoading(true);
      const res = await createCheckout(orderBody);
      toast.success(res.message || t("orderCreated"));
      setSelectedPlan(null);

      if (res?.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error(t("checkoutUrlMissing"));
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("orderCreateFailed"));
      }
    } finally {
      setOrderLoading(false);
    }

    return Promise.resolve();
  };

  const handleRemove = async (plan: Plan) => {
    try {
      const response = await upsertWishlist({
        planId: plan._id,
        action: "REMOVE",
      });

      setFavoritePlans((prev) =>
        prev.filter((item) => item.package_id !== plan.package_id),
      );
      if (selectedPlan?.package_id === plan.package_id) {
        setSelectedPlan(null);
      }
      toast.success(response?.message || t("removedSuccess"));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("removeFailed"));
      }
    }
  };

  return (
    <section className="w-full min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* <div className="relative w-full h-[22.6vh]">
        <Image
          src="/banner-plans.svg"
          alt={t("bannerAlt")}
          fill
          className="object-contain"
          priority
        />
      </div> */}

      <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
        <h1 className="text-start text-2xl md:text-3xl font-[400px] mb-6">
          {t("title")}
        </h1>

        {favoritePlans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritePlans.map((plan) => (
              <div key={plan.package_id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="max-w-40 truncate block text-[14px] capitalize font-medium text-white rounded-[7px] px-2 bg-primary cursor-default">
                    {plan.network}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(plan)}
                    className="text-red-600 dark:text-red-400 hover:opacity-80 cursor-pointer"
                    aria-label={t("remove")}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div
                  className="rounded-2xl p-5 shadow-sm border border-gray-100 bg-[#F1F8FE] hover:bg-[#FFF2E0] transition-all duration-300 flex flex-col justify-between cursor-pointer group dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                  onClick={() => setSelectedPlan(plan)}
                >
                  <div className="flex justify-between">
                    <h3 className="text-2xl font-[400px] mb-6">
                      ${plan.finalPrice.toFixed(2)}
                    </h3>
                    <span className="text-[14px] font-extrabold text-[#A70123] rounded-[7px] px-2">
                      {plan.coverage}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <div className="gap-4">
                      <p className="flex gap-2 items-center">
                        <ArrowDownUp size={15} /> {plan.data}
                      </p>
                      <p className="flex gap-2 items-center">
                        <Phone size={15} /> {plan.call}
                      </p>
                    </div>
                    <div className="gap-4">
                      <p className="flex gap-2 items-center">
                        <Calendar size={15} />
                        {plan.validity} {t("days")}
                      </p>
                      <p className="flex gap-2 items-center">
                        <MessageCircleMore size={15} /> {plan.sms}
                      </p>
                    </div>
                  </div>

                  <Button className="text-white mt-6 text-sm rounded-full w-full transition-all duration-300 group-hover:[background:#E49B2C] group-hover:text-black dark:group-hover:text-white hover:[background:#E49B2C_!important] hover:text-black dark:hover:text-white bg-gradient">
                    {t("buy")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-base text-gray-600 dark:text-gray-300">
            {t("empty")}
          </p>
        )}
      </div>

      <PlanDetailsModal
        selectedPlan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onBuy={handleBuy}
        orderLoading={orderLoading}
        isLoggedIn={isLoggedIn}
        onFavoriteChange={(favorited, plan) => {
          if (!favorited) {
            setFavoritePlans((prev) =>
              prev.filter((item) => item.package_id !== plan.package_id),
            );
            setSelectedPlan(null);
          }
        }}
      />
    </section>
  );
}
