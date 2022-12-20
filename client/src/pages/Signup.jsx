import { Link } from "react-router-dom";
import { SignupForm } from "../components";
import useTitle from "../hooks/useTitle";

const SignUp = () => {
    useTitle("Sign Up - Memories");

    const content = (
        <section className="mx-auto max-w-7xl px-3">
            <div className="flex h-screen flex-col items-center justify-center">
                <div className="container min-w-min max-w-md">
                    <h1 className="text-center text-5xl font-semibold text-gray-900">Memories</h1>

                    <div className="mt-7 rounded-md border bg-white p-7 shadow-md">
                        <h2 className="text-xl text-gray-700">Sign up for a new account</h2>
                        <SignupForm />
                    </div>

                    <div className="mt-5 flex items-center justify-center rounded-md border bg-white p-5 shadow-md">
                        <span className="text-sm text-gray-700">
                            Already have an account?{" "}
                            <Link
                                className="font-medium text-indigo-700 hover:text-indigo-900 hover:underline focus:outline-none"
                                to="/login"
                                replace
                            >
                                Log in
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );

    return content;
};

export default SignUp;
