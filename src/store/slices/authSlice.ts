import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { clearNotificationsState } from './notificationsSlice';

export const AUTH_TOKEN_KEY = '@interviewtask/auth_token';

export const hydrateAuth = createAsyncThunk('auth/hydrate', async (_, { dispatch }) => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      dispatch(setToken(token));
    }
  } finally {
    dispatch(setHydrated(true));
  }
});

export const persistToken = createAsyncThunk(
  'auth/persistToken',
  async (token: string, { dispatch }) => {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    dispatch(setToken(token));
  },
);

export const clearPersistedAuth = createAsyncThunk(
  'auth/clearPersisted',
  async (_, { dispatch }) => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    dispatch(clearNotificationsState());
    dispatch(clearAuth());
  },
);

type AuthState = {
  token: string | null;
  isHydrated: boolean;
};

const initialState: AuthState = {
  token: null,
  isHydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    clearAuth(state) {
      state.token = null;
    },
    setHydrated(state, action: PayloadAction<boolean>) {
      state.isHydrated = action.payload;
    },
  },
});

export const { setToken, clearAuth, setHydrated } = authSlice.actions;
export default authSlice.reducer;
