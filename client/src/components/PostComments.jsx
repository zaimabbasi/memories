import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, Transition } from "@headlessui/react";
import { XCircleIcon, PaperAirplaneIcon, EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline";
import {
    useCreateNewCommentMutation,
    useEditCommentMutation,
    useDeleteCommentMutation
} from "../features/comment/commentApiSlice";
import { selectCurrentUser } from "../features/user/userSlice";
import { TimeAgo, Spinner } from ".";
import classNames from "../hooks/useClassNames";

const PostComments = ({ postId, comments }) => {
    const currentUser = useSelector(selectCurrentUser);

    const [flaggedCommentId, setFlaggedCommentId] = useState(null);
    const [commentContent, setCommentContent] = useState("");

    const canComment = Boolean(commentContent.trim());

    const handleCommentContentChanged = (e) => setCommentContent(e.target.value);

    const [createNewComment, { isLoading: isCreateNewCommentLoading }] = useCreateNewCommentMutation();
    const [editComment, { isLoading: isEditCommentLoading }] = useEditCommentMutation();
    const [deleteComment, { isLoading: isDeleteCommentLoading }] = useDeleteCommentMutation();

    const handleCreateNewComment = async (e) => {
        e.preventDefault();

        try {
            await createNewComment({ postId, content: commentContent.trim() }).unwrap();

            setCommentContent("");
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditComment = async (e) => {
        e.preventDefault();

        try {
            await editComment({ commentId: flaggedCommentId, content: commentContent.trim() }).unwrap();

            stopEditComment();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        setFlaggedCommentId(commentId);

        try {
            await deleteComment({ commentId }).unwrap();

            setFlaggedCommentId(null);
        } catch (error) {
            console.log(error);
        }
    };

    const startEditComment = (commentId, commentContent) => {
        setFlaggedCommentId(commentId);
        setCommentContent(commentContent);

        const commentInput = document.getElementById(`comment-input-${postId}`);
        commentInput.focus();
    };

    const stopEditComment = () => {
        setFlaggedCommentId(null);
        setCommentContent("");
    };

    const content = (
        <>
            {comments.map((comment) => (
                <div
                    className={classNames(
                        comment._id === flaggedCommentId ? "bg-gray-100" : "",
                        "mt-1 flex items-center space-x-2 rounded-sm p-0.5"
                    )}
                    key={comment._id}
                >
                    <div className="grow space-x-2 text-sm">
                        <Link className="font-medium" to={`/user/${comment.author._id}`}>
                            {comment.author.username}
                        </Link>
                        <span>{comment.content}</span>
                        <TimeAgo timestamp={comment.date} />
                    </div>

                    {Boolean(comment.author._id === currentUser._id) &&
                        (flaggedCommentId !== comment._id ? (
                            <Menu as="div" className="relative">
                                <Menu.Button>
                                    <EllipsisHorizontalCircleIcon className="h-5 w-5 stroke-gray-500 hover:stroke-gray-700 active:stroke-gray-900" />
                                </Menu.Button>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 mt-0 w-16 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <div
                                                    className={classNames(
                                                        active ? "bg-gray-100" : "",
                                                        "cursor-pointer px-2 py-1 text-xs text-gray-700"
                                                    )}
                                                    onClick={() => startEditComment(comment._id, comment.content)}
                                                >
                                                    Edit
                                                </div>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <div
                                                    className={classNames(
                                                        active ? "bg-gray-100" : "",
                                                        "cursor-pointer px-2 py-1 text-xs text-gray-700"
                                                    )}
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                >
                                                    Delete
                                                </div>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        ) : isDeleteCommentLoading ? (
                            <div className="text-gray-500">
                                <Spinner />
                            </div>
                        ) : (
                            <button className="group" onClick={stopEditComment}>
                                <XCircleIcon className="h-5 w-5 stroke-gray-500 group-enabled:hover:stroke-gray-700 group-enabled:active:stroke-gray-900" />
                            </button>
                        ))}
                </div>
            ))}

            {/* New comment */}
            <div className="mt-1 flex items-center space-x-2 p-0.5 text-sm text-gray-900">
                <Link className="font-medium" to={`/user/${currentUser._id}`}>
                    {currentUser.username}
                </Link>

                <form
                    className="container"
                    action="submit"
                    onSubmit={flaggedCommentId ? handleEditComment : handleCreateNewComment}
                >
                    <div className="flex items-center space-x-2">
                        <input
                            className="w-0 grow border-b border-gray-300 px-1 outline-none"
                            id={`comment-input-${postId}`}
                            type="text"
                            placeholder={"Write new comment..."}
                            value={commentContent}
                            onChange={handleCommentContentChanged}
                        />

                        {isCreateNewCommentLoading || isEditCommentLoading ? (
                            <div className="text-gray-500">
                                <Spinner />
                            </div>
                        ) : (
                            <button className="group" disabled={!canComment}>
                                <PaperAirplaneIcon className="h-5 w-5 stroke-gray-500 group-enabled:hover:stroke-gray-700 group-enabled:active:stroke-gray-900" />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </>
    );

    return content;
};

export default PostComments;
