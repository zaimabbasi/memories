import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateNewPostMutation } from "../features/post/postApiSlice";
import { Error, Spinner } from ".";
import classNames from "../hooks/useClassNames";

const PostCreateForm = () => {
    const navigate = useNavigate();

    const [postCaption, setPostCaption] = useState("");
    const onPostCaptionChanged = (e) => setPostCaption(e.target.value);

    const [postImage, setPostImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("");

    const [createNewPost, { isLoading }] = useCreateNewPostMutation();
    const [error, setError] = useState();

    const handleFileInput = (e) => {
        const file = e.target.files[0];

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            setPreviewImage(fileReader.result);
        };

        setPostImage(file);
    };

    const handleCreateNewPost = async (e) => {
        e.preventDefault();

        setError(null);

        const formData = new FormData();
        formData.append("caption", postCaption.trim());
        formData.append(postImage?.name, postImage);

        try {
            const result = await createNewPost(formData).unwrap();
            const { post } = result;

            navigate(`/post/${post._id}`, { replace: true });
        } catch (error) {
            console.log(error);
            setError(error);
        }
    };

    const content = (
        <form action="submit" onSubmit={handleCreateNewPost}>
            <label
                className={classNames(
                    !previewImage ? "h-96 bg-neutral-100" : "",
                    "relative block rounded-sm border-2 border-dashed border-gray-300 hover:border-gray-500"
                )}
            >
                <img className="w-full rounded-sm" src={previewImage} alt="" />
                <input
                    className="absolute inset-y-0 w-full cursor-pointer opacity-0"
                    type={"file"}
                    onChange={handleFileInput}
                />
                {!previewImage && (
                    <label className="text-md absolute  inset-y-1/2 inline-flex w-full items-center justify-center  text-gray-700">
                        Click or drag an image here
                    </label>
                )}
            </label>

            <textarea
                className="mt-3 block h-auto w-full rounded-md border border-gray-300 py-1 px-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                placeholder="Write a caption..."
                value={postCaption}
                onChange={onPostCaptionChanged}
            />

            <button
                className="mt-5 flex h-8 min-w-full items-center justify-center rounded-md bg-indigo-500 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-300 enabled:hover:bg-indigo-700 enabled:active:bg-indigo-900"
                disabled={isLoading}
            >
                {isLoading ? <Spinner /> : "Create post"}
            </button>

            {error && (
                <div className="mt-5">
                    <Error message={error?.data?.message || error?.error} />
                </div>
            )}
        </form>
    );

    return content;
};

export default PostCreateForm;
