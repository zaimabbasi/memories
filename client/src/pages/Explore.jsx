import { Link } from "react-router-dom";
import { useGetAllPostsQuery } from "../features/post/postApiSlice";
import { Error, Loading, NoContent } from "../components";
import useTitle from "../hooks/useTitle";

const Explore = () => {
    useTitle("Explore - Memories");

    const { data: posts, isLoading, isSuccess, isError, error } = useGetAllPostsQuery(undefined);

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

        content = ids.length ? (
            <div className="my-3 mx-auto grid max-w-5xl grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {ids.map((postId) => (
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
                <NoContent message={"There are no posts to explore right now..."} />
            </div>
        );
    }

    return content;
};

export default Explore;
