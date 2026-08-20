# Voice Agent Platform

Multi-provider AI voice agent platform built on [VideoSDK](https://videosdk.live). Supports 7 independent pipelines covering realtime, cascade, and SIP architectures — each fully self-contained and deployable on its own.

> 📦 Full usage guide → [`packages/python/voice-agent/README.md`](packages/python/voice-agent/README.md)

[![Watch the demo](https://img.shields.io/badge/▶-Watch_the_demo_video-red?style=for-the-badge)](https://drive.google.com/file/d/1TleC4yhzONaK8AYtRJkC4GcbvBpR5_Bp/view?usp=sharing)

---

## Pipelines

| Pipeline | STT | LLM | TTS | Type |
|---|---|---|---|---|
| `openai_realtime` | — | [GPT-4o Realtime](https://platform.openai.com/docs/guides/realtime) | — | Realtime |
| `google_realtime` | — | [Gemini 2.0 Flash Live](https://ai.google.dev/gemini-api/docs/live) | — | Realtime |
| `openai_cascade` | [OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text) | [GPT-4o](https://platform.openai.com/docs/models/gpt-4o) | [OpenAI TTS](https://platform.openai.com/docs/guides/text-to-speech) | Cascade |
| `google_cascade` | [Google STT](https://cloud.google.com/speech-to-text) | [Gemini 1.5 Flash](https://ai.google.dev/gemini-api/docs/models/gemini) | [Google TTS](https://cloud.google.com/text-to-speech) | Cascade |
| `sarvam_cascade` | [Sarvam AI](https://docs.sarvam.ai) | [Sarvam AI](https://docs.sarvam.ai) | [Sarvam AI](https://docs.sarvam.ai) | Cascade |
| `custom_cascade` | [Deepgram](https://developers.deepgram.com) | [Claude 3.5 Sonnet](https://www.anthropic.com/claude) | [ElevenLabs](https://elevenlabs.io) | Cascade |
| `sip` | [OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text) | [GPT-4o](https://platform.openai.com/docs/models/gpt-4o) | [OpenAI TTS](https://platform.openai.com/docs/guides/text-to-speech) | SIP/Telephony |

All pipelines use **[Silero VAD](https://github.com/snakers4/silero-vad)** · SDK: [`videosdk-agents`](https://pypi.org/project/videosdk-agents/) · [GitHub](https://github.com/videosdk-live/agents)

---

## Tracing

Every pipeline exports per-turn STT/LLM/TTS traces (cost, latency, TTFT) to a
self-hosted [Langfuse](https://langfuse.com) instance — no manual
instrumentation, no signup step. See
[Tracing (Self-Hosted Langfuse)](packages/python/voice-agent/README.md#tracing-self-hosted-langfuse)
for setup.

![Langfuse tracing dashboard](packages/python/voice-agent/docs/langfuse-tracing.png)

[![Watch the tracing demo](https://img.shields.io/badge/▶-Watch_the_tracing_demo-red?style=for-the-badge)](https://drive.google.com/file/d/1TleC4yhzONaK8AYtRJkC4GcbvBpR5_Bp/view?usp=sharing)

---

## Repository Structure

```
voice/
├── packages/
│   └── python/
│       └── voice-agent/
│           ├── src/
│           │   └── features/
│           │       ├── openai_realtime/   ← self-contained pipeline
│           │       ├── google_realtime/   ← self-contained pipeline
│           │       ├── openai_cascade/    ← self-contained pipeline
│           │       ├── google_cascade/    ← self-contained pipeline
│           │       ├── sarvam_cascade/    ← self-contained pipeline
│           │       ├── custom_cascade/    ← self-contained pipeline
│           │       └── sip/               ← self-contained pipeline
│           ├── deploy/
│           │   └── docker/
│           │       ├── docker-compose.worker.yaml   ← run all pipelines
│           │       └── docker-compose.langfuse.yaml ← self-hosted tracing backend
│           └── README.md                  ← full usage guide
└── policies/                              ← development rules & architecture
```

Each pipeline folder contains everything needed to run independently:

```
src/features/{pipeline}/
├── src/agent.py          ← edit this to change agent behaviour
├── Dockerfile            ← builds only this pipeline
├── docker-compose.yaml   ← run this pipeline locally
├── requirements.txt      ← this pipeline's dependencies only
├── runner.py             ← entry point
├── videosdk.yaml         ← VideoSDK cloud deployment manifest
└── context.yaml          ← pipeline metadata
```

---

## Quick Start

### 1. Pick a pipeline and create its `.env`

```bash
cd packages/python/voice-agent/src/features/openai_realtime
cp ../../.env .env
# Fill in: VIDEOSDK_TOKEN, VIDEOSDK_MEETING_ID, OPENAI_API_KEY
```

### 2. Run with Docker

```bash
docker compose up --build
```

### 3. Deploy to VideoSDK Cloud

```bash
videosdk deploy videosdk.yaml
```

That's it. **You never need to leave the pipeline folder.**

Want to see per-turn STT/LLM/TTS traces (cost, latency, TTFT)? See
[Tracing (Self-Hosted Langfuse)](packages/python/voice-agent/README.md#tracing-self-hosted-langfuse)
in the full usage guide.

---

## Run All Pipelines Together

```bash
cd packages/python/voice-agent
docker compose -f deploy/docker/docker-compose.worker.yaml up --build
```

---

## Provider API Keys

| Provider | Get API Key |
|---|---|
| [VideoSDK](https://videosdk.live) | [app.videosdk.live](https://app.videosdk.live/) |
| [OpenAI](https://openai.com) | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| [Google AI](https://ai.google.dev) | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |
| [Sarvam AI](https://www.sarvam.ai) | [dashboard.sarvam.ai](https://dashboard.sarvam.ai) |
| [Deepgram](https://deepgram.com) | [console.deepgram.com](https://console.deepgram.com) |
| [Anthropic](https://www.anthropic.com) | [console.anthropic.com](https://console.anthropic.com) |
| [ElevenLabs](https://elevenlabs.io) | [elevenlabs.io/app/api-key](https://elevenlabs.io/app/api-key) |

---

## References

- [VideoSDK AI Agents Docs](https://docs.videosdk.live/ai_agents/introduction)
- [videosdk-agents on PyPI](https://pypi.org/project/videosdk-agents/)
- [videosdk-live/agents on GitHub](https://github.com/videosdk-live/agents)
- [Full usage guide](packages/python/voice-agent/README.md)
