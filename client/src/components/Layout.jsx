import { Outlet } from "react-router-dom";

const Layout = () => {
    const content = (
        <div className="app">
            <Outlet />
        </div>
    );

    return content;
};

export default Layout;
