import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "../../common/store/modalSlice";
import boardReducer from "../../common/store/boardSlice";
import listReducer from "../../common/store/listSlice";
import homeReducer from "../../common/store/homeSlice";

export const store = configureStore({
    reducer: {
        modal: modalReducer,
        home: homeReducer,
        board: boardReducer,
        list: listReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;