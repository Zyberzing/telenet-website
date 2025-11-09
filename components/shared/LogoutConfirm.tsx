"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { clearSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { logout } from "@/store/slices/authSlice";
import { destroyCookie } from "nookies";
import { ReactNode } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const LogoutConfirm = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const dispatch = useDispatch();

  return (
    <AlertDialog>
      <AlertDialogTrigger className={cn(className)} asChild>
        <span>{children}</span>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout</AlertDialogTitle>
          <AlertDialogDescription className="break-normal">
            Are you sure you want to log out?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              toast.loading("Logging out...", { id: "logout-toast" });

              try {
                dispatch(logout());
                await localStorage.clear();
                await sessionStorage.clear();
                await destroyCookie(null, "session");
                await destroyCookie(null, "token");
                await clearSession();
                document.cookie.split(";").forEach((c) => {
                  document.cookie = c
                    .replace(/^ +/, "")
                    .replace(
                      /=.*/,
                      "=;expires=" + new Date().toUTCString() + ";path=/"
                    );
                });
                toast.success("Logged out", { id: "logout-toast" });

                window.location.href = "/";
              } catch {
                toast.error("Failed to log out", { id: "logout-toast" });
              }
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutConfirm;
