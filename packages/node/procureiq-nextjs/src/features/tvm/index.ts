export { TvmStudio } from './ui/TvmStudio';
export { useTvmManagement } from './hooks/use-tvm-management';
export { tvmSlice, tvmActions } from './store/tvm-slice';
export { tvmSaga } from './store/tvm-saga';
export type { TvmParams, TimesfmForecastData, TvmState } from './store/tvm-slice';

import { featureRegistry } from '@/core/store/feature-registry';
import { tvmSlice } from './store/tvm-slice';
import { tvmSaga } from './store/tvm-saga';

featureRegistry.register('tvm', {
  reducer: tvmSlice.reducer,
  saga: tvmSaga,
});
