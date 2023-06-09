import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import useSWR from 'swr';

export const getUserData = createAsyncThunk(
	'user/getUserData',
	async (_, { rejectWithValue }) => {
		try {
			const token = localStorage.token;
			const res = await fetch('http://localhost:4000/profile', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${token}`,
				},
			});

			// TODO: Change API to output 400 Error for missing authorizazion
			// if (res.status !== 200) {
			// 	return { success: false, data: null };
			// }

			const userData = await res.json();

			// FIXME: Current workaround
			if (userData.message == 'Authorization Error') {
				return rejectWithValue('token not valid');
			}

			return userData;
		} catch (error: Error | any) {
			toast.error('API not responding');
			return rejectWithValue(error.stack.toString());
		}
	}
);

export const loginUser = createAsyncThunk(
	'user/loginUser',
	async (formData: { email: string; password: string }, { rejectWithValue }) => {
		try {
			const res = await fetch('http://localhost:4000/auth/login/email', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const userData = await res.json();
			return userData;
		} catch (error: Error | any) {
			toast.error('API not responding');
			return rejectWithValue(error.stack.toString());
		}
	}
);

export const registerUser = createAsyncThunk(
	'user/registerUser',
	async (
		formData: { name: string; email: string; password: string },
		{ rejectWithValue }
	) => {
		try {
			const res = await fetch('http://localhost:4000/auth/register/email', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			// TODO: Change API to output valid JSON error message to check if user already exists
			// if (res.error) {
			// 	return rejectWithValue(res.error.message);
			// }

			// FIXME: Current workaround
			if (!res.ok) {
				return rejectWithValue('already in database');
			}

			const userData = await res.json();
			return userData;
		} catch (error: Error | any) {
			toast.error('API not responding');
			return rejectWithValue(error.stack.toString());
		}
	}
);

interface UserState {
	isAuthenticated: boolean;
	isPremiumMember: boolean;
	userData: {
		_id: string;
		name: string;
		profilePicture: string;
		email: string;
	} | null;
}

const initialState = {
	isAuthenticated: false,
	isPremiumMember: false,
	userData: null,
} as UserState;

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logoutUser(state) {
			state.isAuthenticated = false;
			state.userData = null;
			state.isPremiumMember = false;

			localStorage.removeItem('token');
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getUserData.fulfilled, (state, action) => {
			state.userData = action.payload;
			state.isAuthenticated = true;
		});
		builder.addCase(loginUser.fulfilled, (state, action) => {
			state.userData = action.payload.user;
			state.isAuthenticated = true;
			localStorage.setItem('token', 'Bearer ' + action.payload.authToken);
		});
		builder.addCase(registerUser.fulfilled, (state, action) => {
			localStorage.setItem('token', 'Bearer ' + action.payload.token);
		});
	},
});

export const { logoutUser } = userSlice.actions;

export default userSlice.reducer;
