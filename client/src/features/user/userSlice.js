import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: { currentUser: null },
    reducers: {
        setUser: {
            reducer(state, action) {
                const { user } = action.payload;
                state.currentUser = user;
            },
            prepare(user) {
                return {
                    payload: { user }
                };
            }
        },
        clearUser: (state) => {
            state.currentUser = null;
        }
    }
});

export const selectCurrentUser = (state) => state.user.currentUser;

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
