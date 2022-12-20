import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { useDeletePostMutation } from "../features/post/postApiSlice";
import { Spinner } from ".";
import classNames from "../hooks/useClassNames";

const PostEditMenu = ({ postId }) => {
    const navigate = useNavigate();

    const [deletePost, { isLoading }] = useDeletePostMutation();

    const onClickEdit = (e) => {
        navigate(`/post/edit/${postId}`);
    };

    const onClickDelete = async (e) => {
        try {
            await deletePost({ postId });

            navigate("/", { replace: true });
        } catch (error) {
            console.log(error);
        }
    };

    let content;
    if (isLoading)
        content = (
            <div className="text-gray-500">
                <Spinner />
            </div>
        );
    else
        content = (
            <Menu as="div" className="relative">
                <Menu.Button className="flex items-center text-gray-500">
                    <EllipsisHorizontalIcon className="h-6 w-6 stroke-gray-500 hover:stroke-gray-700 active:stroke-gray-900" />
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
                                    onClick={onClickEdit}
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
                                    onClick={onClickDelete}
                                >
                                    Delete
                                </div>
                            )}
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
        );

    return content;
};

export default PostEditMenu;
