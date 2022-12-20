import classNames from "../hooks/useClassNames";

const Error = ({ message }) => {
    return (
        <span
            className={classNames(
                message && "px-2 py-1",
                "flex items-center justify-center overflow-auto rounded-md bg-red-100 text-sm font-medium text-red-500"
            )}
        >
            {message}
        </span>
    );
};

export default Error;
