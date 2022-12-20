import { Link } from "react-router-dom";
import userImage from "../assets/user-image.png";

const PostAuthor = ({ authorId, authorUsername, authorImage }) => {
    const content = (
        <Link className="font-medium text-gray-900" to={`/user/${authorId}`}>
            <img className="mr-3 inline h-8 w-8 rounded-full" src={authorImage ?? userImage} alt="" />
            {authorUsername}
        </Link>
    );

    return content;
};

export default PostAuthor;
