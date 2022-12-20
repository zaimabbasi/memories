import { configureStore } from "@reduxjs/toolkit";
import apiSlice from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        user: userReducer
    },
    middleware: (defaultMiddleware) => defaultMiddleware().concat(apiSlice.middleware)
});

export default store;
