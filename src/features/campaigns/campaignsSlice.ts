import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AsyncState, createAsyncState } from '@/shared/types/asyncState';

export interface Campaign {
  id: number;
  orgId: number;
  name: string;
  status: string;
}

export interface Recipient {
  id: number;
  accountId: number;
  name: string;
  email?: string;
  phone?: string;
}

export interface CampaignSchedule {
  id: number;
  orgId?: number;
  campaignId?: number;
  contactId?: number;
  scheduledAt: string;
  status?: string;
}

export interface CampaignsState {
  campaigns: AsyncState<Campaign[]>;
  recipients: AsyncState<Recipient[]>;
  schedules: AsyncState<CampaignSchedule[]>;
}

const initialState: CampaignsState = {
  campaigns: createAsyncState([]),
  recipients: createAsyncState([]),
  schedules: createAsyncState([]),
};

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    // --- Campaigns ---
    fetchCampaignsRequest(state) {
      state.campaigns.status = 'loading';
      state.campaigns.error = null;
    },
    fetchCampaignsSuccess(state, action: PayloadAction<Campaign[]>) {
      state.campaigns.status = 'succeeded';
      state.campaigns.data = action.payload;
    },
    fetchCampaignsFailure(state, action: PayloadAction<string>) {
      state.campaigns.status = 'failed';
      state.campaigns.error = action.payload;
    },
    createCampaignRequest(state, _action: PayloadAction<Omit<Campaign, 'id'>>) {
      state.campaigns.status = 'loading';
    },
    createCampaignSuccess(state, action: PayloadAction<Campaign>) {
      state.campaigns.status = 'succeeded';
      state.campaigns.data.push(action.payload);
    },
    createCampaignFailure(state, action: PayloadAction<string>) {
      state.campaigns.status = 'failed';
      state.campaigns.error = action.payload;
    },
    updateCampaignRequest(state, _action: PayloadAction<{ id: number; data: Omit<Campaign, 'id'> }>) {
      state.campaigns.status = 'loading';
    },
    updateCampaignSuccess(state, action: PayloadAction<Campaign>) {
      state.campaigns.status = 'succeeded';
      state.campaigns.data = state.campaigns.data.map(c =>
        c.id === action.payload.id ? action.payload : c
      );
    },
    updateCampaignFailure(state, action: PayloadAction<string>) {
      state.campaigns.status = 'failed';
      state.campaigns.error = action.payload;
    },
    deleteCampaignRequest(state, _action: PayloadAction<number>) {
      state.campaigns.status = 'loading';
    },
    deleteCampaignSuccess(state, action: PayloadAction<number>) {
      state.campaigns.status = 'succeeded';
      state.campaigns.data = state.campaigns.data.filter(c => c.id !== action.payload);
    },
    deleteCampaignFailure(state, action: PayloadAction<string>) {
      state.campaigns.status = 'failed';
      state.campaigns.error = action.payload;
    },

    // --- Recipients ---
    fetchRecipientsRequest(state) {
      state.recipients.status = 'loading';
      state.recipients.error = null;
    },
    fetchRecipientsSuccess(state, action: PayloadAction<Recipient[]>) {
      state.recipients.status = 'succeeded';
      state.recipients.data = action.payload;
    },
    fetchRecipientsFailure(state, action: PayloadAction<string>) {
      state.recipients.status = 'failed';
      state.recipients.error = action.payload;
    },

    // --- Schedules ---
    fetchSchedulesRequest(state) {
      state.schedules.status = 'loading';
      state.schedules.error = null;
    },
    fetchSchedulesSuccess(state, action: PayloadAction<CampaignSchedule[]>) {
      state.schedules.status = 'succeeded';
      state.schedules.data = action.payload;
    },
    fetchSchedulesFailure(state, action: PayloadAction<string>) {
      state.schedules.status = 'failed';
      state.schedules.error = action.payload;
    },
  },
});

export const campaignsActions = campaignsSlice.actions;
export default campaignsSlice.reducer;
