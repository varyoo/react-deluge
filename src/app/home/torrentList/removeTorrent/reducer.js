import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    visible: false,
};

const slice = createSlice({
    name: "remove_torrent",
    initialState,
    reducers: {
        open(state, { payload }) {
            state.hashToRemove = payload;
            state.visible = true;
        },
        close(state, { payload }) {
            state.hashToRemove = undefined;
            state.visible = false;
        },
    }
})

export const { open, close } = slice.actions;
export default slice.reducer;