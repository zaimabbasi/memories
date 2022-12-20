import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { selectCurrentUser } from "../features/user/userSlice";
import { useDeleteUserMutation } from "../features/user/userApiSlice";
import { ChangePasswordForm, DeleteUserDialog, UpdateUserForm } from "../components";
import useTitle from "../hooks/useTitle";

const Settings = () => {
    useTitle("Settings - Memories");

    const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);

    const content = (
        <div className="my-3 mx-auto min-w-min max-w-xl">
            <div className="space-y-5 rounded-md border bg-white p-5 shadow-md">
                <UpdateUserForm />

                <ChangePasswordForm />

                <button
                    className="flex items-center text-sm font-medium text-indigo-700  hover:text-indigo-900 focus:outline-none"
                    onClick={() => setOpenDeleteAccountDialog(true)}
                >
                    I want to delete my account
                    <TrashIcon className="ml-1 h-5 w-5" />
                </button>

                <DeleteUserDialog open={openDeleteAccountDialog} setOpen={setOpenDeleteAccountDialog} />
            </div>
        </div>
    );

    return content;
};

export default Settings;
