import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../features/auth/authApiSlice";
import { Error, Spinner } from ".";

const LoginForm = () => {
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();
    const [error, setError] = useState();

    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const onUsernameOrEmailChanged = (e) => setUsernameOrEmail(e.target.value);

    const [password, setPassword] = useState("");
    const onPasswordChanged = (e) => setPassword(e.target.value);

    const handleLogin = async (e) => {
        e.preventDefault();

        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail);

        try {
            await login({
                username: isValidEmail ? "" : usernameOrEmail,
                email: isValidEmail ? usernameOrEmail : "",
                password
            }).unwrap();

            setError(null);
            navigate("/", { replace: true });
        } catch (error) {
            console.log(error);
            setError(error);
        }
    };

    const content = (
        <form className="mt-5" action="submit" onSubmit={handleLogin}>
            <div>
                <label className="text-sm text-gray-700" htmlFor="usernameOrEmail">
                    Username or email address
                </label>
                <input
                    className="h-8 min-w-full rounded-md border border-gray-300 py-1 px-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    id="usernameOrEmail"
                    type="text"
                    value={usernameOrEmail}
                    onChange={onUsernameOrEmailChanged}
                    required
                    autoFocus
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

            <button
                className="mt-5 flex h-8 min-w-full items-center justify-center rounded-md bg-indigo-500 px-2 py-1 text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-300 active:bg-indigo-900"
                disabled={isLoading}
            >
                {isLoading ? <Spinner /> : "Log in"}
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

export default LoginForm;
