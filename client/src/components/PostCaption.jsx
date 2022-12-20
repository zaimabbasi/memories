import { Link } from "react-router-dom";

const PostCaption = ({ authorId, authorUsername, caption }) => {
    const content = (
        <div className="space-x-2 p-0.5 text-sm text-gray-900">
            <Link className="font-medium" to={`/user/${authorId}`}>
                {authorUsername}
            </Link>
            <span>{caption}</span>
        </div>
    );

    return content;
};

export default PostCaption;
