import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ChannelToggles = {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
};

export type NotificationPreferenceState = {
  mainEnabled: boolean;
  channels: ChannelToggles;
  /** Snapshot from API — restored when the main toggle is turned back on */
  apiChannels: ChannelToggles;
  displayText: string;
  description: string;
};

type NotificationsState = {
  byId: Record<string, NotificationPreferenceState>;
  orderedIds: string[];
};

const initialState: NotificationsState = {
  byId: {},
  orderedIds: [],
};

const emptyChannels = (): ChannelToggles => ({
  pushEnabled: false,
  emailEnabled: false,
  smsEnabled: false,
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    seedFromApi(
      state,
      action: PayloadAction<
        {
          id: string;
          enabled: boolean;
          pushEnabled: boolean;
          emailEnabled: boolean;
          smsEnabled: boolean;
          displayText: string;
          description: string;
        }[]
      >,
    ) {
      state.orderedIds = action.payload.map((r) => r.id);
      for (const row of action.payload) {
        const apiCh: ChannelToggles = {
          pushEnabled: row.pushEnabled,
          emailEnabled: row.emailEnabled,
          smsEnabled: row.smsEnabled,
        };
        state.byId[row.id] = {
          mainEnabled: row.enabled,
          channels: { ...apiCh },
          apiChannels: { ...apiCh },
          displayText: row.displayText,
          description: row.description,
        };
      }
    },
    setMainEnabled(state, action: PayloadAction<{ id: string; enabled: boolean }>) {
      const { id, enabled } = action.payload;
      const pref = state.byId[id];
      if (!pref) return;
      pref.mainEnabled = enabled;
      if (!enabled) {
        pref.channels = emptyChannels();
      } else {
        pref.channels = { ...pref.apiChannels };
      }
    },
    setChannel(
      state,
      action: PayloadAction<{ id: string; channel: keyof ChannelToggles; value: boolean }>,
    ) {
      const { id, channel, value } = action.payload;
      const pref = state.byId[id];
      if (!pref || !pref.mainEnabled) return;
      pref.channels[channel] = value;
    },
    clearNotificationsState() {
      return initialState;
    },
  },
});

export const { seedFromApi, setMainEnabled, setChannel, clearNotificationsState } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
