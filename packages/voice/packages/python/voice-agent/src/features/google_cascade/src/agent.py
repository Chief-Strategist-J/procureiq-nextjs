import os
from videosdk.agents import Agent, AgentSession, Pipeline, JobContext
from videosdk.agents.plugins import GoogleSTT, GoogleLLM, GoogleTTS, SileroVAD

class GoogleCascadeAgent(Agent):
    def __init__(self):
        super().__init__(
            instructions=os.getenv("INSTRUCTIONS", "You are a helpful voice assistant.")
        )

    async def on_enter(self) -> None:
        await self.session.say("Hello! I am your Google Cascade assistant. How can I help?")

    async def on_exit(self) -> None:
        pass

async def build_session(ctx: JobContext) -> AgentSession:
    google_key = os.getenv("GOOGLE_API_KEY", "")
    pipeline = Pipeline(
        stt=GoogleSTT(api_key=google_key),
        llm=GoogleLLM(api_key=google_key, model=os.getenv("MODEL_NAME", "gemini-1.5-flash")),
        tts=GoogleTTS(api_key=google_key),
        vad=SileroVAD()
    )
    agent = GoogleCascadeAgent()
    # No ctx.connect() here and no `context=` kwarg -- AgentSession has no
    # such param, it discovers the active JobContext itself. runner.py's
    # entrypoint calls ctx.run_until_shutdown(session, ...), which connects,
    # starts the session, and blocks until the call actually ends.
    return AgentSession(agent=agent, pipeline=pipeline)
