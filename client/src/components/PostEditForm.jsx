import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdatePostMutation } from "../features/post/postApiSlice";
import { Error, Spinner } from ".";

const PostEditForm = ({ post }) => {
    const navigate = useNavigate();

    const [postCaption, setPostCaption] = useState(post.caption);
    const [postImage, setPostImage] = useState();
    const [previewImage, setPreviewImage] = useState(post.image);

    const [updatePost, { isLoading }] = useUpdatePostMutation();
    const [error, setError] = useState();

    const onCaptionChanged = (e) => setPostCaption(e.target.value);

    const handleFileInput = (e) => {
        const file = e.target.files[0];

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            setPreviewImage(fileReader.result);
        };

        setPostImage(file);
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();

        setError(null);

        const formData = new FormData();
        formData.append("caption", postCaption.trim());
        formData.append(postImage?.name, postImage);

        try {
            const result = await updatePost({ postId: post._id, post: formData }).unwrap();
            const { post: postResult } = result;

            navigate(`/post/${postResult._id}`, { replace: true });
        } catch (error) {
            console.log(error);
            setError(error);
        }
    };

    const content = (
        <form action="submit" onSubmit={handleUpdatePost}>
            <label className="relative block border-2 border-dashed border-gray-300 hover:border-gray-500">
                <img className="w-full rounded-sm" src={previewImage} alt="" />
                <input
                    className="absolute inset-y-0 w-full cursor-pointer opacity-0"
                    type={"file"}
                    onChange={handleFileInput}
                />
            </label>

            <textarea
                className="mt-3 block h-auto w-full rounded-md border border-gray-300 py-1 px-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                placeholder="Write a caption..."
                value={postCaption}
                onChange={onCaptionChanged}
            />

            <button
                className="mt-5 flex h-8 min-w-full items-center justify-center rounded-md bg-indigo-500 px-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-300 enabled:hover:bg-indigo-700 enabled:active:bg-indigo-900"
                disabled={isLoading}
            >
                {isLoading ? <Spinner /> : "Update post"}
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

export default PostEditForm;
