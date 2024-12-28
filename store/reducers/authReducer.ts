import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user_id: string;
  username: string;
  email: string;
  profile_pic: string;
  access_token: string;
}

// Initialize state with local storage if available
const initialState: AuthState = {
  isAuthenticated: false,
  user_id: '',
  username: '',
  email: '',
  profile_pic: '',
  access_token: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ client_id: string; access: string; usernane: string; email: string ; profile_pic: string }>) {
      const { access, usernane, client_id, email, profile_pic } = action.payload;
      state.isAuthenticated = true;
      state.access_token = access;
      state.user_id = client_id;
      state.username = usernane;
      state.email = email;
      state.profile_pic = profile_pic;

      // Persist state to local storage
      window.localStorage.setItem('authState', JSON.stringify(state));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.access_token = '';
      state.user_id = '';
      state.username = '';
      state.email = '';
      state.profile_pic = '';

      // Clear local storage
      window.localStorage.removeItem('authState');
    },
    loadAuthState(state) {
      const storedState = window.localStorage.getItem('authState');
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        state.isAuthenticated = parsedState.isAuthenticated;
        state.user_id = parsedState.user_id;
        state.access_token = parsedState.access_token;
        state.username = parsedState.username;
        state.email = parsedState.email;
        state.profile_pic = parsedState.profile_pic;
      }
    },
  },
});

export const { login, logout, loadAuthState } = authSlice.actions;
export default authSlice.reducer;