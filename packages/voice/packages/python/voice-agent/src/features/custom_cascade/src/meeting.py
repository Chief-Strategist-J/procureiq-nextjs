import datetime
import http.client
import json

import jwt


def generate_token(api_key: str, secret_key: str) -> str:
    """Self-issue a VideoSDK JWT so this pipeline never depends on a
    manually pasted VIDEOSDK_TOKEN."""
    payload = {
        "apikey": api_key,
        "permissions": ["allow_join", "allow_mod"],
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24),
    }
    return jwt.encode(payload, secret_key, algorithm="HS256")


def create_room(token: str) -> str:
    """Create a fresh VideoSDK room and return its roomId.

    Raises RuntimeError on failure — a room_id is required to join,
    there is no safe fallback value."""
    conn = http.client.HTTPSConnection("api.videosdk.live")
    try:
        conn.request(
            "POST",
            "/v2/rooms",
            headers={"Authorization": token, "Content-Type": "application/json"},
        )
        res = conn.getresponse()
        data = res.read()
        if res.status != 200:
            raise RuntimeError(f"VideoSDK room creation failed: {res.status} {data.decode()}")
        return json.loads(data.decode())["roomId"]
    finally:
        conn.close()


def resolve_room(
    meeting_id: str | None,
    token: str | None,
    api_key: str,
    secret_key: str,
) -> tuple[str, str]:
    """Return (room_id, auth_token), self-issuing a token and/or creating
    a room for whichever of VIDEOSDK_MEETING_ID / VIDEOSDK_TOKEN is missing."""
    if not token:
        token = generate_token(api_key, secret_key)
    if not meeting_id:
        meeting_id = create_room(token)
    return meeting_id, token
