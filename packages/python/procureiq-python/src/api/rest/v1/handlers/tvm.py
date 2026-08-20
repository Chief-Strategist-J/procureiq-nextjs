from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from typing import List, Optional
import logging
from opentelemetry import trace
from opentelemetry.trace.propagation.tracecontext import TraceContextTextMapPropagator

try:
    from core.endpoints import endpoints
except ImportError:
    from src.core.endpoints import endpoints

try:
    from features.tvm.services.timesfm_service import timesfm_service
except ImportError:
    from src.features.tvm.services.timesfm_service import timesfm_service

try:
    from features.tvm.publisher import tvm_publisher
except ImportError:
    from src.features.tvm.publisher import tvm_publisher

logger = logging.getLogger(__name__)
tracer = trace.get_tracer("procureiq.tvm.handler")
propagator = TraceContextTextMapPropagator()

router = APIRouter(prefix="", tags=["Time Value of Money AI"])

class ForecastRequest(BaseModel):
    historicalData: Optional[List[float]] = Field(default=None, description="Historical cash flow time-series")
    horizon: int = Field(default=12, ge=1, le=120, description="Forecast horizon steps")
    statedRate: Optional[float] = Field(default=None, ge=0.0, le=1.0, description="Stated annual interest rate")
    frequency: int = Field(default=12, ge=0, le=365, description="Compounding frequency per year")
    calculationType: str = Field(default="SINGLE_SUM", description="TVM calculation type")
    pmt: float = Field(default=0.0, description="Payment per period")
    pv: float = Field(default=0.0, description="Present Value")
    fv: float = Field(default=0.0, description="Future Value")
    years: float = Field(default=5.0, description="Time horizon in years")
    riskFreeRate: Optional[float] = Field(default=None, description="Real Risk-Free Rate (r*)")
    inflationPremium: Optional[float] = Field(default=None, description="Inflation Premium (IP)")
    defaultPremium: Optional[float] = Field(default=None, description="Default Risk Premium (DRP)")
    liquidityPremium: Optional[float] = Field(default=None, description="Liquidity Premium (LP)")
    maturityPremium: Optional[float] = Field(default=None, description="Maturity Premium (MP)")

async def _process_forecast(request: ForecastRequest, raw_req: Request):
    headers_dict = {k.lower(): v for k, v in raw_req.headers.items()}
    ctx = propagator.extract(headers_dict)
    
    with tracer.start_as_current_span("handler.tvm.generate_forecast", context=ctx) as span:
        client_ip = raw_req.client.host if raw_req.client else "127.0.0.1"
        user_agent = raw_req.headers.get("user-agent", "unknown")
        user_role = raw_req.headers.get("x-user-role", "accountant")
        user_id = raw_req.headers.get("x-user-id", "1")

        span.set_attribute("user.id", user_id)
        span.set_attribute("user.role", user_role)
        span.set_attribute("net.peer.ip", client_ip)

        if user_role not in ["accountant", "admin"]:
            logger.warning(f"UNAUTHORIZED ACCESS ATTEMPT: User {user_id} ({user_role}) from IP {client_ip} to TVM AI Engine")
            raise HTTPException(status_code=403, detail="Forbidden: TVM AI Quantitative Engine is restricted to Accountant and Admin roles.")

        try:
            forecast_result = timesfm_service.forecast_cash_flows(
                historical_series=request.historicalData or [],
                horizon=request.horizon,
                stated_rate=request.statedRate,
                frequency=request.frequency,
                calc_type=request.calculationType,
                pmt=request.pmt,
                pv_in=request.pv,
                fv_in=request.fv,
                years=request.years,
                risk_free_rate=request.riskFreeRate,
                inflation_premium=request.inflationPremium,
                default_premium=request.defaultPremium,
                liquidity_premium=request.liquidityPremium,
                maturity_premium=request.maturityPremium
            )
            
            forecast_result["auditContext"] = {
                "actorId": user_id,
                "actorRole": user_role,
                "clientIp": client_ip,
                "userAgent": user_agent
            }

            tvm_publisher.publish_forecast_event(forecast_result)
            
            return {
                "status": "success",
                "code": 200,
                "data": forecast_result,
                "error": None
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@router.post(endpoints.TVM_AI_BASE + endpoints.TVM_AI_FORECAST)
async def generate_forecast_canonical(request: ForecastRequest, raw_req: Request):
    return await _process_forecast(request, raw_req)

@router.post("/api/v1" + endpoints.TVM_AI_BASE + endpoints.TVM_AI_FORECAST)
async def generate_forecast_fallback(request: ForecastRequest, raw_req: Request):
    return await _process_forecast(request, raw_req)
