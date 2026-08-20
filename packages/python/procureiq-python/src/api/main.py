from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import os
import time
import threading
from sqlalchemy.orm import Session
from sqlalchemy import text
from src.infra.database import get_db, engine, Base, SessionLocal
from src.infra.tracing.otel import setup_tracing
from src.api.rest.v1.handlers.fieldservice import router as fieldservice_router
from src.api.rest.v1.handlers.email import router as email_router
from src.api.rest.v1.handlers.analytics import router as analytics_router
from src.api.rest.v1.handlers.tvm import router as tvm_router

from src.features.email.models import ScheduledEmail
from src.features.email.service import process_scheduled_emails

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ProcureIQ Python Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_tracing(app=app, engine=engine)

app.include_router(fieldservice_router)
app.include_router(email_router)
app.include_router(analytics_router)
app.include_router(tvm_router)

def run_email_scheduler():
    while True:
        try:
            db = SessionLocal()
            try:
                process_scheduled_emails(db)
            finally:
                db.close()
        except Exception as e:
            print(f"[scheduler] error running email job process: {e}")
        time.sleep(10)

@app.on_event("startup")
def start_scheduler():
    scheduler_thread = threading.Thread(target=run_email_scheduler, daemon=True)
    scheduler_thread.start()

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "database_connected": os.getenv("DATABASE_URL") is not None
    }

@app.get("/db-check")
def check_db(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "connected",
            "message": "Successfully connected to the database"
        }
    except Exception as e:
        return {
            "status": "disconnected",
            "error": str(e)
        }
