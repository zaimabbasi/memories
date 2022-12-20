import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { selectAccessToken } from "../features/auth/authSlice";

const useAuth = () => {
    const accessToken = useSelector(selectAccessToken);

    if (accessToken) {
        const decoded = jwtDecode(accessToken);
        return { userId: decoded.id };
    }

    return { userId: null };
};

export default useAuth;
