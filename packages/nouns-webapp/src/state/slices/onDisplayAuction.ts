import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnDisplayAuctionState {
  lastAuctionUNounId: number | undefined;
  onDisplayAuctionUNounId: number | undefined;
}

const initialState: OnDisplayAuctionState = {
  lastAuctionUNounId: undefined,
  onDisplayAuctionUNounId: undefined,
};

const onDisplayAuction = createSlice({
  name: 'onDisplayAuction',
  initialState: initialState,
  reducers: {
    setLastAuctionUNounId: (state, action: PayloadAction<number>) => {
      state.lastAuctionUNounId = action.payload;
    },
    setOnDisplayAuctionUNounId: (state, action: PayloadAction<number>) => {
      state.onDisplayAuctionUNounId = action.payload;
    },
    setPrevOnDisplayAuctionUNounId: state => {
      if (!state.onDisplayAuctionUNounId) return;
      if (state.onDisplayAuctionUNounId === 0) return;
      state.onDisplayAuctionUNounId = state.onDisplayAuctionUNounId - 1;
    },
    setNextOnDisplayAuctionUNounId: state => {
      if (state.onDisplayAuctionUNounId === undefined) return;
      if (state.lastAuctionUNounId === state.onDisplayAuctionUNounId) return;
      state.onDisplayAuctionUNounId = state.onDisplayAuctionUNounId + 1;
    },
  },
});

export const {
  setLastAuctionUNounId,
  setOnDisplayAuctionUNounId,
  setPrevOnDisplayAuctionUNounId,
  setNextOnDisplayAuctionUNounId,
} = onDisplayAuction.actions;

export default onDisplayAuction.reducer;
