import { useSelector } from "react-redux";
import { abbreviateNumber } from "js-abbreviation-number";
import { HeartIcon } from "@heroicons/react/24/outline";
import { selectCurrentUser } from "../features/user/userSlice";
import { useLikeUnlikePostMutation } from "../features/post/postApiSlice";
import classNames from "../hooks/useClassNames";

const PostLikeUnlike = ({ postId, postLikes }) => {
    const currentUser = useSelector(selectCurrentUser);

    const [likeUnlikePost] = useLikeUnlikePostMutation();

    const handleLikeUnlikePost = async (e) => {
        try {
            await likeUnlikePost({ postId }).unwrap();
        } catch (error) {
            console.log(error);
        }
    };

    const content = (
        <button
            className="group flex items-center rounded-md p-0.5 font-medium text-gray-700 hover:bg-red-100"
            onClick={handleLikeUnlikePost}
        >
            <HeartIcon
                className={classNames(
                    Boolean(postLikes.find((user) => user._id === currentUser._id))
                        ? "fill-red-500 stroke-red-500"
                        : "group-hover:fill-red-500 group-hover:stroke-red-500",
                    "mr-2 h-6 w-6"
                )}
            />
            {abbreviateNumber(postLikes.length, 1)}
        </button>
    );
    return content;
};

export default PostLikeUnlike;
