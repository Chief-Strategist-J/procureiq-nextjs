import os
from videosdk.agents import Agent, AgentSession, Pipeline, JobContext
from videosdk.agents.plugins import SarvamAISTT, SarvamAILLM, SarvamAITTS, SileroVAD

class SarvamCascadeAgent(Agent):
    def __init__(self):
        super().__init__(
            instructions=os.getenv("INSTRUCTIONS", "You are a helpful voice assistant.")
        )

    async def on_enter(self) -> None:
        await self.session.say("Hello! I am your Sarvam assistant. How can I help?")

    async def on_exit(self) -> None:
        pass

async def build_session(ctx: JobContext) -> AgentSession:
    sarvam_key = os.getenv("SARVAM_API_KEY", "")
    pipeline = Pipeline(
        stt=SarvamAISTT(api_key=sarvam_key),
        llm=SarvamAILLM(api_key=sarvam_key),
        tts=SarvamAITTS(api_key=sarvam_key),
        vad=SileroVAD()
    )
    agent = SarvamCascadeAgent()
    # No ctx.connect() here and no `context=` kwarg -- AgentSession has no
    # such param, it discovers the active JobContext itself. runner.py's
    # entrypoint calls ctx.run_until_shutdown(session, ...), which connects,
    # starts the session, and blocks until the call actually ends.
    return AgentSession(agent=agent, pipeline=pipeline)
