import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetAllPostsQuery } from "../features/post/postApiSlice";
import { selectCurrentUser } from "../features/user/userSlice";
import {
    Error,
    Loading,
    PostAuthor,
    PostEditMenu,
    PostImage,
    PostLikeUnlike,
    TimeAgo,
    PostCaption,
    PostComments
} from "../components";
import useTitle from "../hooks/useTitle";

const PostView = () => {
    useTitle("Post - Memories");

    const currentUser = useSelector(selectCurrentUser);

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
            <div className="my-3 mx-auto min-w-min max-w-xl">
                <div className="rounded-md border bg-white p-3 shadow-md">
                    {/* Post author */}
                    <div className="flex items-center justify-between">
                        <PostAuthor
                            authorId={post.author._id}
                            authorUsername={post.author.username}
                            authorImage={post.author.image}
                        />
                        {Boolean(post.author._id === currentUser._id) && <PostEditMenu postId={postId} />}
                    </div>

                    {/* Post image */}
                    <div className="mt-3">
                        <PostImage postImage={post.image} />
                    </div>

                    {/* Post like and time posted */}
                    <div className="mt-1 flex items-center justify-between">
                        <PostLikeUnlike postId={post._id} postLikes={post.likes} />
                        <TimeAgo timestamp={post.date} />
                    </div>

                    {/* Post caption and comments */}
                    <div className="mt-1">
                        {post.caption && (
                            <PostCaption
                                authorId={post.author._id}
                                authorUsername={post.author.username}
                                caption={post.caption}
                            />
                        )}

                        <PostComments postId={post._id} comments={post.comments} />
                    </div>
                </div>
            </div>
        );
    }

    return content;
};

export default PostView;
