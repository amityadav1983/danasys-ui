import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  cartPanel: false,
  themeColor: '#349FDE' // default
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showCart: (state) => {
      state.cartPanel = true;
    },
    hideCart: (state) => {
      state.cartPanel = false;
    },
    setThemeColor: (state, action: PayloadAction<string>) => {
      state.themeColor = action.payload;
    }
  },
})

export default uiSlice.reducer;
export const { showCart, hideCart, setThemeColor } = uiSlice.actions;
