import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetAllPostsQuery } from "../features/post/postApiSlice";
import { PostFeedItem, Error, Loading, NoContent } from "../components";
import useTitle from "../hooks/useTitle";

const Home = () => {
    useTitle("Home - Memories");

    const { data: posts, isLoading, isSuccess, isError, error } = useGetAllPostsQuery(undefined);
    const currentUser = useSelector(selectCurrentUser);

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
        const { ids, entities } = posts;
        const filteredIds = ids.filter(
            (postId) =>
                entities[postId].author._id === currentUser._id ||
                entities[postId].author.followers.find((userId) => userId === currentUser._id)
        );

        content = filteredIds.length ? (
            <div className="my-3 mx-auto min-w-min max-w-lg space-y-3">
                {filteredIds.map((postId) => (
                    <PostFeedItem key={postId} post={entities[postId]} />
                ))}
            </div>
        ) : (
            <div className="my-3 flex items-center justify-center text-lg">
                <NoContent message={"There are no posts in your feed..."} />
            </div>
        );
    }

    return content;
};

export default Home;
