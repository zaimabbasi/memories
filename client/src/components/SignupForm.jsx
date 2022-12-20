import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateNewUserMutation } from "../features/user/userApiSlice";
import { Error, Spinner } from ".";

const SignupForm = () => {
    const navigate = useNavigate();

    const [createNewUser, { isLoading }] = useCreateNewUserMutation();
    const [error, setError] = useState();

    const [username, setUsername] = useState("");
    const onUsernameChanged = (e) => setUsername(e.target.value);

    const [email, setEmail] = useState("");
    const onEmailChanged = (e) => setEmail(e.target.value);

    const [password, setPassword] = useState("");
    const onPasswordChanged = (e) => setPassword(e.target.value);

    const [confirmPassword, setConfirmPassword] = useState("");
    const onConfirmPasswordChanged = (e) => setConfirmPassword(e.target.value);

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            await createNewUser({ username, email, password, confirmPassword }).unwrap();

            setError(null);
            navigate("/login", { replace: true });
        } catch (error) {
            console.log(error);
            setError(error);
        }
    };

    const content = (
        <form className="mt-5" action="submit" onSubmit={handleSignup}>
            <div>
                <label className="text-sm text-gray-700" htmlFor="username">
                    Username
                </label>
                <input
                    className="h-8 min-w-full rounded-md border border-gray-300 py-1 px-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    id="username"
                    type="text"
                    value={username}
                    onChange={onUsernameChanged}
                    required
                    autoFocus
                />
            </div>

            <div className="mt-3">
                <label className="text-sm text-gray-700" htmlFor="email">
                    Email address
                </label>
                <input
                    className="h-8 min-w-full rounded-md border border-gray-300 py-1 px-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    id="email"
                    type="email"
                    value={email}
                    onChange={onEmailChanged}
                    required
                />
            </div>

            <div className="mt-3">
                <label className="text-sm text-gray-700" htmlFor="password">
                    Password
                </label>
                <input
                    className="h-8 min-w-full rounded-md border border-gray-300 py-1 px-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    id="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                    required
                />
            </div>

            <div className="mt-3">
                <label className="text-sm text-gray-700" htmlFor="confirmPassword">
                    Confirm password
                </label>
                <input
                    className="h-8 min-w-full rounded-md border border-gray-300 py-1 px-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={onConfirmPasswordChanged}
                    required
                />
            </div>

            <button
                className="mt-5 flex h-8 min-w-full items-center justify-center rounded-md bg-indigo-500 px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-300 enabled:hover:bg-indigo-700 enabled:active:bg-indigo-900"
                disabled={isLoading}
            >
                {isLoading ? <Spinner /> : "Sign up"}
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

export default SignupForm;
