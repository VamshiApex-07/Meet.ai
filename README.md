# Meet.AI

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green)

An AI-powered meeting assistant. Create AI agents that join your video calls, transcribe conversations, generate summaries, and let you chat with agents about what was discussed after the meeting ends.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 15 (App Router)                   │
│  ┌──────────────┐  ┌────────────┐  ┌────────────────────┐  │
│  │  tRPC API    │  │  Stream    │  │  Inngest Background│  │
│  │  (CRUD +     │  │  Video +   │  │  Jobs (Summarizer) │  │
│  │  Dashboard)  │  │  Chat      │  │                    │  │
│  └──────┬───────┘  └─────┬──────┘  └─────────┬──────────┘  │
│         │                │                   │              │
│  ┌──────▼────────────────▼───────────────────▼──────────┐  │
│  │            Drizzle ORM + Neon (PostgreSQL)            │  │
│  └────────────────────────┬─────────────────────────────┘  │
│                           │                                │
├───────────────────────────┼────────────────────────────────┤
│                           │                                │
│            ┌──────────────▼──────────────┐                 │
│            │  Python FastAPI Microservice │                 │
│            │  (Vision Agents + Gemini)   │                 │
│            └─────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS v4, shadcn/ui, Radix UI, Framer Motion |
| **API Layer** | tRPC v11 + TanStack Query v5 (end-to-end type safety) |
| **Database** | PostgreSQL (Neon Serverless) + Drizzle ORM |
| **Auth** | Better-Auth (email/password, Google OAuth, GitHub OAuth) |
| **Video** | Stream Video SDK (WebRTC, transcription, recording) |
| **Chat** | Stream Chat SDK (post-meeting Q&A with AI) |
| **LLM** | Groq (llama-3.3-70b) — summarization, chat responses |
| **AI Voice** | Google Gemini — real-time voice agent via Vision Agents SDK |
| **Background Jobs** | Inngest (event-driven, serverless-agnostic) |
| **Payments** | Polar.sh (subscription management, free tier enforcement) |
| **Agent Service** | Python FastAPI + Vision Agents SDK (edge-deployed AI) |

## Key Features

- **AI Meeting Agents** — Create customizable AI agents with instructions and voice. Agents join calls, listen, and interact as participants.
- **Video Calls** — WebRTC video with lobby controls, speaker layout, transcription (auto-on), and recording (1080p).
- **Smart Summaries** — After each meeting, an LLM generates a structured markdown summary (overview + timestamped notes).
- **Post-Meeting Chat** — Chat with the AI agent about the meeting. The agent is scoped to answer only meeting-related questions.
- **Searchable Transcripts** — Full-text transcript search with speaker identification and highlighted results.
- **Dashboard** — Central overview with stats cards (total meetings, active now, completed, hours logged, agents), recent activity lists, and free trial progress.
- **Export** — Download meeting summaries as PDF.
- **Free Tier** — Limited usage (3 meetings, 1 agent) with upsell to paid plans via Polar.sh.
- **Command Palette** — Cmd+K quick search for meetings and agents.
- **Responsive** — Mobile-friendly with drawer/dialog adaptive UI.

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   #   Sign-in, sign-up
│   ├── (dashboard)/              #   Dashboard, meetings, agents, upgrade
│   ├── call/                     #   Video call pages (full-screen)
│   └── api/                      #   API routes (tRPC, auth, webhooks, Inngest)
│
├── modules/                      # Feature-Sliced Design modules
│   ├── agents/                   #   AI agent CRUD + UI
│   │   ├── server/procedures.ts  #     tRPC router (getMany, getOne, create, update, remove)
│   │   ├── schemas.ts            #     Zod validation schemas
│   │   └── ui/                   #     Components + views
│   │
│   ├── meetings/                 #   Meeting management + lifecycle
│   │   ├── server/procedures.ts  #     tRPC router (CRUD, tokens, transcript, dashboard stats)
│   │   ├── schemas.ts            #     Zod validation schemas
│   │   └── ui/                   #     Components (states, chat, transcript) + views
│   │
│   ├── call/                     #   Video call flow
│   │   └── ui/                   #     Lobby, active call, ended state
│   │
│   ├── auth/                     #   Authentication views
│   ├── dashboard/                #   Layout, sidebar, navbar, dashboard view
│   ├── premium/                  #   Subscription management + free tier
│   └── home/                     #   Home page (redirects to dashboard)
│
├── trpc/                         # tRPC infrastructure
│   ├── init.ts                   #   Router init, procedures (protected, premium)
│   ├── client.tsx                #   Client-side provider
│   ├── server.tsx                #   Server-side helpers
│   └── routers/_app.ts           #   Combined app router
│
├── db/                           # Database
│   ├── schema.ts                 #   Drizzle schema (users, agents, meetings)
│   └── index.ts                  #   DB client
│
├── inngest/                      # Background jobs
│   ├── client.ts                 #   Inngest client
│   └── functions.ts             #   Meeting processing (transcript → summary)
│
├── components/                   # Shared UI (shadcn/ui primitives)
├── hooks/                        # Shared hooks (useConfirm, useMobile)
└── lib/                          # Service configs (auth, polar, stream, utils)

vision-agent-service/             # Python FastAPI microservice
└── main.py                       #   Gemini real-time voice agent
```

## Meeting Lifecycle

```
Create Meeting → User Joins Lobby → AI Agent Joins (Gemini voice)
                                            ↓
                                     Active Call
                                            ↓
                              Participant Leaves → Call Ends
                                            ↓
                                     Processing
                                    (Inngest job)
                                    ┌────┴────┐
                                    │         │
                               Transcript   Summary
                               (Stream)    (Groq LLM)
                                    │         │
                                    └────┬────┘
                                         ↓
                                    Completed
                               ┌───────┼───────┐
                               │      │       │
                          Summary  Transcript Recording
                          + PDF     (search)  (video)
                          Export
                               │
                          Ask AI (Chat)
                          (Groq via webhook)
```

1. **Create** — User creates a meeting with a name + assigned agent. Stream Video call is created with transcription and recording auto-enabled.
2. **Lobby** — User enters the call lobby with video/audio preview and toggle controls.
3. **Join** — User joins the call. Webhook triggers status `active` and starts the Vision Agents Python service, which deploys a Gemini-powered voice agent into the call.
4. **Active** — Participants talk. The AI agent listens and can speak based on its instructions. Stream handles transcription and recording.
5. **End** — Last participant leaves. Webhook detects `call.session_ended`, sets status to `processing`.
6. **Processing** — Inngest job fetches the transcript from Stream, parses JSONL, looks up speaker names, and sends to Groq (llama-3.3-70b) for summarization. Result saved to DB as markdown.
7. **Complete** — Status set to `completed`. User sees summary (auto-refreshed via polling), can search transcript, watch recording, download PDF, or chat with the agent about the meeting.

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+ (for vision agent service)
- A Neon PostgreSQL database
- API keys: Stream, Groq, Google Gemini, Polar.sh, GitHub/Google OAuth

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill environment variables
cp .env.example .env

# 3. Push database schema
npm run db:push

# 4. Start the Next.js dev server
npm run dev

# 5. (Optional) Start the vision agent service for AI voice
cd vision-agent-service
pip install -r requirements.txt
python main.py
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Better-Auth encryption secret |
| `BETTER_AUTH_URL` | Yes | Auth callback URL (e.g. `http://localhost:3000`) |
| `GROQ_API_KEY` | Yes | Groq API key (LLM for summaries + chat) |
| `GEMINI_API_KEY` | Yes | Google Gemini API key (real-time AI voice) |
| `STREAM_API_KEY` | Yes | Stream Video API key |
| `STREAM_API_SECRET` | Yes | Stream Video API secret |
| `NEXT_PUBLIC_STREAM_VIDEO_API_KEY` | Yes | Stream Video public key (client-side) |
| `STREAM_VIDEO_SECRET_KEY` | Yes | Stream Video server secret |
| `NEXT_PUBLIC_STREAM_CHAT_API_KEY` | Yes | Stream Chat public key |
| `STREAM_CHAT_SECRET_KEY` | Yes | Stream Chat server secret |
| `GITHUB_CLIENT_ID` | For GitHub OAuth | GitHub OAuth app ID |
| `GITHUB_CLIENT_SECRET` | For GitHub OAuth | GitHub OAuth app secret |
| `GOOGLE_CLIENT_ID` | For Google OAuth | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | For Google OAuth | Google OAuth client secret |
| `POLAR_ACCESS_TOKEN` | For payments | Polar.sh access token |
| `INNGEST_APP_URL` | For background jobs | Inngest app webhook URL |
| `VISION_AGENTS_URL` | For AI voice | Python service URL (default: `http://localhost:8000`) |
| `VISION_AGENT_SECRET` | For AI voice | Shared secret between Next.js and Python service |

## Design Decisions

- **tRPC over REST** — End-to-end type safety from DB schema to React components. No manual API client generation.
- **Feature-Sliced Modules** — Each feature (agents, meetings, call) is self-contained with its own schemas, types, procedures, and UI. Easy to add or modify features without touching unrelated code.
- **Server-side prefetching** — Key pages (dashboard, meeting detail) prefetch data during SSR using `getQueryClient` + `HydrationBoundary`, avoiding client-side loading spinners.
- **Polling over WebSockets for processing state** — During meeting processing, the detail page polls every 5 seconds. Simpler than maintaining a WebSocket connection, and the latency is acceptable (processing takes 10-60 seconds).
- **Webhook-driven AI pipeline** — Stream webhooks trigger the entire post-meeting pipeline (transcript delivery, summarization, status transitions). This decouples processing from the user's request lifecycle.
- **Separate Python microservice for voice AI** — The Gemini real-time agent runs in a dedicated Python service, isolated from the Next.js rendering path. This keeps the main app responsive.
- **Prompt injection boundaries** — User-provided agent instructions are delimited with clear start/end markers, followed by hard boundary rules that the model cannot override.
