import { createSlice } from '@reduxjs/toolkit';

export interface ModeState {
  currentMode: 'user' | 'business';
}

const getInitialMode = (): 'user' | 'business' => {
  if (typeof window !== 'undefined') {
    const storedMode = localStorage.getItem('currentMode');
    if (storedMode === 'user' || storedMode === 'business') {
      return storedMode;
    }
  }
  return 'user';
};

const initialState: ModeState = {
  currentMode: getInitialMode(),
};

const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.currentMode = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentMode', action.payload);
      }
    },
    toggleMode: (state) => {
      state.currentMode = state.currentMode === 'user' ? 'business' : 'user';
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentMode', state.currentMode);
      }
    },
  },
});

export const { setMode, toggleMode } = modeSlice.actions;
export default modeSlice.reducer;
