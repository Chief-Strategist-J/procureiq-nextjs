import math
from typing import Dict, List, Tuple, Callable

def _calc_ordinary_annuity(rate_per_period: float, total_periods: int, pmt: float, pv_in: float, fv_in: float, years: float, stated_rate: float, flows: List[float]) -> Tuple[float, float]:
    pv_res = pmt * ((1.0 - math.pow(1.0 + rate_per_period, -total_periods)) / rate_per_period) if rate_per_period > 0 else pmt * total_periods
    fv_res = pmt * ((math.pow(1.0 + rate_per_period, total_periods) - 1.0) / rate_per_period) if rate_per_period > 0 else pmt * total_periods
    return pv_res, fv_res

def _calc_annuity_due(rate_per_period: float, total_periods: int, pmt: float, pv_in: float, fv_in: float, years: float, stated_rate: float, flows: List[float]) -> Tuple[float, float]:
    pv_ord, fv_ord = _calc_ordinary_annuity(rate_per_period, total_periods, pmt, pv_in, fv_in, years, stated_rate, flows)
    return pv_ord * (1.0 + rate_per_period), fv_ord * (1.0 + rate_per_period)

def _calc_perpetuity(rate_per_period: float, total_periods: int, pmt: float, pv_in: float, fv_in: float, years: float, stated_rate: float, flows: List[float]) -> Tuple[float, float]:
    pv_res = pmt / rate_per_period if rate_per_period > 0 else 0.0
    return pv_res, 0.0

def _calc_unequal_flows(rate_per_period: float, total_periods: int, pmt: float, pv_in: float, fv_in: float, years: float, stated_rate: float, flows: List[float]) -> Tuple[float, float]:
    series = flows if flows else [100.0, 200.0, 300.0]
    pv_res = sum(cf / math.pow(1.0 + rate_per_period, idx + 1) for idx, cf in enumerate(series))
    fv_res = pv_res * math.pow(1.0 + rate_per_period, len(series))
    return pv_res, fv_res

def _calc_single_sum(rate_per_period: float, total_periods: int, pmt: float, pv_in: float, fv_in: float, years: float, stated_rate: float, flows: List[float]) -> Tuple[float, float]:
    pv_res = pv_in if pv_in != 0.0 else fv_in / math.pow(1.0 + rate_per_period, total_periods)
    fv_res = fv_in if fv_in != 0.0 else pv_res * math.pow(1.0 + rate_per_period, total_periods)
    return pv_res, fv_res

TVM_CALCULATION_RULESET: Dict[str, Callable[[float, int, float, float, float, float, float, List[float]], Tuple[float, float]]] = {
    "ORDINARY_ANNUITY": _calc_ordinary_annuity,
    "ANNUITY_DUE": _calc_annuity_due,
    "PERPETUITY": _calc_perpetuity,
    "UNEQUAL_FLOWS": _calc_unequal_flows,
    "SINGLE_SUM": _calc_single_sum
}

class TvmMathEngine:
    @staticmethod
    def calculate_ear(stated_rate: float, frequency: int) -> float:
        return math.exp(stated_rate) - 1.0 if frequency <= 0 else math.pow(1.0 + (stated_rate / frequency), frequency) - 1.0

    @staticmethod
    def calculate_pv_fv_pair(
        calc_type: str,
        stated_rate: float,
        freq_val: int,
        total_periods: int,
        pmt: float,
        pv_in: float,
        fv_in: float,
        years: float,
        cash_flows: List[float]
    ) -> Tuple[float, float]:
        rate_per_period = stated_rate / max(1, freq_val)
        rule = TVM_CALCULATION_RULESET.get(calc_type, _calc_single_sum)
        return rule(rate_per_period, total_periods, pmt, pv_in, fv_in, years, stated_rate, cash_flows)

tvm_math = TvmMathEngine()
