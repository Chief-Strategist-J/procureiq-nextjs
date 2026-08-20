from dataclasses import dataclass, asdict
from typing import List, Dict, Any

@dataclass
class TimesFMForecastEvent:
    eventId: str
    timestamp: str
    modelName: str
    horizon: int
    historicalData: List[float]
    forecastPoint: List[float]
    quantile10: List[float]
    quantile90: List[float]
    statedRate: float
    frequency: int
    effectiveAnnualRate: float
    riskFreeRate: float
    inflationPremium: float
    defaultPremium: float
    liquidityPremium: float
    maturityPremium: float
    presentValue: float
    futureValue: float
    pmt: float
    years: float
    calculationType: str
    timeline: List[Dict[str, Any]]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
