import asyncio
import os
import logging
from dotenv import load_dotenv
from pydantic import BaseModel
from google.genai import types
from vision_agents.core import Agent, AgentLauncher, Runner, User, ServeOptions
from vision_agents.plugins import getstream, gemini
from fastapi import Request, HTTPException

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)-8s | %(message)s")
logging.getLogger("aiortc").setLevel(logging.WARNING)
logging.getLogger("vision_agents").setLevel(logging.INFO)
logger = logging.getLogger("agent_service")
logger.setLevel(logging.DEBUG)


class StartSessionBody(BaseModel):
    call_type: str = "default"
    instructions: str = "You are a helpful voice assistant. Be concise."
    agent_id: str
    agent_name: str
    voice: str = "Kore"


class ConfigStore:
    _lock = asyncio.Lock()
    _queue: list[dict] = []

    @classmethod
    async def push(cls, config: dict) -> None:
        async with cls._lock:
            cls._queue.append(config)
            logger.info("ConfigStore: pushed %s (depth=%d)", config.get("agent_name"), len(cls._queue))

    @classmethod
    async def pop(cls) -> dict | None:
        async with cls._lock:
            if cls._queue:
                config = cls._queue.pop(0)
                logger.info("ConfigStore: popped %s (remaining=%d)", config.get("agent_name"), len(cls._queue))
                return config
            logger.info("ConfigStore: empty queue")
            return None


launcher: AgentLauncher | None = None


async def create_agent(**kwargs) -> Agent:
    config = await ConfigStore.pop()

    if config is not None:
        agent_name = config["agent_name"]
        agent_id = config["agent_id"]
        instructions = config["instructions"]
        voice = config.get("voice", "Kore")
        logger.info("SESSION AGENT: name=%s id=%s", agent_name, agent_id)
    else:
        logger.info("WARMUP AGENT: no config available")
        agent_name = "__warmup__"
        agent_id = "__warmup__"
        instructions = "Warmup initialization"
        voice = "Kore"

    live_config = types.LiveConnectConfig(
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name=voice,
                ),
            ),
        ),
    )

    return Agent(
        edge=getstream.Edge(),
        agent_user=User(
            name=agent_name,
            id=agent_id,
        ),
        instructions=instructions,
        llm=gemini.Realtime(config=live_config),
    )


async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs) -> None:
    call = await agent.create_call(call_type, call_id)
    async with agent.join(call):
        await asyncio.sleep(1)
        if agent.agent_user.name != "__warmup__":
            logger.info("[Agent: %s] Triggering greeting...", agent.agent_user.name)
            await agent.simple_response("Greet everyone, introduce yourself by name, and explain why you are here.")
        await agent.finish()


from vision_agents.core.runner.http.api import router as _sdk_router
_sdk_router.routes = [
    r for r in _sdk_router.routes
    if not (
        hasattr(r, 'path') and r.path == '/calls/{call_id}/sessions'
        and hasattr(r, 'methods') and 'POST' in r.methods
    )
]

_launcher = AgentLauncher(
    create_agent=create_agent,
    join_call=join_call,
    max_concurrent_sessions=10,
    max_sessions_per_call=1,
)
launcher = _launcher
runner = Runner(launcher, serve_options=ServeOptions(cors_allow_origins=["*"]))


VISION_AGENT_SECRET = os.environ.get("VISION_AGENT_SECRET", "")


@runner.fast_api.post("/calls/{call_id}/sessions")
async def custom_start_session(call_id: str, body: StartSessionBody, request: Request):
    if VISION_AGENT_SECRET:
        secret = request.headers.get("x-agent-secret", "")
        if secret != VISION_AGENT_SECRET:
            raise HTTPException(status_code=401, detail="Invalid or missing agent secret")
    logger.info("SESSION REQUEST: call=%s agent_name=%s", call_id, body.agent_name)
    await ConfigStore.push({
        "agent_name": body.agent_name,
        "agent_id": body.agent_id,
        "instructions": body.instructions,
        "voice": body.voice,
    })

    session = await launcher.start_session(
        call_id=call_id,
        call_type=body.call_type,
    )

    logger.info("SESSION STARTED: session_id=%s agent_name=%s", session.id, body.agent_name)
    return {
        "session_id": session.id,
        "call_id": call_id,
        "session_started_at": session.started_at.isoformat(),
    }


@runner.fast_api.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    runner.cli()
