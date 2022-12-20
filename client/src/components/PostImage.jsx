import { Link } from "react-router-dom";

const PostImage = ({ postId, postImage }) => {
    let content;

    if (postId)
        content = (
            <Link to={`/post/${postId}`}>
                <img className="w-full rounded-sm hover:opacity-90" src={postImage} alt="" />
            </Link>
        );
    else content = <img className="w-full rounded-sm" src={postImage} alt="" />;

    return content;
};

export default PostImage;
