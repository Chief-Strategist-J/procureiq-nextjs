import base64
import os
from dotenv import load_dotenv
from videosdk.agents import WorkerJob, Options, JobContext, RoomOptions, TracesOptions
from src.agent import build_session
from src.meeting import resolve_room

load_dotenv()

def _langfuse_traces() -> TracesOptions:
    """OTLP export to a self-hosted Langfuse instance (see
    deploy/docker/docker-compose.langfuse.yaml). Disabled unless
    TRACING_ENABLED=true so pipelines still run with no tracing backend."""
    if os.getenv("TRACING_ENABLED", "false").lower() != "true":
        return TracesOptions(enabled=False)
    host = os.getenv("LANGFUSE_HOST", "http://localhost:3000")
    # Defaults match the headless-init keys in
    # deploy/docker/docker-compose.langfuse.yaml — override both together.
    public_key = os.getenv("LANGFUSE_PUBLIC_KEY", "pk-lf-voice-agent-dev")
    secret_key = os.getenv("LANGFUSE_SECRET_KEY", "sk-lf-voice-agent-dev")
    auth = base64.b64encode(f"{public_key}:{secret_key}".encode()).decode()
    return TracesOptions(
        enabled=True,
        export_url=f"{host}/api/public/otel/v1/traces",
        export_headers={
            "Authorization": f"Basic {auth}",
            "x-langfuse-ingestion-version": "4",
        },
    )

async def entrypoint(ctx: JobContext):
    session = await build_session(ctx)
    # Connects, starts the session, and blocks until the call ends (shutdown
    # signal / room close) -- session.start() alone returns immediately and
    # would tear the agent down right after it joins.
    await ctx.run_until_shutdown(session=session, wait_for_participant=True)

def make_context():
    room_id, auth_token = resolve_room(
        meeting_id=os.getenv("VIDEOSDK_MEETING_ID"),
        token=os.getenv("VIDEOSDK_TOKEN"),
        api_key=os.getenv("VIDEOSDK_API_KEY", ""),
        secret_key=os.getenv("VIDEOSDK_SECRET_KEY", ""),
    )
    return JobContext(room_options=RoomOptions(
        room_id=room_id,
        auth_token=auth_token,
        name="Google Realtime Agent",
        traces=_langfuse_traces()
    ))

if __name__ == "__main__":
    traces = _langfuse_traces()
    if traces.enabled:
        print(f"[tracing] enabled -> {os.getenv('LANGFUSE_HOST', 'http://localhost:3000')}")
        print("[tracing] open the URL above, log in, and check Tracing in the left sidebar")
    else:
        print("[tracing] disabled (set TRACING_ENABLED=true in .env to turn on)")

    # register=true (default): cloud-dispatch mode -- registers with the
    # VideoSDK backend and waits idle for a job (dashboard / dispatch API).
    # register=false: connects immediately and prints a joinable playground
    # URL -- use this for local testing (REGISTER=false python runner.py).
    register = os.getenv("REGISTER", "true").lower() == "true"

    job = WorkerJob(
        entrypoint=entrypoint,
        jobctx=make_context,
        options=Options(
            agent_id="voice-agent-google-realtime",
            max_processes=5,
            register=register,
            log_level="INFO",
            # 8081 collides with other services on shared dev machines;
            # override via DEBUG_PORT if this is taken too.
            port=int(os.getenv("DEBUG_PORT", "8091")),
        )
    )
    job.start()
