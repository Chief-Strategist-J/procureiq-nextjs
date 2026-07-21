import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AsyncState, createAsyncState } from '@/shared/types/asyncState';

export interface OperatingHours {
  id: number;
  name: string;
  timezone: string;
}

export interface ServiceTerritory {
  id: number;
  name: string;
  operatingHoursId: number;
  isActive: boolean;
}

export interface ServiceResource {
  id: number;
  name: string;
  resourceType: string;
  isActive: boolean;
}

export interface ServiceAppointment {
  id: number;
  parentId: number;
  parentType: string;
  status: string;
  earliestStartPermitted?: string;
  dueDate?: string;
  duration?: number;
  arrivalWindowStart?: string;
  arrivalWindowEnd?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  assignedResourceId?: number;
}

export interface FieldServiceState {
  operatingHours: AsyncState<OperatingHours[]>;
  territories: AsyncState<ServiceTerritory[]>;
  resources: AsyncState<ServiceResource[]>;
  appointments: AsyncState<ServiceAppointment[]>;
}

const initialState: FieldServiceState = {
  operatingHours: createAsyncState([]),
  territories: createAsyncState([]),
  resources: createAsyncState([]),
  appointments: createAsyncState([]),
};

const fieldServiceSlice = createSlice({
  name: 'fieldService',
  initialState,
  reducers: {
    fetchOperatingHoursRequest(state) { state.operatingHours.status = 'loading'; state.operatingHours.error = null; },
    fetchOperatingHoursSuccess(state, action: PayloadAction<OperatingHours[]>) { state.operatingHours.status = 'succeeded'; state.operatingHours.data = action.payload; },
    fetchOperatingHoursFailure(state, action: PayloadAction<string>) { state.operatingHours.status = 'failed'; state.operatingHours.error = action.payload; },

    fetchTerritoriesRequest(state) { state.territories.status = 'loading'; state.territories.error = null; },
    fetchTerritoriesSuccess(state, action: PayloadAction<ServiceTerritory[]>) { state.territories.status = 'succeeded'; state.territories.data = action.payload; },
    fetchTerritoriesFailure(state, action: PayloadAction<string>) { state.territories.status = 'failed'; state.territories.error = action.payload; },

    fetchResourcesRequest(state) { state.resources.status = 'loading'; state.resources.error = null; },
    fetchResourcesSuccess(state, action: PayloadAction<ServiceResource[]>) { state.resources.status = 'succeeded'; state.resources.data = action.payload; },
    fetchResourcesFailure(state, action: PayloadAction<string>) { state.resources.status = 'failed'; state.resources.error = action.payload; },

    fetchAppointmentsRequest(state) { state.appointments.status = 'loading'; state.appointments.error = null; },
    fetchAppointmentsSuccess(state, action: PayloadAction<ServiceAppointment[]>) { state.appointments.status = 'succeeded'; state.appointments.data = action.payload; },
    fetchAppointmentsFailure(state, action: PayloadAction<string>) { state.appointments.status = 'failed'; state.appointments.error = action.payload; },

    assignResourceRequest(state, _action: PayloadAction<{ appointmentId: number; resourceId: number }>) { state.appointments.status = 'loading'; },
    assignResourceSuccess(state) { state.appointments.status = 'succeeded'; },
    assignResourceFailure(state, action: PayloadAction<string>) { state.appointments.status = 'failed'; state.appointments.error = action.payload; },
  },
});

export const fieldServiceActions = fieldServiceSlice.actions;
export default fieldServiceSlice.reducer;
