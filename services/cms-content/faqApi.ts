import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const faqApi = createApi({
  reducerPath: "faqApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE,
  }),
  endpoints: (builder) => ({
    getFaq: builder.mutation({
      query: () => ({
        url: "/cms-content/faq/get-list",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetFaqMutation } = faqApi;
