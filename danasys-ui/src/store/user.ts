import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserData {
  fullname: string;
  email: string;
  userProfilePicture: string;
  contactInfo: string;
  status: string;
  userWalletImage?: string;
  userWalletBalance?: number;
  roles?: string[];
  // Add other fields as needed from API
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null as UserData | null,
    isLoggedIn: false,
  },
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.data = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.data = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
