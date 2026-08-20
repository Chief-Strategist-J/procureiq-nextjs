import os
from videosdk.agents import Agent, AgentSession, Pipeline, JobContext
from videosdk.agents.plugins import GeminiRealtime, GeminiLiveConfig, SileroVAD

class GoogleRealtimeAgent(Agent):
    def __init__(self):
        super().__init__(
            instructions=os.getenv("INSTRUCTIONS", "You are a helpful voice assistant.")
        )

    async def on_enter(self) -> None:
        await self.session.say("Hello! I am your Google Gemini assistant. How can I help?")

    async def on_exit(self) -> None:
        pass

async def build_session(ctx: JobContext) -> AgentSession:
    config = GeminiLiveConfig(
        api_key=os.getenv("GOOGLE_API_KEY", ""),
        model=os.getenv("MODEL_NAME", "gemini-2.0-flash-exp")
    )
    model = GeminiRealtime(config=config)
    pipeline = Pipeline(llm=model, vad=SileroVAD())
    agent = GoogleRealtimeAgent()
    # No ctx.connect() here and no `context=` kwarg -- AgentSession has no
    # such param, it discovers the active JobContext itself. runner.py's
    # entrypoint calls ctx.run_until_shutdown(session, ...), which connects,
    # starts the session, and blocks until the call actually ends.
    return AgentSession(agent=agent, pipeline=pipeline)
