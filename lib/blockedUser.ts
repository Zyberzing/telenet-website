type BlockedResponseLike = {
  statusCode?: number;
  message?: string;
};

type ClearSessionFn = () => Promise<void>;

export async function handleBlockedUserResponse(
  responseStatus: number,
  responseBody: BlockedResponseLike | null | undefined,
  clearSessionFn?: ClearSessionFn,
): Promise<boolean> {
  const isBlocked =
    responseStatus === 444 || Number(responseBody?.statusCode) === 444;

  if (!isBlocked) return false;

  const message = responseBody?.message || "User is blocked";

  try {
    if (clearSessionFn) {
      await clearSessionFn();
    }
  } catch {
    // ignore session cleanup failures
  }

  if (typeof window !== "undefined") {
    const w = window as Window & { __blockedUserRedirecting?: boolean };

    if (!w.__blockedUserRedirecting) {
      w.__blockedUserRedirecting = true;

      try {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        sessionStorage.clear();
      } catch {
        // ignore storage cleanup failures
      }

      try {
        const { destroyCookie } = await import("nookies");
        destroyCookie(null, "session");
        destroyCookie(null, "token");
      } catch {
        // ignore cookie cleanup failures
      }

      try {
        const { toast } = await import("sonner");
        toast.error(message, { id: "blocked-user-toast" });
      } catch {
        // ignore toast failures
      }

      setTimeout(() => {
        window.location.href = "/";
      }, 250);
    }
  }

  return true;
}
