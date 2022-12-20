import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { selectCurrentUser } from "../features/user/userSlice";
import { useDeleteUserMutation } from "../features/user/userApiSlice";
import { Error, Spinner } from ".";

const DeleteUserDialog = ({ open, setOpen }) => {
    const currentUser = useSelector(selectCurrentUser);

    const [deleteUser, { isLoading }] = useDeleteUserMutation();
    const [error, setError] = useState("");

    const [password, setPassword] = useState("");
    const onPasswordChanged = (e) => setPassword(e.target.value);

    const canDeleteUser = Boolean(password);

    const handleDeleteUser = async (e) => {
        e.preventDefault();

        try {
            await deleteUser({ userId: currentUser._id, password }).unwrap();

            setError(null);
            setOpen(false);
        } catch (error) {
            console.log(error);
            setError(error);
        }
    };

    const content = (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-md transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-700">
                                    Delete account
                                </Dialog.Title>
                                <div className="mt-3">
                                    <p className="text-sm text-gray-500">
                                        Are you sure you want to delete your account? All of your data will be
                                        permanently removed. This action cannot be undone.
                                    </p>
                                </div>

                                <form action="submit" onSubmit={handleDeleteUser}>
                                    <div className="mt-3">
                                        <input
                                            className="h-8 w-full rounded-md border border-gray-300 py-1 px-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                                            id="password"
                                            type={"password"}
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={onPasswordChanged}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="mt-5 flex h-8 min-w-full items-center justify-center rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-indigo-300 enabled:bg-indigo-500 enabled:hover:bg-indigo-700 enabled:focus:ring-1 enabled:active:bg-indigo-900 disabled:bg-gray-300 "
                                        disabled={!canDeleteUser}
                                    >
                                        {isLoading ? <Spinner /> : "Yes, delete my account!"}
                                    </button>

                                    {error && (
                                        <div className="mt-5">
                                            <Error message={error?.data?.message || error?.error} />
                                        </div>
                                    )}
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );

    return content;
};

export default DeleteUserDialog;
