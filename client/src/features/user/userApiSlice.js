import { createEntityAdapter } from "@reduxjs/toolkit";
import apiSlice from "../../app/api/apiSlice";
import { setUser, clearUser } from "./userSlice";
import { logOut } from "../auth/authSlice";

const userAdapter = createEntityAdapter();

const initialState = userAdapter.getInitialState();

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: () => ({
                url: "/users",
                method: "GET"
            }),
            providesTags: (result, error, arg) => ["User", ...result.ids.map((id) => ({ type: "User", id }))],
            transformResponse: (responseData) => {
                const { users } = responseData;

                return userAdapter.setAll(
                    initialState,
                    users.map((user) => {
                        user.id = user._id;

                        return user;
                    })
                );
            }
        }),
        createNewUser: builder.mutation({
            query: ({ username, email, password, confirmPassword }) => ({
                url: "/users",
                method: "POST",
                body: { username, email, password, confirmPassword }
            }),
            invalidatesTags: ["User"],
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { user } = data;

                    return user;
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        deleteUser: builder.mutation({
            query: ({ userId, password }) => ({
                url: `/users/${userId}`,
                method: "DELETE",
                body: { password }
            }),
            invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.userId }],
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
        updateUser: builder.mutation({
            query: ({ userId, user }) => ({
                url: `/users/${userId}`,
                method: "PATCH",
                body: user
            }),
            invalidatesTags: (result, error, arg) => ["Post", { type: "User", id: arg.userId }],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { user } = data;

                    dispatch(setUser(user));
                    return user;
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        changePassword: builder.mutation({
            query: ({ userId, password, newPassword, confirmPassword }) => ({
                url: `/users/password/${userId}`,
                method: "PATCH",
                body: { password, newPassword, confirmPassword }
            }),
            invalidatesTags: (result, error, arg) => [{ type: "User", id: result?.user._id }],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { user } = data;

                    dispatch(setUser(user));
                    return user;
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        followUnfollowUser: builder.mutation({
            query: ({ userId }) => ({
                url: `/users/follow/${userId}`,
                method: "PATCH"
            }),
            invalidatesTags: (result, error, arg) => ["Post", { type: "User", id: arg.userId }],
            async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
                const { currentUser } = getState().user;

                const patchResult = dispatch(
                    apiSlice.util.updateQueryData("getAllUsers", undefined, ({ entities }) => {
                        const user = entities[arg.userId];

                        if (user.followers.find((user) => user._id === currentUser._id)) {
                            user.followers = user.followers.filter((user) => user._id !== currentUser._id);
                        } else {
                            user.followers.push(currentUser);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch (error) {
                    console.log(error);
                    patchResult.undo();
                }
            }
        })
    })
});

export const {
    useGetAllUsersQuery,
    useCreateNewUserMutation,
    useDeleteUserMutation,
    useUpdateUserMutation,
    useChangePasswordMutation,
    useFollowUnfollowUserMutation
} = userApiSlice;
