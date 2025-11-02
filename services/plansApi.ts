import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const plansApi = createApi({
  reducerPath: "plansApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE,
  }),
  endpoints: (builder) => ({
    getCountries: builder.mutation({
      query: () => ({
        url: "/plan/countries",
        method: "GET",
      }),
    }),
    getRegions: builder.mutation({
      query: () => ({
        url: "/plan/regions",
        method: "GET",
      }),
    }),
    getPlans: builder.mutation({
      query: ({ country_code, region_name, filterby = "Region" }) => ({
        url: `/plan/package-list?filterby=${filterby}&country_code=${country_code}&region_name=${region_name}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCountriesMutation,
  useGetRegionsMutation,
  useGetPlansMutation,
} = plansApi;
