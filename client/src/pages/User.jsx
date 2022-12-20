import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { abbreviateNumber } from "js-abbreviation-number";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { selectCurrentUser } from "../features/user/userSlice";
import { useFollowUnfollowUserMutation, useGetAllUsersQuery } from "../features/user/userApiSlice";
import { useGetAllPostsQuery } from "../features/post/postApiSlice";
import { Error, Loading, NoContent } from "../components";
import userImage from "../assets/user-image.png";
import useTitle from "../hooks/useTitle";

const User = () => {
    useTitle("User - Memories");

    const { userId } = useParams();
    const navigate = useNavigate();

    const currentUser = useSelector(selectCurrentUser);
    const {
        user,
        isLoading: isUserLoading,
        isSuccess: isUserSuccess,
        isError: isUserError,
        error: userError
    } = useGetAllUsersQuery(undefined, {
        selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
            user: data?.entities[userId],
            isLoading,
            isSuccess,
            isError,
            error
        })
    });

    const {
        data: posts,
        isLoading: isPostsLoading,
        isSuccess: isPostsSuccess,
        isError: isPostsError,
        error: postsError
    } = useGetAllPostsQuery(undefined);

    const [followUnfollowUser] = useFollowUnfollowUserMutation();

    const onEditProfileClicked = (e) => {
        navigate("/user/settings");
    };

    const handleFollowUnfollowUser = async (e) => {
        try {
            await followUnfollowUser({ userId });
        } catch (error) {
            console.log(error);
        }
    };

    let content;
    if (isUserLoading) {
        content = (
            <div className="mt-3">
                <Loading />
            </div>
        );
    } else if (isUserError) {
        content = (
            <div className="mt-3">
                <Error message={userError} />
            </div>
        );
    } else if (isUserSuccess) {
        const isFollowing = Boolean(user.followers.find((user) => user._id === currentUser._id));

        if (isPostsLoading) {
            content = (
                <div className="mt-3">
                    <Loading />
                </div>
            );
        } else if (isPostsError) {
            content = (
                <div className="mt-3">
                    <Error message={postsError} />
                </div>
            );
        } else if (isPostsSuccess) {
            const { ids, entities } = posts;
            const filteredIds = ids.filter((postId) => entities[postId].author._id === userId);

            content = (
                <div className="my-3 mx-auto max-w-5xl">
                    <div className="mx-auto mt-3 flex items-center justify-center space-x-9">
                        <img className="h-24 w-24 rounded-full" src={user.image ?? userImage} alt="" />

                        <div>
                            <div className="flex items-center space-x-5">
                                <span className="text-2xl font-medium text-gray-900">{user.username}</span>
                                {userId === currentUser._id ? (
                                    <button
                                        className="flex h-8 items-center rounded-md bg-gray-300 px-2 py-1 font-medium text-gray-900 hover:bg-gray-400 focus:outline-none active:bg-gray-500"
                                        onClick={onEditProfileClicked}
                                    >
                                        Edit profile
                                        <Cog6ToothIcon className="ml-1 h-5 w-5" />
                                    </button>
                                ) : (
                                    <button
                                        className="flex h-8 items-center rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-700 hover:text-gray-900 focus:outline-none active:bg-gray-300"
                                        onClick={handleFollowUnfollowUser}
                                    >
                                        {isFollowing ? "Following" : "Follow"}
                                    </button>
                                )}
                            </div>
                            <div className="mt-1 flex items-center space-x-5">
                                <span className="text-gray-900">{abbreviateNumber(filteredIds.length)} posts</span>
                                <span className="text-gray-900">
                                    {abbreviateNumber(user.followers.length)} followers
                                </span>
                            </div>
                        </div>
                    </div>

                    <hr className="mt-3" />

                    {filteredIds.length ? (
                        <div className="mx-auto mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                            {filteredIds.map((postId) => (
                                <div key={postId}>
                                    <Link to={`/post/${postId}`}>
                                        <img
                                            className="h-40 w-full rounded-sm object-cover hover:opacity-80"
                                            src={entities[postId].image}
                                            alt=""
                                        />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="my-3 flex items-center justify-center text-lg">
                            <NoContent message={"You have not created any posts yet..."} />
                        </div>
                    )}
                </div>
            );
        }
    }

    return content;
};

export default User;
