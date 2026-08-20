import yaml
import os
from typing import Dict, Any

class TvmRulesEngine:
    def __init__(self, rule_file_path: str = None):
        if rule_file_path is None:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../.."))
            rule_file_path = os.path.join(base_dir, "platform/config/rules/tvm.cfa_risk.rules.yaml")
        
        self.rules = self._load_rules(rule_file_path)

    def _load_rules(self, file_path: str) -> Dict[str, Any]:
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                return yaml.safe_load(f)
        return {
            "rules": [
                {
                    "id": "RULE-CFA-001",
                    "parameters": {
                        "riskFreeRateRatio": 0.30,
                        "inflationPremiumRatio": 0.25,
                        "defaultPremiumRatio": 0.20,
                        "liquidityPremiumRatio": 0.15,
                        "maturityPremiumRatio": 0.10,
                    }
                }
            ]
        }

    def evaluate_risk_decomposition(self, stated_rate: float, custom_premiums: Dict[str, float]) -> Dict[str, float]:
        rf = custom_premiums.get("riskFreeRate")
        ip = custom_premiums.get("inflationPremium")
        drp = custom_premiums.get("defaultPremium")
        lp = custom_premiums.get("liquidityPremium")
        mp = custom_premiums.get("maturityPremium")

        if any(p is not None for p in [rf, ip, drp, lp, mp]):
            rf_val = rf if rf is not None else 0.025
            ip_val = ip if ip is not None else 0.020
            drp_val = drp if drp is not None else 0.015
            lp_val = lp if lp is not None else 0.010
            mp_val = mp if mp is not None else 0.010
            computed_sum = round(rf_val + ip_val + drp_val + lp_val + mp_val, 4)
            final_rate = stated_rate if stated_rate is not None else computed_sum
            return {
                "statedRate": final_rate,
                "riskFreeRate": rf_val,
                "inflationPremium": ip_val,
                "defaultPremium": drp_val,
                "liquidityPremium": lp_val,
                "maturityPremium": mp_val
            }

        rule_params = self.rules.get("rules", [{}])[0].get("parameters", {})
        rf_ratio = rule_params.get("riskFreeRateRatio", 0.30)
        ip_ratio = rule_params.get("inflationPremiumRatio", 0.25)
        drp_ratio = rule_params.get("defaultPremiumRatio", 0.20)
        lp_ratio = rule_params.get("liquidityPremiumRatio", 0.15)

        rate_val = stated_rate if stated_rate is not None else 0.08

        rf_val = round(rate_val * rf_ratio, 4)
        ip_val = round(rate_val * ip_ratio, 4)
        drp_val = round(rate_val * drp_ratio, 4)
        lp_val = round(rate_val * lp_ratio, 4)
        mp_val = round(rate_val - (rf_val + ip_val + drp_val + lp_val), 4)

        return {
            "statedRate": rate_val,
            "riskFreeRate": rf_val,
            "inflationPremium": ip_val,
            "defaultPremium": drp_val,
            "liquidityPremium": lp_val,
            "maturityPremium": mp_val
        }

tvm_rules_engine = TvmRulesEngine()
