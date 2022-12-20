import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: { accessToken: null },
    reducers: {
        setCredentials: {
            reducer(state, action) {
                const { accessToken } = action.payload;
                state.accessToken = accessToken;
            },
            prepare(accessToken) {
                return {
                    payload: { accessToken }
                };
            }
        },
        logOut: (state) => {
            state.accessToken = null;
        }
    }
});

export const selectAccessToken = (state) => state.auth.accessToken;

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
