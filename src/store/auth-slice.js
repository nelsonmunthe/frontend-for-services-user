import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../api/axios";

export const setLogin = createAsyncThunk('/login', async(payload) => {
    try {
        const response = await axios.post(`/login`, payload, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return error.message
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {accessToken: null, status : 'loading', error: '', isLogin : false, role: null},
    reducers: {
        setToken : (state, action) => {
            state.accessToken = action.payload
        },
        setIsLogin : (state) => {
            state.isLogin = false
        },
        setEmail: (state, action) => {
            state.email = action.payload
        },
        setRole: (state, action) => {
            state.role = action.payload
        }
    },
    extraReducers(builder) {
        builder
        .addCase(setLogin.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(setLogin.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.accessToken = action?.payload?.data?.accessToken;
            state.role = action?.payload?.data?.payload?.original_name
            state.isLogin = true
        })
        .addCase(setLogin.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message
        })

    }
});

export const authActions = authSlice.actions;
export default authSlice;

