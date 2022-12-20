import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import userImage from "../assets/user-image.png";

const useUserImage = () => {
    const currentUser = useSelector(selectCurrentUser);

    return currentUser.image ?? userImage;
};

export default useUserImage;
