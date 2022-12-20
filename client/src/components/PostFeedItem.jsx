import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { PostAuthor, PostEditMenu, PostImage, PostLikeUnlike, TimeAgo, PostCaption, PostComments } from ".";

const PostFeedItem = ({ post }) => {
    const currentUser = useSelector(selectCurrentUser);

    const content = (
        <div className="rounded-md border bg-white p-3 shadow-md">
            {/* Post author */}
            <div className="flex items-center justify-between">
                <PostAuthor
                    authorId={post.author._id}
                    authorUsername={post.author.username}
                    authorImage={post.author.image}
                />
                {Boolean(post.author._id === currentUser._id) && <PostEditMenu postId={post._id} />}
            </div>

            {/* Post image */}
            <div className="mt-3">
                <PostImage postId={post._id} postImage={post.image} />
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
    );

    return content;
};

export default PostFeedItem;
