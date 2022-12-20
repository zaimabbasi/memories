import { Outlet, Navigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import useAuth from "../hooks/useAuth";

const ProtectedLayout = () => {
    const auth = useAuth();
    const location = useLocation();

    if (!auth.userId) return <Navigate to="login" state={{ from: location }} replace />;

    return (
        <>
            <Navbar />
            <section className="mx-auto max-w-7xl px-3">
                <Outlet />
            </section>
        </>
    );
};

export default ProtectedLayout;
