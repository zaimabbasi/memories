import { PostCreateForm } from "../components";
import useTitle from "../hooks/useTitle";

const PostCreate = () => {
    useTitle("Create post - Memories");

    const content = (
        <div className="my-3 mx-auto max-w-xl">
            <div className="rounded-md border p-5 shadow-md">
                <PostCreateForm />
            </div>
        </div>
    );

    return content;
};

export default PostCreate;
