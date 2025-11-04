import { RootState } from "@/store/Store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE,
    prepareHeaders: (headers, { getState, endpoint }) => {
      const state = getState() as RootState;
      const accessToken = state.auth.token;
      const refreshToken = state.auth.refreshToken;

      if (
        (endpoint === "getProfile" || endpoint === "changePassword") &&
        accessToken
      ) {
        headers.set("authorization", accessToken);
        if (refreshToken) {
          headers.set("x-refresh-token", refreshToken);
        }
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetProfileQuery,
  useChangePasswordMutation,
} = authApi;
