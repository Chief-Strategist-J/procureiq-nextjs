import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TimesfmForecastData {
  eventId: string;
  timestamp: string;
  modelName: string;
  horizon: number;
  historicalData: number[];
  forecastPoint: number[];
  quantile10: number[];
  quantile90: number[];
  effectiveAnnualRate: number;
  riskFreeRate: number;
  inflationPremium: number;
  defaultPremium: number;
  liquidityPremium: number;
  maturityPremium: number;
  presentValue: number;
  futureValue: number;
  timeline: Array<{
    period: number;
    periodValue: number;
    discountFactor: number;
    compoundFactor: number;
  }>;
}

export interface TvmParams {
  statedRate: number;
  frequency: number;
  horizon: number;
  calculationType: string;
  pmt: number;
  years: number;
  currencySymbol: string;
  riskFreeRate?: number;
  inflationPremium?: number;
  defaultPremium?: number;
  liquidityPremium?: number;
  maturityPremium?: number;
}

export interface TvmState {
  params: TvmParams;
  forecastData: TimesfmForecastData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TvmState = {
  params: {
    statedRate: 0.08,
    frequency: 12,
    horizon: 12,
    calculationType: 'ORDINARY_ANNUITY',
    pmt: 150,
    years: 5.0,
    currencySymbol: '$',
    riskFreeRate: 0.025,
    inflationPremium: 0.020,
    defaultPremium: 0.015,
    liquidityPremium: 0.010,
    maturityPremium: 0.010,
  },
  forecastData: null,
  status: 'idle',
  error: null,
};

export const tvmSlice = createSlice({
  name: 'tvm',
  initialState,
  reducers: {
    setParams(state, action: PayloadAction<Partial<TvmParams>>) {
      state.params = { ...state.params, ...action.payload };
    },
    fetchForecastStart(state) {
      state.status = 'loading';
      state.error = null;
    },
    fetchForecastSuccess(state, action: PayloadAction<TimesfmForecastData>) {
      state.status = 'succeeded';
      state.forecastData = action.payload;
      state.error = null;
    },
    fetchForecastFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const tvmActions = tvmSlice.actions;
