import type { EntitySchema } from '@/core/data-driven/entity-schema.types';
import { z } from 'zod';

export interface TvmEntity {
  id?: string;
  statedRate: number;
  frequency: number;
  horizon: number;
  calculationType: string;
  pmt: number;
  years: number;
  currencySymbol?: string;
  riskFreeRate?: number;
  inflationPremium?: number;
  defaultPremium?: number;
  liquidityPremium?: number;
  maturityPremium?: number;
}

export const tvmSchema: EntitySchema<TvmEntity> = {
  name: 'tvm',
  endpoint: '/api/v1/tvm-ai/forecast',
  validate: z.object({
    id: z.string().optional(),
    statedRate: z.number().min(0.001).max(0.50),
    frequency: z.number().int().min(0).max(365),
    horizon: z.number().int().min(1).max(120),
    calculationType: z.string(),
    pmt: z.number().min(0),
    years: z.number().min(1).max(50),
    currencySymbol: z.string().optional(),
    riskFreeRate: z.number().min(0).max(0.50).optional(),
    inflationPremium: z.number().min(0).max(0.50).optional(),
    defaultPremium: z.number().min(0).max(0.50).optional(),
    liquidityPremium: z.number().min(0).max(0.50).optional(),
    maturityPremium: z.number().min(0).max(0.50).optional(),
  }),
  fields: [
    {
      key: 'currencySymbol',
      label: 'Currency Symbol',
      kind: 'select',
      required: true,
      options: [
        { label: 'USD ($)', value: '$' },
        { label: 'EUR (€)', value: '€' },
        { label: 'GBP (£)', value: '£' },
        { label: 'INR (₹)', value: '₹' },
        { label: 'JPY (¥)', value: '¥' },
      ],
      defaultValue: '$',
    },
    {
      key: 'statedRate',
      label: 'Stated Annual Interest Rate (r)',
      kind: 'number',
      required: true,
      defaultValue: 0.08,
    },
    {
      key: 'riskFreeRate',
      label: 'Real Risk-Free Rate (r*)',
      kind: 'number',
      required: false,
      defaultValue: 0.025,
    },
    {
      key: 'inflationPremium',
      label: 'Inflation Premium (IP)',
      kind: 'number',
      required: false,
      defaultValue: 0.020,
    },
    {
      key: 'defaultPremium',
      label: 'Default Risk Premium (DRP)',
      kind: 'number',
      required: false,
      defaultValue: 0.015,
    },
    {
      key: 'liquidityPremium',
      label: 'Liquidity Premium (LP)',
      kind: 'number',
      required: false,
      defaultValue: 0.010,
    },
    {
      key: 'maturityPremium',
      label: 'Maturity Premium (MP)',
      kind: 'number',
      required: false,
      defaultValue: 0.010,
    },
    {
      key: 'frequency',
      label: 'Compounding Frequency (m)',
      kind: 'select',
      required: true,
      options: [
        { label: 'Annual (m=1)', value: 1 },
        { label: 'Semi-Annual (m=2)', value: 2 },
        { label: 'Quarterly (m=4)', value: 4 },
        { label: 'Monthly (m=12)', value: 12 },
        { label: 'Daily (m=365)', value: 365 },
        { label: 'Continuous (m=0)', value: 0 },
      ],
      defaultValue: 12,
    },
    {
      key: 'calculationType',
      label: 'Calculation Model',
      kind: 'select',
      required: true,
      options: [
        { label: 'Single Sum', value: 'SINGLE_SUM' },
        { label: 'Ordinary Annuity', value: 'ORDINARY_ANNUITY' },
        { label: 'Annuity Due', value: 'ANNUITY_DUE' },
        { label: 'Perpetuity (PV)', value: 'PERPETUITY' },
        { label: 'Series of Unequal Cash Flows', value: 'UNEQUAL_FLOWS' },
      ],
      defaultValue: 'ORDINARY_ANNUITY',
    },
    {
      key: 'pmt',
      label: 'Payment Per Period (PMT)',
      kind: 'number',
      required: true,
      defaultValue: 150,
    },
    {
      key: 'years',
      label: 'Investment Horizon (Years)',
      kind: 'number',
      required: true,
      defaultValue: 5.0,
    },
    {
      key: 'horizon',
      label: 'TimesFM Forecast Horizon',
      kind: 'number',
      required: true,
      defaultValue: 12,
    },
  ],
};
