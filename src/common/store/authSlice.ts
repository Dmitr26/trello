import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/request';

interface AuthState {
    isPasswordWrong: boolean
}

const initialState: AuthState = {
    isPasswordWrong: false
};

type UserData = {
    email: string;
    password: string;
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }: UserData) => {
        try {
            const response = await api.post('/login', {
                email: email,
                password: password
            });
            return response.data;
        } catch (error) {
            throw new Error();
        }
    }
);

export const createUser = createAsyncThunk(
    'auth/createUser',
    async ({ email, password }: UserData, thunkAPI) => {
        try {
            const postUser = await api.post('/user', {
                email: email,
                password: password
            });
            if (postUser.data.result === 'Created') {
                await thunkAPI.dispatch<any>(loginUser({ email: email, password: password }));
            }
        } catch (error) {
            throw new Error();
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        passwordWrong: (state) => {
            state.isPasswordWrong = true;
        },
        passwordNotWrong: (state) => {
            state.isPasswordWrong = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.fulfilled, (state, action) => {
            const result = action.payload;
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('refreshToken', result.refreshToken);
        });
    },
});

export const { passwordWrong, passwordNotWrong } = authSlice.actions;
export default authSlice.reducer;