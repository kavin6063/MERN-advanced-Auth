import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:3001/api/auth";

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token; // Get the token from Redux store (or another source)

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// create api slice

export const apiSlice = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: ({ email, password, name }) => ({
        url: "/signup",
        method: "POST",
        body: { email, password, name },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/login",
        method: "POST",
        body: { email, password }, // Request body
        credentials: "include",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    verifyEmail: builder.mutation({
      query: (code) => ({
        url: "/verify-email",
        method: "POST",
        body: { code },
      }),
    }),
    checkAuth: builder.mutation({
      query: () => ({
        url: "/check-auth",
        method: "GET",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/reset-password/${token}`,
        method: "POST",
        body: { password },
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useVerifyEmailMutation,
  useCheckAuthMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = apiSlice;
