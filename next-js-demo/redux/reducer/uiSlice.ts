import { createSlice } from '@reduxjs/toolkit';

interface UIState {
	isMobile: boolean | null;
	loading: boolean;
}

const initialState = {
	isMobile: null,
	loading: false,
} as UIState;

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		setIsMobile(state, action) {
			const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
			state.isMobile = isMobile;
		},
		setLoading(state, action) {
			state.loading = action.payload;
		},
	},
});

export const { setIsMobile, setLoading } = uiSlice.actions;

export default uiSlice.reducer;
