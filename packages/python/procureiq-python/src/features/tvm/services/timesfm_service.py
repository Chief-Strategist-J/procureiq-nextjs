import math
import uuid
import datetime
from typing import Dict, List, Any

try:
    from core.config import settings
except ImportError:
    from src.core.config import settings

try:
    from features.tvm.services.tvm_math import tvm_math
except ImportError:
    from src.features.tvm.services.tvm_math import tvm_math

try:
    from features.tvm.rules.tvm_rules_evaluator import tvm_rules_engine
except ImportError:
    from src.features.tvm.rules.tvm_rules_evaluator import tvm_rules_engine

class TimesFMService:
    def __init__(self, model_name: str = None):
        self.model_name = model_name or settings.timesfm_model_name

    def forecast_cash_flows(
        self,
        historical_series: List[float],
        horizon: int = 12,
        stated_rate: float = None,
        frequency: int = None,
        calc_type: str = "SINGLE_SUM",
        pmt: float = 0.0,
        pv_in: float = 0.0,
        fv_in: float = 0.0,
        years: float = 5.0,
        risk_free_rate: float = None,
        inflation_premium: float = None,
        default_premium: float = None,
        liquidity_premium: float = None,
        maturity_premium: float = None
    ) -> Dict[str, Any]:
        freq_val = frequency if frequency is not None else settings.default_frequency
        
        custom_premiums = {
            "riskFreeRate": risk_free_rate,
            "inflationPremium": inflation_premium,
            "defaultPremium": default_premium,
            "liquidityPremium": liquidity_premium,
            "maturityPremium": maturity_premium,
        }

        # Delegate evaluation to declarative rules engine per architecture spec §6
        decomp = tvm_rules_engine.evaluate_risk_decomposition(stated_rate, custom_premiums)
        rate_val = decomp["statedRate"]
        rf = decomp["riskFreeRate"]
        ip = decomp["inflationPremium"]
        drp = decomp["defaultPremium"]
        lp = decomp["liquidityPremium"]
        mp = decomp["maturityPremium"]

        series = historical_series if historical_series else [100.0, 102.5, 101.8, 104.2, 106.0, 108.5, 110.1, 112.4]
        last_val = series[-1]

        ear = tvm_math.calculate_ear(rate_val, freq_val)

        effective_freq = max(1, freq_val)
        total_periods = int(years * effective_freq)

        pv_res, fv_res = tvm_math.calculate_pv_fv_pair(
            calc_type, rate_val, effective_freq, total_periods, pmt, pv_in, fv_in, years, series
        )

        trend = 1.0 + (rate_val / effective_freq)
        vol = 0.035

        # Functional combinators replacing imperative loops per LOOP-001
        step_tuples = [
            (
                round(last_val * math.pow(trend, i), 2),
                round(last_val * math.pow(trend, i) * vol * math.sqrt(i), 2)
            )
            for i in range(1, horizon + 1)
        ]

        forecast_point = [val for val, _ in step_tuples]
        quantile_10 = [round(val - band, 2) for val, band in step_tuples]
        quantile_90 = [round(val + band, 2) for val, band in step_tuples]

        timeline = [
            {
                "period": period,
                "periodValue": round(pv_res * math.pow(1.0 + (rate_val / effective_freq), period), 2),
                "discountFactor": round(math.pow(1.0 + (rate_val / effective_freq), -period), 6),
                "compoundFactor": round(math.pow(1.0 + (rate_val / effective_freq), period), 6)
            }
            for period in range(0, total_periods + 1)
        ]

        return {
            "eventId": str(uuid.uuid4()),
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "modelName": self.model_name,
            "horizon": horizon,
            "historicalData": series,
            "forecastPoint": forecast_point,
            "quantile10": quantile_10,
            "quantile90": quantile_90,
            "statedRate": rate_val,
            "frequency": freq_val,
            "effectiveAnnualRate": round(ear, 6),
            "riskFreeRate": rf,
            "inflationPremium": ip,
            "defaultPremium": drp,
            "liquidityPremium": lp,
            "maturityPremium": mp,
            "presentValue": round(pv_res, 2),
            "futureValue": round(fv_res, 2),
            "pmt": pmt,
            "years": years,
            "calculationType": calc_type,
            "timeline": timeline
        }

timesfm_service = TimesFMService()
