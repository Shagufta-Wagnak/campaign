import { configureStore } from "@reduxjs/toolkit";
import dataSlice from "./dataSlice";
import thunk from "redux-thunk";

const store = configureStore({
    reducer: {
        data: dataSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
