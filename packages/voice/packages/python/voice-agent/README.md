# Voice Agent

Multi-provider AI voice agent platform built on [VideoSDK](https://videosdk.live). Each pipeline is a fully independent, self-contained folder you can edit, build, and deploy without touching anything else.

---

## Pipelines

| Pipeline | STT | LLM | TTS | Type |
|---|---|---|---|---|
| `openai_realtime` | — | [GPT-4o Realtime](https://platform.openai.com/docs/guides/realtime) | — | Realtime |
| `google_realtime` | — | [Gemini 2.0 Flash Live](https://ai.google.dev/gemini-api/docs/live) | — | Realtime |
| `openai_cascade` | [OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text) | [GPT-4o](https://platform.openai.com/docs/models/gpt-4o) | [OpenAI TTS](https://platform.openai.com/docs/guides/text-to-speech) | Cascade |
| `google_cascade` | [Google STT](https://cloud.google.com/speech-to-text) | [Gemini 1.5 Flash](https://ai.google.dev/gemini-api/docs/models/gemini) | [Google TTS](https://cloud.google.com/text-to-speech) | Cascade |
| `sarvam_cascade` | [Sarvam AI STT](https://www.sarvam.ai) | [Sarvam AI LLM](https://www.sarvam.ai) | [Sarvam AI TTS](https://www.sarvam.ai) | Cascade |
| `custom_cascade` | [Deepgram Nova-2](https://deepgram.com/product/speech-to-text) | [Claude 3.5 Sonnet](https://www.anthropic.com/claude) | [ElevenLabs](https://elevenlabs.io) | Cascade |
| `sip` | [OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text) | [GPT-4o](https://platform.openai.com/docs/models/gpt-4o) | [OpenAI TTS](https://platform.openai.com/docs/guides/text-to-speech) | SIP/Telephony |

All pipelines include **[Silero VAD](https://github.com/snakers4/silero-vad)** for voice activity detection.

Core SDK: [`videosdk-agents`](https://pypi.org/project/videosdk-agents/) · GitHub: [videosdk-live/agents](https://github.com/videosdk-live/agents)

---

## SDK & Plugins

Each pipeline installs only what it needs. Install the core SDK plus the required plugin(s):

```bash
# Core SDK (required for all pipelines)
pip install videosdk-agents

# Per-provider plugins — install only what your pipeline uses
pip install videosdk-plugins-openai      # OpenAI Realtime, Whisper STT, GPT-4o LLM, OpenAI TTS
pip install videosdk-plugins-google      # Gemini Live, Google STT, Google LLM, Google TTS
pip install videosdk-plugins-sarvamai    # Sarvam STT, Sarvam LLM, Sarvam TTS
pip install videosdk-plugins-deepgram    # Deepgram Nova-2 STT
pip install videosdk-plugins-anthropic   # Claude LLM
pip install videosdk-plugins-elevenlabs  # ElevenLabs TTS
pip install videosdk-plugins-silero      # Silero VAD (all pipelines)
```

Or install everything at once:

```bash
pip install "videosdk-agents[openai,google,sarvamai,deepgram,anthropic,elevenlabs,silero]"
```

| Plugin Package | PyPI | Used By |
|---|---|---|
| `videosdk-agents` | [pypi.org](https://pypi.org/project/videosdk-agents/) | All pipelines |
| `videosdk-plugins-openai` | [pypi.org](https://pypi.org/project/videosdk-plugins-openai/) | `openai_realtime`, `openai_cascade`, `sip` |
| `videosdk-plugins-google` | [pypi.org](https://pypi.org/project/videosdk-plugins-google/) | `google_realtime`, `google_cascade` |
| `videosdk-plugins-sarvamai` | [pypi.org](https://pypi.org/project/videosdk-plugins-sarvamai/) | `sarvam_cascade` |
| `videosdk-plugins-deepgram` | [pypi.org](https://pypi.org/project/videosdk-plugins-deepgram/) | `custom_cascade` |
| `videosdk-plugins-anthropic` | [pypi.org](https://pypi.org/project/videosdk-plugins-anthropic/) | `custom_cascade` |
| `videosdk-plugins-elevenlabs` | [pypi.org](https://pypi.org/project/videosdk-plugins-elevenlabs/) | `custom_cascade` |
| `videosdk-plugins-silero` | [pypi.org](https://pypi.org/project/videosdk-plugins-silero/) | All pipelines (VAD) |

---

## Provider API Keys — Where to Get Them

| Provider | Signup / API Keys | Docs |
|---|---|---|
| [VideoSDK](https://videosdk.live) | [app.videosdk.live](https://app.videosdk.live/) | [docs.videosdk.live](https://docs.videosdk.live) |
| [OpenAI](https://openai.com) | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | [platform.openai.com/docs](https://platform.openai.com/docs) |
| [Google AI (Gemini)](https://ai.google.dev) | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) | [ai.google.dev/gemini-api/docs](https://ai.google.dev/gemini-api/docs) |
| [Sarvam AI](https://www.sarvam.ai) | [dashboard.sarvam.ai](https://dashboard.sarvam.ai) | [docs.sarvam.ai](https://docs.sarvam.ai) |
| [Deepgram](https://deepgram.com) | [console.deepgram.com](https://console.deepgram.com) | [developers.deepgram.com](https://developers.deepgram.com) |
| [Anthropic (Claude)](https://www.anthropic.com) | [console.anthropic.com](https://console.anthropic.com) | [docs.anthropic.com](https://docs.anthropic.com) |
| [ElevenLabs](https://elevenlabs.io) | [elevenlabs.io/app/api-key](https://elevenlabs.io/app/api-key) | [elevenlabs.io/docs](https://elevenlabs.io/docs) |

---

## Folder Structure

Every pipeline lives entirely inside its own folder. Nothing is shared between pipelines.

```
src/features/{pipeline}/
├── src/
│   ├── __init__.py
│   └── agent.py          ← edit this to change agent behaviour
├── Dockerfile            ← builds only this pipeline
├── docker-compose.yaml   ← run this pipeline locally
├── requirements.txt      ← this pipeline's dependencies only
├── runner.py             ← entry point (do not edit)
├── videosdk.yaml         ← VideoSDK cloud deployment manifest
└── context.yaml          ← pipeline metadata
```

---

## Prerequisites

- Python 3.12+
- Docker & Docker Compose
- A [VideoSDK](https://videosdk.live) account — get your token at [app.videosdk.live](https://app.videosdk.live/)
- Provider API keys for the pipeline you want to run (see table above)

---

## Environment Setup

Create a `.env` file inside the pipeline folder you want to run:

```bash
cp packages/python/voice-agent/.env.example \
   packages/python/voice-agent/src/features/openai_realtime/.env
```

Fill in the required keys for your chosen pipeline:

```env
# Required for all pipelines
VIDEOSDK_TOKEN=your_videosdk_jwt_token       # https://app.videosdk.live
VIDEOSDK_MEETING_ID=your_meeting_id
INSTRUCTIONS=You are a helpful voice assistant.

# OpenAI pipelines (openai_realtime, openai_cascade, sip)
OPENAI_API_KEY=your_openai_key               # https://platform.openai.com/api-keys

# Google pipelines (google_realtime, google_cascade)
GOOGLE_API_KEY=your_google_key               # https://aistudio.google.com/app/apikey

# Sarvam pipeline (sarvam_cascade)
SARVAM_API_KEY=your_sarvam_key               # https://dashboard.sarvam.ai

# sarvam_cascade only: leave VIDEOSDK_MEETING_ID / VIDEOSDK_TOKEN unset and
# src/meeting.py will self-issue a JWT and auto-create a room for you.

# Tracing (optional, any pipeline — see "Tracing" section below)
TRACING_ENABLED=false
LANGFUSE_HOST=http://localhost:3000
LANGFUSE_PUBLIC_KEY=pk-lf-voice-agent-dev
LANGFUSE_SECRET_KEY=sk-lf-voice-agent-dev

# Custom pipeline (custom_cascade)
DEEPGRAM_API_KEY=your_deepgram_key           # https://console.deepgram.com
ANTHROPIC_API_KEY=your_anthropic_key         # https://console.anthropic.com
ELEVENLABS_API_KEY=your_elevenlabs_key       # https://elevenlabs.io/app/api-key
```

---

## Run with Docker (Recommended)

Navigate into any pipeline folder and run it:

```bash
cd packages/python/voice-agent/src/features/openai_realtime

# Build and start
docker compose up --build

# Run in background
docker compose up --build -d

# Stop
docker compose down
```

Same command works for every pipeline — just change the folder:

```bash
cd packages/python/voice-agent/src/features/google_realtime && docker compose up --build
cd packages/python/voice-agent/src/features/sarvam_cascade  && docker compose up --build
cd packages/python/voice-agent/src/features/custom_cascade  && docker compose up --build
```

---

## Run All Pipelines Together

To run all pipelines simultaneously using the top-level orchestrator:

```bash
cd packages/python/voice-agent

docker compose -f deploy/docker/docker-compose.worker.yaml up --build
```

Run a specific pipeline only:

```bash
docker compose -f deploy/docker/docker-compose.worker.yaml up --build openai-realtime-agent
docker compose -f deploy/docker/docker-compose.worker.yaml up --build sarvam-cascade-agent
```

---

## Tracing (Self-Hosted Langfuse)

Every pipeline can export OpenTelemetry traces (per-turn VAD, STT, EOU, LLM
with TTFT, TTS, errors/interruptions — built into `videosdk-agents` itself,
no manual instrumentation needed) to a self-hosted [Langfuse](https://langfuse.com)
instance, shared across all pipelines.

![Langfuse tracing dashboard](docs/langfuse-tracing.png)

Start it once from the `voice-agent` root:

```bash
docker compose -f deploy/docker/docker-compose.langfuse.yaml -p langfuse-voice-agent up -d
```

`-p langfuse-voice-agent` pins an explicit project name — without it, Compose
infers the name from the parent folder (`docker`), which can collide with
any other compose file living in a sibling `deploy/docker/` folder on the
same machine. The compose file also sets `name:` internally as a second
layer of protection; never remove either.

The stack provisions itself headlessly (org/project/user/API keys created on
first boot — no signup or UI step) with these defaults:

- URL: http://localhost:3000
- Login: `admin@voice-agent.local` / `changeme123`
- API keys: `pk-lf-voice-agent-dev` / `sk-lf-voice-agent-dev`

Override the `LANGFUSE_INIT_*` values in the compose file before exposing
this beyond localhost.

Then in a pipeline's `.env`, set `TRACING_ENABLED=true` (and the
`LANGFUSE_*` vars if you changed the defaults above) and run it as usual.
Traces show up under **Tracing** in the Langfuse sidebar.

One gotcha: if the pipeline runs inside its own `docker compose up`
container (rather than `python runner.py` directly), `localhost` inside
that container won't reach Langfuse on the host. Use
`LANGFUSE_HOST=http://host.docker.internal:3000` instead — the pipeline's
`docker-compose.yaml` already adds the required `extra_hosts` entry for
this to resolve on Linux.

**Demo:** [Tracing walkthrough video](https://drive.google.com/file/d/1TleC4yhzONaK8AYtRJkC4GcbvBpR5_Bp/view?usp=sharing)

---

## Run Locally (Without Docker)

```bash
# Install dependencies
cd packages/python/voice-agent/src/features/openai_realtime
pip install -r requirements.txt

# Set environment variables
cp /path/to/.env .env

# Run (cloud-dispatch mode)
python runner.py
```

This runs in **cloud-dispatch mode** — it registers with the VideoSDK
backend and sits idle waiting for a job (dispatched via the VideoSDK
dashboard or dispatch API). It does **not** print a link to join, since
nothing has connected yet — this is the correct mode for how these
pipelines actually get used in production.

To test interactively instead, run in **direct mode**: it connects to a
room immediately and prints a clickable playground URL.

```bash
REGISTER=false python runner.py
```

```
Agent started in playground mode
Interact with agent here at:
https://playground.videosdk.live/cli?token=...&meetingId=...
```

Open that URL in a browser to talk to the agent directly. The process
blocks for the duration of the call (via `ctx.run_until_shutdown`) and
exits cleanly on Ctrl+C. `sarvam_cascade/runner.py` wires this `REGISTER`
toggle already; copy the same one-line change into a pipeline's `runner.py`
to enable it there too.

The SDK also binds a local debug/health server on port `8081` by default,
which can collide with other services on a shared dev machine. Override it
with `DEBUG_PORT=<port>` in `.env` if you hit `address already in use`
(`sarvam_cascade/runner.py` already reads this).

---

## Deploy to VideoSDK Cloud

```bash
cd packages/python/voice-agent/src/features/openai_realtime
videosdk deploy videosdk.yaml
```

Each pipeline has its own `videosdk.yaml` — deploy them independently.

> See [VideoSDK Deploy Docs](https://docs.videosdk.live/ai-agents/deploy) for full deployment reference.

---

## Edit a Pipeline

To change what an agent says, its instructions, model, or voice — edit only:

```
src/features/{pipeline}/src/agent.py
```

Then rebuild:

```bash
cd src/features/{pipeline}
docker compose up --build
```

---

## Add a New Pipeline

```bash
# Copy an existing pipeline as template
cp -r packages/python/voice-agent/src/features/openai_cascade \
       packages/python/voice-agent/src/features/my_pipeline

# Edit the agent logic
nano packages/python/voice-agent/src/features/my_pipeline/src/agent.py

# Edit dependencies
nano packages/python/voice-agent/src/features/my_pipeline/requirements.txt

# Build and run
cd packages/python/voice-agent/src/features/my_pipeline
docker compose up --build
```

---

## Shared Utilities

Located in `src/shared/utils/`:

| File | Purpose |
|---|---|
| `token_generator.py` | Generate [VideoSDK JWT tokens](https://docs.videosdk.live/api-reference/realtime-communication/intro) |
| `room_creator.py` | Create [VideoSDK meeting rooms](https://docs.videosdk.live/api-reference/realtime-communication/create-room) via API |
| `agent_dispatcher.py` | Dispatch agents into rooms via API |

---

## References

### VideoSDK Voice Agent SDK
- [VideoSDK AI Agents — Introduction](https://docs.videosdk.live/ai_agents/introduction)
- [VideoSDK AI Agents — Quickstart](https://docs.videosdk.live/ai_agents/introduction)
- [videosdk-agents on PyPI](https://pypi.org/project/videosdk-agents/)
- [videosdk-live/agents on GitHub](https://github.com/videosdk-live/agents)
- [VideoSDK Dashboard (get token)](https://app.videosdk.live/)
- [VideoSDK API Reference](https://docs.videosdk.live/api-reference/realtime-communication/intro)

### Pipeline Architecture
- [Cascaded Pipeline Guide](https://docs.videosdk.live/ai_agents/introduction)
- [Realtime Pipeline Guide](https://docs.videosdk.live/ai_agents/introduction)
- [Build Your Own Plugin](https://github.com/videosdk-live/agents)
- [Silero VAD](https://github.com/snakers4/silero-vad)

### Plugin Packages (PyPI)
- [videosdk-plugins-openai](https://pypi.org/project/videosdk-plugins-openai/)
- [videosdk-plugins-google](https://pypi.org/project/videosdk-plugins-google/)
- [videosdk-plugins-sarvamai](https://pypi.org/project/videosdk-plugins-sarvamai/)
- [videosdk-plugins-deepgram](https://pypi.org/project/videosdk-plugins-deepgram/)
- [videosdk-plugins-anthropic](https://pypi.org/project/videosdk-plugins-anthropic/)
- [videosdk-plugins-elevenlabs](https://pypi.org/project/videosdk-plugins-elevenlabs/)
- [videosdk-plugins-silero](https://pypi.org/project/videosdk-plugins-silero/)

### Provider Docs
- [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime)
- [OpenAI Whisper STT](https://platform.openai.com/docs/guides/speech-to-text)
- [OpenAI TTS](https://platform.openai.com/docs/guides/text-to-speech)
- [Google Gemini Live API](https://ai.google.dev/gemini-api/docs/live)
- [Google Cloud STT](https://cloud.google.com/speech-to-text/docs)
- [Google Cloud TTS](https://cloud.google.com/text-to-speech/docs)
- [Sarvam AI Docs](https://docs.sarvam.ai)
- [Deepgram STT Docs](https://developers.deepgram.com/docs/getting-started-with-pre-recorded-audio)
- [Anthropic Claude Docs](https://docs.anthropic.com/en/docs/intro-to-claude)
- [ElevenLabs TTS Docs](https://elevenlabs.io/docs/api-reference/getting-started)
