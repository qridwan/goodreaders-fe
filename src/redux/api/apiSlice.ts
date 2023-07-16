/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  BaseQueryApi,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { userLoggedOut } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://goodreaders-api.vercel.app/api/v1",
  prepareHeaders: (headers, { getState }: Pick<BaseQueryApi, "getState">) => {
    console.log("getState: ===>>", getState());
    const token = getState()?.auth?.accessToken;
    if (token) {
      headers.set("Authorization", `${token}`);
      headers.set("Content-Type", "application/json");
      headers.set("Access-Control-Allow-Origin", "*");
    }

    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
      api.dispatch(userLoggedOut());
      localStorage.clear();
    }
    return result;
  },
  tagTypes: ["reviews"],
  endpoints: () => ({}),
});