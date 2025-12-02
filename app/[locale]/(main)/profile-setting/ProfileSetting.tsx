"use client";

import { DeleteAccountModal, EditProfileModal } from "@/components/modals";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  changePassword,
  updateProfile,
  updateProfilePicture,
} from "@/services/auth";
import { uploadMedia } from "@/services/upload";
import { Eye, EyeOff, UserRoundX } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { toast } from "sonner";

export type User = {
  id: string;
  name: string;
  email: string;
  country: string;
  countryCode: string;
  lang: string;
  currency: string;
  address?: string;
  phone?: string;
  profilePicture?: string;
  location?: string;
  emailAlertEnabled: boolean;
  smsAlertEnabled: boolean;
  pushNotificationEnabled: boolean;
};

export type ChangePassword = {
  oldPassword?: string;
  newPassword: string;
  confirmPassword?: string;
};

export default function ProfileSetting({ user }: { user: User }) {
  const t = useTranslations("profile");

  // MAIN USER STATE (Auto updates UI)
  const [userData, setUserData] = useState(user);
  console.log("userdar", userData);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Notification settings — bind to ProfileSetting page
  const [emailAlertEnabled, setEmailAlertEnabled] = useState(
    user.emailAlertEnabled
  );
  const [smsAlertEnabled, setSmsAlertEnabled] = useState(user.smsAlertEnabled);
  const [pushNotificationEnabled, setPushNotificationEnabled] = useState(
    user.pushNotificationEnabled
  );

  // Handle password change
  const handlePasswordChange = async () => {
    if (!newPassword.trim()) {
      toast.error("Please enter a new password");
      return;
    }

    try {
      const res = await changePassword({ newPassword });
      toast.success(res?.message || "Password changed successfully!");
      setNewPassword("");
    } catch (err) {
      const errorMessage =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to change password";
      toast.error(errorMessage);
    }
  };

  const handleEditModal = (open: boolean, updatedUser?: User) => {
    setEditOpen(open);

    if (!open && updatedUser) {
      setUserData(updatedUser);
    }
  };

  const updateNotification = async (key: string, value: boolean) => {
    try {
      setUserData((prev) => ({ ...prev, [key]: value }));

      const updated = {
        ...userData,
        [key]: value,
      };

      await updateProfile(updated);

      toast.success("Notification preferences updated");
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } } | null)?.data?.message ??
        "Failed to change password";

      toast.error(errorMessage);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fd = new FormData();
      fd.append("file", file);
      const uploaded = await uploadMedia(fd);
      const fileUrl = uploaded?.data?.httpsUrl;

      if (!fileUrl) {
        toast.error("Failed to upload image");
        return;
      }
      await updateProfilePicture(fileUrl);

      toast.success("Profile picture uploaded successfully.");

      setUserData((prev) => ({ ...prev, avatar: fileUrl }));
    } catch {
      toast.error("Failed to update picture");
    }
  };

  return (
    <section className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="relative">
        <Image
          src="/banner-profile-setting.svg"
          alt={t("headerAlt")}
          width={1500}
          height={1000}
        />
      </div>

      {/* Profile Card */}
      <section className="flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-3xl border border-[#CDE9FE] dark:border-gray-700 rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white dark:bg-gray-800">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <Image
              src={userData?.profilePicture || "/profile-user-avatar.svg"}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full object-cover"
              unoptimized
            />

            <label className="cursor-pointer text-primary text-sm hover:underline text-center w-full">
              Change Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>

          <div className="text-center sm:text-left">
            <p className="text-[24px] text-gray-900 dark:text-gray-100">
              {userData?.name}
            </p>
            <p className="text-primary text-sm">{userData?.email}</p>
            <p className="text-sm">
              {userData?.countryCode} {userData?.phone}
            </p>
            <p className="text-[#666666] dark:text-gray-400 text-sm mt-1">
              {userData?.location}
            </p>
          </div>

          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 text-sm hover:underline mt-[1em] cursor-pointer text-gray-700 dark:text-gray-300"
          >
            <FaEdit size={16} className="text-primary" />
            {t("editProfile")}
          </button>
        </div>

        {/* SETTINGS */}
        <h3 className="text-[#141414] dark:text-gray-100 text-[20px] w-full max-w-3xl mt-8 mb-4">
          {t("settingsTitle")}
        </h3>

        <div className="w-full max-w-3xl border border-[#CDE9FE] dark:border-gray-700 rounded-xl shadow-sm p-6 bg-white dark:bg-gray-800">
          {/* PASSWORD */}
          <Label className="mb-2 text-gray-700 dark:text-gray-300">
            {t("changePassword")}
          </Label>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative max-w-xs w-full">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="************"
                className="pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              onClick={handlePasswordChange}
              className="bg-primary hover:bg-primary text-white px-8"
            >
              {t("changeButton")}
            </Button>
          </div>

          <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />

          {/* NOTIFICATIONS */}
          <h4 className="text-[16px] font-medium text-gray-700 dark:text-gray-300 mb-6">
            {t("notificationPreferences")}
          </h4>

          <div className="space-y-6 text-[16px] text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>{t("emailAlerts")}</span>
              <Switch
                className="cursor-pointer"
                checked={emailAlertEnabled}
                onCheckedChange={(value) => {
                  setEmailAlertEnabled(value);
                  updateNotification("emailAlertEnabled", value);
                }}
              />
            </div>

            <div className="flex justify-between">
              <span>{t("smsAlerts")}</span>
              <Switch
                className="cursor-pointer"
                checked={smsAlertEnabled}
                onCheckedChange={(value) => {
                  setSmsAlertEnabled(value);
                  updateNotification("smsAlertEnabled", value);
                }}
              />
            </div>

            <div className="flex justify-between">
              <span>{t("pushNotifications")}</span>
              <Switch
                className="cursor-pointer"
                checked={pushNotificationEnabled}
                onCheckedChange={(value) => {
                  setPushNotificationEnabled(value);
                  updateNotification("pushNotificationEnabled", value);
                }}
              />
            </div>
          </div>
        </div>

        {/* DELETE ACCOUNT */}
        <div className="w-full max-w-3xl mt-8">
          <Button
            onClick={() => setDeleteOpen(true)}
            variant="destructive"
            style={{ padding: "22px 30px" }}
            className="w-full bg-[#FEF6F6] hover:bg-red-100 border border-[#F28F97] text-[#E52030] flex items-center justify-start gap-2 text-[16px] font-[400px] dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-700 dark:text-red-300"
          >
            <UserRoundX size={20} /> {t("deleteAccount")}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-[16px] text-primary mt-6 pl-8 w-full max-w-3xl">
          <a href="#" className="hover:underline">
            {t("privacyPolicy")}
          </a>
        </p>
      </section>

      <EditProfileModal
        open={editOpen}
        onOpenChange={handleEditModal}
        user={userData}
        emailAlertEnabled={emailAlertEnabled}
        smsAlertEnabled={smsAlertEnabled}
        pushNotificationEnabled={pushNotificationEnabled}
      />

      <DeleteAccountModal open={deleteOpen} onOpenChange={setDeleteOpen} />
    </section>
  );
}
