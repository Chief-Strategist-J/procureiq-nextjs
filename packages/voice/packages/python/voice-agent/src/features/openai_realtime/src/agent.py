import os
from videosdk.agents import Agent, AgentSession, Pipeline, JobContext
from videosdk.agents.plugins import OpenAIRealtime, OpenAIRealtimeConfig, SileroVAD

class OpenAIRealtimeAgent(Agent):
    def __init__(self):
        super().__init__(
            instructions=os.getenv("INSTRUCTIONS", "You are a helpful voice assistant.")
        )

    async def on_enter(self) -> None:
        await self.session.say("Hello! How can I help you today?")

    async def on_exit(self) -> None:
        pass

async def build_session(ctx: JobContext) -> AgentSession:
    config = OpenAIRealtimeConfig(
        api_key=os.getenv("OPENAI_API_KEY", ""),
        voice=os.getenv("VOICE_NAME", "alloy"),
        model=os.getenv("MODEL_NAME", "gpt-4o-realtime-preview")
    )
    model = OpenAIRealtime(config=config)
    pipeline = Pipeline(llm=model, vad=SileroVAD())
    agent = OpenAIRealtimeAgent()
    # No ctx.connect() here and no `context=` kwarg -- AgentSession has no
    # such param, it discovers the active JobContext itself. runner.py's
    # entrypoint calls ctx.run_until_shutdown(session, ...), which connects,
    # starts the session, and blocks until the call actually ends.
    return AgentSession(agent=agent, pipeline=pipeline)
