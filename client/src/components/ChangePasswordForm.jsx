import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useChangePasswordMutation } from "../features/user/userApiSlice";
import { Error, Spinner } from ".";

const ChangePasswordForm = () => {
    const currentUser = useSelector(selectCurrentUser);

    const [password, setPassword] = useState("");
    const onPasswordChanged = (e) => setPassword(e.target.value);

    const [newPassword, setNewPassword] = useState("");
    const onNewPasswordChanged = (e) => setNewPassword(e.target.value);

    const [confirmPassword, setConfirmPassword] = useState("");
    const onConfirmPasswordChanged = (e) => setConfirmPassword(e.target.value);

    const canChangePassword = Boolean(password && newPassword && confirmPassword);

    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const [error, setError] = useState();

    const clearFormData = () => {
        setError(null);

        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        try {
            await changePassword({ userId: currentUser._id, password, newPassword, confirmPassword }).unwrap();

            clearFormData();
        } catch (error) {
            console.log(error);
            setError(error);
        }
    };

    const content = (
        <form action="submit" onSubmit={handleChangePassword}>
            <h2 className="text-xl text-gray-700">Account Security</h2>

            <div className="mt-3">
                <label className="text-sm text-gray-700" htmlFor="password">
                    Password
                </label>
                <input
                    className="h-8 min-w-full rounded-md border border-gray-300 py-1 px-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    id="password"
                    type={"password"}
                    value={password}
                    onChange={onPasswordChanged}
                />
            </div>

            <div className="mt-3">
                <label className="text-sm text-gray-700" htmlFor="newPassword">
                    New Password
                </label>
                <input
                    className="h-8 min-w-full rounded-md border border-gray-300 py-1 px-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    id="newPassword"
                    type={"password"}
                    value={newPassword}
                    onChange={onNewPasswordChanged}
                />
            </div>

            <div className="mt-3">
                <label className="text-sm text-gray-700" htmlFor="confirmPassword">
                    Confirm Password
                </label>
                <input
                    className="h-8 min-w-full rounded-md border border-gray-300 py-1 px-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    id="confirmPassword"
                    type={"password"}
                    value={confirmPassword}
                    onChange={onConfirmPasswordChanged}
                />
            </div>

            <div className="mt-5 flex items-center justify-end space-x-3 text-gray-500">
                {isLoading && <Spinner />}
                <button
                    className="h-8 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-300 enabled:bg-indigo-500 enabled:hover:bg-indigo-700 enabled:active:bg-indigo-900 disabled:bg-gray-300"
                    disabled={!canChangePassword}
                >
                    Change password
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

export default ChangePasswordForm;
