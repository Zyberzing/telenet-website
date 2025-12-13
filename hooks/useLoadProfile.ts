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

