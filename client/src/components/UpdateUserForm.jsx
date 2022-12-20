import { useState } from "react";
import { useSelector } from "react-redux";
import { UserIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { useUpdateUserMutation } from "../features/user/userApiSlice";
import { selectCurrentUser } from "../features/user/userSlice";
import { Error, Spinner } from ".";
import useUserImage from "../hooks/useUserImage";

const UpdateUserForm = () => {
    const currentUser = useSelector(selectCurrentUser);
    const userImage = useUserImage();

    const [previewImage, setPreviewImage] = useState(userImage);
    const [newProfileImage, setNewProfileImage] = useState();

    const [username, setUsername] = useState(currentUser.username);
    const onUsernameChanged = (e) => setUsername(e.target.value);

    const [email, setEmail] = useState(currentUser.email);
    const onEmailChanged = (e) => setEmail(e.target.value);

    const canUpdateUser = Boolean(
        newProfileImage || (username && username !== currentUser.username) || (email && email !== currentUser.email)
    );

    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const [error, setError] = useState();

    const handleFileInput = (e) => {
        const file = e.target.files[0];

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            setPreviewImage(fileReader.result);
        };

        setNewProfileImage(file);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("username", username !== currentUser.username ? username.trim() : "");
        formData.append("email", email !== currentUser.email ? email.trim() : "");
        formData.append(newProfileImage?.name, newProfileImage);

        try {
            await updateUser({ userId: currentUser._id, user: formData }).unwrap();

            setError(null);
            setNewProfileImage(null);
        } catch (error) {
            console.log(error);
            setError(error);
        }
    };

    const content = (
        <form action="submit" onSubmit={handleUpdateUser}>
            <h2 className="text-xl text-gray-700">Profile Information</h2>

            <div className="mt-3 flex items-center justify-between space-x-11">
                <label className="relative block w-fit rounded-full border-2 border-dashed border-gray-300 hover:border-gray-500">
                    <img className="h-20 w-20 rounded-full sm:h-24 sm:w-24" src={previewImage} alt="" />
                    <input
                        className="absolute inset-y-0 w-full cursor-pointer opacity-0"
                        type={"file"}
                        onChange={handleFileInput}
                    />
                </label>

                <div className="grow">
                    <div className="flex items-center space-x-3 text-gray-700">
                        <UserIcon className="h-5 w-5" />
                        <p className="text-xl font-medium ">{currentUser.username}</p>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                        <EnvelopeIcon className="h-5 w-5" />
                        <p className="">{currentUser.email}</p>
                    </div>
                </div>
            </div>

            <div className="mt-3">
                <label className="text-sm text-gray-700" htmlFor="username">
                    Username
                </label>
                <input
                    className="h-8 min-w-full rounded-md border border-gray-300 py-1 px-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    id="username"
                    type={"text"}
                    value={username}
                    onChange={onUsernameChanged}
                />
            </div>

            <div className="mt-3">
                <label className="text-sm text-gray-700" htmlFor="email">
                    Email
                </label>
                <input
                    className="h-8 min-w-full rounded-md border border-gray-300 py-1 px-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    id="email"
                    value={email}
                    onChange={onEmailChanged}
                />
            </div>

            <div className="mt-5 flex items-center justify-end space-x-3 text-gray-500">
                {isLoading && <Spinner />}
                <button
                    className="h-8 rounded-md py-1 px-2 text-sm text-white focus:outline-none focus:ring-indigo-300 enabled:bg-indigo-500 enabled:hover:bg-indigo-700 enabled:focus:ring-1 enabled:active:bg-indigo-900 disabled:bg-gray-300"
                    disabled={!canUpdateUser}
                >
                    Update profile
                </button>
            </div>

            {error && (
                <div className="mt-5">
                    <Error message={error?.data?.message || error?.error} />
                </div>
            )}
        </form>
    );

    return content;
};

export default UpdateUserForm;
