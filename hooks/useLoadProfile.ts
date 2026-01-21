"use client";

import { getProfile } from "@/services/auth";
import { setUser } from "@/store/slices/authSlice";
import { RootState } from "@/store/Store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


export function useLoadProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Only load if we don't have user data yet
    if (!user) {
      // Try to read persisted user from localStorage (client-only)
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("user");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed) {
              console.log("🔁 Rehydrated user from localStorage:", parsed.email || parsed);
              dispatch(setUser(parsed));
              return; // don't call server-side profile fetch from client
            }
          }
        } catch (err) {
          console.warn("[useLoadProfile] Failed to read user from localStorage:", err);
        }
      }

      // If no local user, attempt to load via server-aware helper as a best-effort.
      // This may fail on client because `getProfile` uses server-only cookies; handle errors gracefully.
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    try {
      console.log("🔄 Loading user profile...");
      const userData = await getProfile();

      if (userData) {
        console.log("✅ Profile loaded:", userData.email);
        dispatch(setUser(userData));
      } else {
        console.log("❌ No profile found");
      }
    } catch (error) {
      console.error("❌ Failed to load profile:", error);
    }
  };
}

