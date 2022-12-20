import apiSlice from "../../app/api/apiSlice";

const commentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createNewComment: builder.mutation({
            query: ({ postId, content }) => ({
                url: "/comments",
                method: "POST",
                body: { postId, content }
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.postId }],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                const { comment } = data;

                return comment;
            }
        }),
        editComment: builder.mutation({
            query: ({ commentId, content }) => ({
                url: `/comments/${commentId}`,
                method: "PATCH",
                body: { content }
            }),
            invalidatesTags: ["Post"],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                const { comment } = data;

                return comment;
            }
        }),
        deleteComment: builder.mutation({
            query: ({ commentId }) => ({
                url: `comments/${commentId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Post"],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                const { comment } = data;

                return comment;
            }
        })
    })
});

export const { useCreateNewCommentMutation, useEditCommentMutation, useDeleteCommentMutation } = commentApiSlice;
