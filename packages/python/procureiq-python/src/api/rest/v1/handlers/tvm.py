from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional
import logging
import base64
import io
import math
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
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

# ── Request Models ─────────────────────────────────────────────────────────────

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
    cashFlows: Optional[List[float]] = Field(default=None, description="Custom cash flows for UNEQUAL_FLOWS")
    riskFreeRate: Optional[float] = Field(default=None, description="Real Risk-Free Rate (r*)")
    inflationPremium: Optional[float] = Field(default=None, description="Inflation Premium (IP)")
    defaultPremium: Optional[float] = Field(default=None, description="Default Risk Premium (DRP)")
    liquidityPremium: Optional[float] = Field(default=None, description="Liquidity Premium (LP)")
    maturityPremium: Optional[float] = Field(default=None, description="Maturity Premium (MP)")

class AnnuityChartRequest(BaseModel):
    calculationType: str = Field(default="ORDINARY_ANNUITY")
    pmt: float = Field(default=1000.0, description="Payment amount per period")
    rate: float = Field(default=0.05, description="Interest rate per period")
    periods: int = Field(default=5, ge=1, le=30, description="Number of periods")
    cashFlows: Optional[List[float]] = Field(default=None, description="Custom cash flows for UNEQUAL_FLOWS")
    currencySymbol: str = Field(default="$")

# ── Matplotlib Chart Generator ─────────────────────────────────────────────────

def _generate_timeline_chart(req: AnnuityChartRequest) -> str:
    """Generate matplotlib CFA-style timeline stepper, return as base64 PNG."""
    n = req.periods
    r = req.rate

    if req.calculationType == "UNEQUAL_FLOWS" and req.cashFlows:
        flows = req.cashFlows[:n]
        while len(flows) < n:
            flows.append(0.0)
    else:
        flows = [req.pmt] * n

    is_due = req.calculationType == "ANNUITY_DUE"
    fv_per_flow = [
        cf * math.pow(1.0 + r, n - t if not is_due else n - t + 1)
        for t, cf in enumerate(flows, start=1)
    ]
    total_fv = sum(fv_per_flow)

    fig_width = max(10, n * 1.8 + 2)
    fig, ax = plt.subplots(figsize=(fig_width, 5.0))
    fig.patch.set_facecolor("#0f172a")
    ax.set_facecolor("#0f172a")

    ax.axhline(y=0.5, xmin=0.03, xmax=0.97, color="#334155", lw=2.5, zorder=1)

    period_xs = np.linspace(0.04, 0.96, n + 1)
    palette = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ec4899",
               "#8b5cf6", "#14b8a6", "#f97316", "#ef4444", "#a855f7"]

    for i, (px, cf, fv) in enumerate(zip(period_xs[:-1], flows, fv_per_flow)):
        color = palette[i % len(palette)]

        ax.annotate(
            "",
            xy=(px, 0.5),
            xytext=(px, 0.12),
            xycoords="axes fraction",
            textcoords="axes fraction",
            arrowprops=dict(arrowstyle="->", color=color, lw=2.0),
        )
        ax.text(
            px, 0.06,
            f"{req.currencySymbol}{cf:,.0f}",
            transform=ax.transAxes,
            ha="center", va="top", fontsize=9, color=color, fontweight="bold"
        )

        last_px = period_xs[-1]
        arc_rad = -0.10 - i * 0.04
        ax.annotate(
            "",
            xy=(last_px, 0.86),
            xytext=(px, 0.55),
            xycoords="axes fraction",
            textcoords="axes fraction",
            arrowprops=dict(
                arrowstyle="->",
                color=color,
                lw=1.5,
                connectionstyle=f"arc3,rad={arc_rad}"
            ),
        )
        mid_x = (px + last_px) / 2
        label_y = 0.92 + (i % 4) * 0.05
        ax.text(
            mid_x, label_y,
            f"= {req.currencySymbol}{fv:,.2f}",
            transform=ax.transAxes,
            ha="center", va="bottom", fontsize=8.5, color=color, style="italic"
        )

    for i, px in enumerate(period_xs):
        ax.plot(px, 0.5, "o", color="#1e293b", markersize=14,
                transform=ax.transAxes, zorder=2)
        ax.plot(px, 0.5, "o", color="#475569", markersize=9,
                transform=ax.transAxes, zorder=3)
        ax.text(
            px, 0.44,
            f"t={i}",
            transform=ax.transAxes,
            ha="center", va="top", fontsize=9.5, color="#94a3b8", fontweight="bold"
        )

    ax.text(
        0.98, 0.58,
        f"FV = {req.currencySymbol}{total_fv:,.2f}",
        transform=ax.transAxes,
        ha="right", va="center",
        fontsize=12, color="#38bdf8", fontweight="bold",
        bbox=dict(boxstyle="round,pad=0.5", facecolor="#0ea5e930", edgecolor="#38bdf8", lw=2)
    )

    calc_label = {
        "ORDINARY_ANNUITY": "Ordinary Annuity",
        "ANNUITY_DUE": "Annuity Due",
        "UNEQUAL_FLOWS": "Unequal Cash Flows",
    }.get(req.calculationType, req.calculationType)

    ax.set_title(
        f"CFA Timeline — {calc_label}  |  r = {r*100:.2f}%  |  N = {n}",
        color="#f1f5f9", fontsize=13, fontweight="bold", pad=16,
        fontfamily="DejaVu Sans"
    )
    ax.set_ylim(-0.05, 1.35)
    ax.axis("off")
    plt.tight_layout(pad=0.8)

    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=130, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")


# ── Forecast Handler ──────────────────────────────────────────────────────────

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
            logger.warning(
                f"UNAUTHORIZED: User {user_id} ({user_role}) IP {client_ip} → TVM AI Engine"
            )
            raise HTTPException(
                status_code=403,
                detail="Forbidden: TVM AI Engine restricted to Accountant/Admin roles."
            )

        try:
            historical = request.cashFlows if (
                request.calculationType == "UNEQUAL_FLOWS" and request.cashFlows
            ) else (request.historicalData or [])

            forecast_result = timesfm_service.forecast_cash_flows(
                historical_series=historical,
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


# ── Routes ─────────────────────────────────────────────────────────────────────
# endpoints.TVM_AI_BASE = "/api/v1/tvm-ai" (full path, already includes /api/v1)
# Do NOT add "/api/v1" prefix here — that creates /api/v1/api/v1/... double path.

@router.post(endpoints.TVM_AI_BASE + endpoints.TVM_AI_FORECAST)
async def generate_forecast(request: ForecastRequest, raw_req: Request):
    return await _process_forecast(request, raw_req)

@router.post(endpoints.TVM_AI_BASE + "/annuity-timeline-chart")
async def generate_annuity_timeline_chart(request: AnnuityChartRequest, raw_req: Request):
    """Returns a matplotlib base64 PNG of the CFA annuity timeline stepper."""
    user_role = raw_req.headers.get("x-user-role", "accountant")
    if user_role not in ["accountant", "admin"]:
        raise HTTPException(status_code=403, detail="Forbidden: restricted to Accountant/Admin roles.")
    try:
        png_b64 = _generate_timeline_chart(request)
        return JSONResponse({
            "status": "success",
            "code": 200,
            "data": {
                "imageBase64": f"data:image/png;base64,{png_b64}",
                "calculationType": request.calculationType,
                "periods": request.periods,
                "rate": request.rate,
            },
            "error": None
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
