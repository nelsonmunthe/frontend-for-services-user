import authSlice from "./auth-slice";
const { configureStore } = require("@reduxjs/toolkit");

const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    }
});

export default store;