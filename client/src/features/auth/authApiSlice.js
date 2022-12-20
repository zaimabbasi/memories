import apiSlice from "../../app/api/apiSlice";
import { setCredentials, logOut } from "./authSlice";
import { setUser, clearUser } from "../user/userSlice";

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ username, email, password }) => ({
                url: "users/auth",
                method: "POST",
                body: { username, email, password }
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { user, accessToken } = data;

                    dispatch(setCredentials(accessToken));
                    dispatch(setUser(user));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        logout: builder.mutation({
            query: () => ({
                url: "users/auth/logout",
                method: "POST"
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    dispatch(logOut());
                    dispatch(clearUser());
                    apiSlice.util.resetApiState();
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: "users/auth/refresh",
                method: "GET"
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { accessToken } = data;

                    dispatch(setCredentials(accessToken));
                } catch (error) {
                    console.log(error);
                }
            }
        })
    })
});

export const { useLoginMutation, useLogoutMutation, useRefreshMutation } = authApiSlice;
