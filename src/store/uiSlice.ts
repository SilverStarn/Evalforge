import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  keyboardMode: boolean;
  activeDraftTaskId?: string;
}

const initialState: UiState = {
  sidebarOpen: false,
  keyboardMode: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setKeyboardMode(state, action: { payload: boolean }) {
      state.keyboardMode = action.payload;
    },
    setActiveDraftTaskId(state, action: { payload: string | undefined }) {
      state.activeDraftTaskId = action.payload;
    },
  },
});

export const { setActiveDraftTaskId, setKeyboardMode, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
