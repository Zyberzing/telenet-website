"use client";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { clearSession } from "@/lib/session";
import { deleteAccount } from "@/services/auth"; // <<< ADD THIS
import { logout } from "@/store/slices/authSlice";
import { UserRoundX } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function DeleteAccountModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const locale = useLocale();
  const t = useTranslations("profile");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      const res = await deleteAccount();
      toast.success(res?.message || "Account deleted successfully");
      dispatch(logout());
      await localStorage.clear();
      await sessionStorage.clear();
      await destroyCookie(null, "session");
      await destroyCookie(null, "token");
      await clearSession();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      onOpenChange(false);

      // Redirect to home
      router.push(`/${locale}/`);
      router.refresh();
    } catch (error: unknown) {
      let message = "Failed to delete account";

      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === "string") {
        message = error;
      }

      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            className="bg-black dark:bg-gray-700 px-10 flex-1 rounded-3xl text-[15px]"
            onClick={() => onOpenChange(false)}
          >
            {t("modal.delete.cancel")}
          </Button>

          {/* DELETE BUTTON */}
          <Button
            variant="destructive"
            className="bg-red-500 px-10 flex-1 rounded-3xl text-[15px]"
            onClick={handleDelete}
          >
            {t("modal.delete.deleteButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
