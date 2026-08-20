import os
from videosdk.agents import Agent, AgentSession, Pipeline, JobContext
from videosdk.agents.plugins import DeepgramSTT, AnthropicLLM, ElevenLabsTTS, SileroVAD

class CustomCascadeAgent(Agent):
    def __init__(self):
        super().__init__(
            instructions=os.getenv("INSTRUCTIONS", "You are a helpful voice assistant.")
        )

    async def on_enter(self) -> None:
        await self.session.say("Hello! How can I help you today?")

    async def on_exit(self) -> None:
        pass

async def build_session(ctx: JobContext) -> AgentSession:
    pipeline = Pipeline(
        stt=DeepgramSTT(api_key=os.getenv("DEEPGRAM_API_KEY", "")),
        llm=AnthropicLLM(
            api_key=os.getenv("ANTHROPIC_API_KEY", ""),
            model=os.getenv("MODEL_NAME", "claude-3-5-sonnet-20241022")
        ),
        tts=ElevenLabsTTS(api_key=os.getenv("ELEVENLABS_API_KEY", "")),
        vad=SileroVAD()
    )
    agent = CustomCascadeAgent()
    # No ctx.connect() here and no `context=` kwarg -- AgentSession has no
    # such param, it discovers the active JobContext itself. runner.py's
    # entrypoint calls ctx.run_until_shutdown(session, ...), which connects,
    # starts the session, and blocks until the call actually ends.
    return AgentSession(agent=agent, pipeline=pipeline)
