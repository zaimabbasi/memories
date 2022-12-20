import { createEntityAdapter } from "@reduxjs/toolkit";
import apiSlice from "../../app/api/apiSlice";

const postAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
});

const initialState = postAdapter.getInitialState();

const postApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllPosts: builder.query({
            query: () => ({
                url: "/posts",
                method: "GET"
            }),
            providesTags: (result, error, arg) => ["Post", ...result.ids.map((id) => ({ type: "Post", id }))],
            transformResponse: (responseData) => {
                const { posts } = responseData;

                return postAdapter.setAll(
                    initialState,
                    posts.map((post) => {
                        post.id = post._id;

                        return post;
                    })
                );
            }
        }),
        createNewPost: builder.mutation({
            query: (post) => ({
                url: "/posts",
                method: "POST",
                body: post
            }),
            invalidatesTags: ["Post"],
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { post } = data;

                    return post;
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        updatePost: builder.mutation({
            query: ({ postId, post }) => ({
                url: `/posts/${postId}`,
                method: "PATCH",
                body: post
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.postId }],
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { post } = data;

                    return post;
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        deletePost: builder.mutation({
            query: ({ postId }) => ({
                url: `posts/${postId}`,
                method: "DELETE"
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.postId }],
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { post } = data;

                    return post;
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        likeUnlikePost: builder.mutation({
            query: ({ postId }) => ({
                url: `/posts/like/${postId}`,
                method: "PATCH"
            }),
            async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
                const { currentUser } = getState().user;

                const patchResult = dispatch(
                    apiSlice.util.updateQueryData("getAllPosts", undefined, ({ entities }) => {
                        const post = entities[arg.postId];

                        if (post.likes.find((user) => user._id === currentUser._id)) {
                            post.likes = post.likes.filter((user) => user._id !== currentUser._id);
                        } else {
                            post.likes.push(currentUser);
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
    useGetAllPostsQuery,
    useCreateNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useLikeUnlikePostMutation
} = postApiSlice;
