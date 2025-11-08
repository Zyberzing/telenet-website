"use client";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { changePassword } from "@/services/authApi";
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
  countryCode: string;
  address?:string;
  phone?: string;
  avatar?: string;
  location?: string;
};
export type ChangePassword = {
  oldPassword?: string;
  newPassword: string;
  confirmPassword?: string;
};

export default function ProfileSetting({ user }: { user: User }) {
  const t = useTranslations("profile");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  return (
    <div className="min-h-screen bg-white">
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
        <div className="w-full max-w-3xl border border-[#CDE9FE] rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Image
            src="/profile-user-avatar.svg"
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full object-cover"
          />

          <div className="text-center sm:text-left">
            <p className="text-[24px] font-[400px] text-gray-900">
              {user?.name}
            </p>
            <p className="text-primary text-sm">{user?.email}</p>
            <p className="text-sm">{user?.phone}</p>
            <p className="text-[#666666] text-sm mt-1">{user?.location}</p>
          </div>

          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 text-sm hover:underline mt-[1em] cursor-pointer"
          >
            <span className="text-primary">
              <FaEdit size={16} />
            </span>{" "}
            {t("editProfile")}
          </button>
        </div>

        {/* Settings */}
        <h3 className="text-[#141414] text-[20px] font-[400px] w-full max-w-3xl mt-8 mb-4">
          {t("settingsTitle")}
        </h3>
        <div className="w-full max-w-3xl border border-[#CDE9FE] rounded-xl shadow-sm p-6">
          {/* Change Password */}
          <Label htmlFor="name" className="mb-2 text-[16px] font-[400]">
            {t("changePassword")}
          </Label>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative max-w-xs w-full">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="************"
                className="pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Button
              onClick={handlePasswordChange}
              className="bg-primary text-white px-8"
            >
              {t("changeButton")}
            </Button>
          </div>

          <Separator className="my-4" />

          {/* Notifications */}
          <h4 className="text-[16px] font-medium text-gray-700 mb-6">
            {t("notificationPreferences")}
          </h4>
          <div className="space-y-6 text-[16px] text-gray-600">
            <div className="flex justify-between">
              <span>{t("emailAlerts")}</span>
              <Switch defaultChecked />
            </div>
            <div className="flex justify-between">
              <span>{t("smsAlerts")}</span>
              <Switch />
            </div>
            <div className="flex justify-between">
              <span>{t("pushNotifications")}</span>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <div className="w-full max-w-3xl mt-8">
          <Button
            onClick={() => setDeleteOpen(true)}
            variant="destructive"
            style={{ padding: "22px 30px" }}
            className="w-full bg-[#FEF6F6] hover:bg-red-100 border border-[#F28F97] text-[#E52030] flex items-center justify-start gap-2 text-[16px] font-[400px]"
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

      {/* Delete Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[420px] text-center p-8 rounded-4xl">
          <div className="flex flex-col items-center mt-2">
            <div className="w-20 h-20 border-2 border-red-500 rounded-full flex items-center justify-center mb-4">
              <UserRoundX className="text-red-500 w-10 h-10 p-1" />
            </div>
            <DialogTitle className="text-[35px] font-[400]">
              {t("modal.delete.title")}
            </DialogTitle>
            <DialogDescription className="text-[#000000A6] text-[17px] mt-1">
              {t("modal.delete.description")}
            </DialogDescription>
          </div>

          <DialogFooter
            className="flex gap-10 mt-8"
            style={{ justifyContent: "space-between" }}
          >
            <Button
              variant="secondary"
              className="bg-black px-10 flex-1 rounded-3xl text-[15px]"
              onClick={() => setDeleteOpen(false)}
            >
              {t("modal.delete.cancel")}
            </Button>
            <Button
              variant="destructive"
              className="bg-red-500 px-10 flex-1 rounded-3xl text-[15px]"
              onClick={() => setDeleteOpen(false)}
            >
              {t("modal.delete.deleteButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[600px] p-6">
          <DialogHeader className="flex items-start m-0 justify-between">
            <DialogTitle className="text-[24px] font-[400]">
              {user?.name}
            </DialogTitle>
            <DialogClose className="text-gray-500 hover:text-gray-700 text-xl" />
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="mb-2 text-[16px] font-[400]">
                {t("modal.edit.name")}
              </Label>
              <Input id="name" defaultValue={user?.name} />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="phone" className="mb-2 text-[16px] font-[400]">
                  {t("modal.edit.phone")}
                </Label>
                <Input
                  id="phone"
                  value={`${user?.countryCode ?? ""} ${user?.phone ?? ""}`}
                  readOnly
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="email" className="mb-2 text-[16px] font-[400]">
                  {t("modal.edit.email")}
                </Label>
                <Input id="email" defaultValue={user?.email} />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <Label className="mb-2 text-[16px] font-[400]">
                  {t("modal.edit.country")}
                </Label>
                <Select defaultValue="usa">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="in">India</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label className="mb-2 text-[16px] font-[400]">
                  {t("modal.edit.language")}
                </Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-2 text-[16px] font-[400]">
                {t("modal.edit.currency")}
              </Label>
              <Select defaultValue="usd">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="inr">INR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex gap-4 mt-6 justify-end">
            <Button
              variant="secondary"
              className="bg-black px-10 flex-1 rounded-3xl text-[15px]"
              onClick={() => setEditOpen(false)}
            >
              {t("modal.edit.cancel")}
            </Button>
            <Button className="bg-primary px-10 flex-1 rounded-3xl text-[15px]">
              {t("modal.edit.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
