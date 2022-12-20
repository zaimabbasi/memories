import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3500",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const { accessToken } = getState().auth;

        if (accessToken) {
            headers.set("authorization", `Bearer ${accessToken}`);
        }

        return headers;
    }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.originalStatus === 403) {
        const refreshResult = await baseQuery("/users/auth/refresh", api, extraOptions);

        if (refreshResult?.data) {
            const { accessToken } = refreshResult.data;

            api.dispatch(setCredentials(accessToken));

            result = await baseQuery(args, api, extraOptions);
        } else if (refreshResult?.error?.status === 403) {
            refreshResult.error.data.message = "You need to login again";

            return refreshResult;
        }
    }

    return result;
};

const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Post", "User"],
    endpoints: (builder) => ({})
});

export default apiSlice;
