import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { useAuthManagement } from '@/features/auth';
import { tvmActions, TvmParams } from '../store/tvm-slice';

export function useTvmManagement() {
  const dispatch = useAppDispatch();
  const { user } = useAuthManagement();

  const params = useAppSelector((state) => state.tvm?.params ?? {
    statedRate: 0.08,
    frequency: 12,
    horizon: 12,
    calculationType: 'ORDINARY_ANNUITY',
    pmt: 150,
    years: 5.0,
  });

  const forecastData = useAppSelector((state) => state.tvm?.forecastData ?? null);
  const status = useAppSelector((state) => state.tvm?.status ?? 'idle');
  const error = useAppSelector((state) => state.tvm?.error ?? null);

  const isAccountantAuthorized =
    user?.role === 'accountant' ||
    user?.role === 'admin' ||
    user?.roles?.some((r) => ['accountant', 'admin'].includes(r));

  const updateParams = (newParams: Partial<TvmParams>) => {
    dispatch(tvmActions.setParams(newParams));
  };

  const triggerForecast = () => {
    if (!isAccountantAuthorized) return;
    dispatch(
      tvmActions.fetchForecastStart()
    );
  };

  useEffect(() => {
    if (isAccountantAuthorized) {
      dispatch(tvmActions.fetchForecastStart());
    }
  }, [
    isAccountantAuthorized,
    params.statedRate,
    params.frequency,
    params.horizon,
    params.calculationType,
    params.pmt,
    params.years,
    dispatch,
  ]);

  return {
    params,
    forecastData,
    status,
    isLoading: status === 'loading',
    error,
    isAccountantAuthorized,
    updateParams,
    triggerForecast,
  };
}
