import { useParams } from "react-router-dom";
import { useGetAllPostsQuery } from "../features/post/postApiSlice";
import { Error, Loading, PostEditForm } from "../components";
import useTitle from "../hooks/useTitle";

const PostEdit = () => {
    useTitle("Edit post - Memories");

    const { postId } = useParams();

    const { post, isLoading, isSuccess, isError, error } = useGetAllPostsQuery(undefined, {
        selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
            post: data?.entities[postId],
            isLoading,
            isSuccess,
            isError,
            error
        })
    });

    let content;
    if (isLoading) {
        content = (
            <div className="mt-3">
                <Loading />
            </div>
        );
    } else if (isError) {
        content = (
            <div className="mt-3">
                <Error message={error} />
            </div>
        );
    } else if (isSuccess) {
        content = (
            <div className="my-3 mx-auto max-w-xl">
                <div className="rounded-md border p-5 shadow-md">
                    <PostEditForm post={post} />
                </div>
            </div>
        );
    }

    return content;
};

export default PostEdit;
