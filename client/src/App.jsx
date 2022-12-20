import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Explore, Home, Login, PostCreate, PostEdit, PostView, Settings, Signup, User } from "./pages";
import { Layout, ProtectedLayout } from "./components";

const App = () => {
    const location = useLocation();

    const content = (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* protected routes */}
                <Route path="/" element={<ProtectedLayout />}>
                    {/* Home page */}
                    <Route index element={<Home />} />
                    {/* Explore page */}
                    <Route path="explore" element={<Explore />} />

                    {/* User routes */}
                    <Route path="user">
                        {/* User profile page */}
                        <Route path=":userId" element={<User />} />
                        {/* User settings page */}
                        <Route path="settings" element={<Settings />} />
                    </Route>

                    {/* Post routes */}
                    <Route path="post">
                        {/* Post view page */}
                        <Route path=":postId" element={<PostView />} />
                        {/* Post create page */}
                        <Route path="create" element={<PostCreate />} />

                        {/* Post edit routes */}
                        <Route path="edit">
                            {/* Post edit page */}
                            <Route path=":postId" element={<PostEdit />} />
                        </Route>
                    </Route>
                </Route>

                {/**public routes */}
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />

                {/**invalid routes */}
                <Route path="*" element={<Navigate to="/" state={{ from: location }} replace />} />
            </Route>
        </Routes>
    );

    return content;
};

export default App;
