import http.client
import json
from typing import Optional

def create_videosdk_room(token: str) -> Optional[str]:
    conn = http.client.HTTPSConnection("api.videosdk.live")
    headers = {
        "Authorization": token,
        "Content-Type": "application/json"
    }
    try:
        conn.request("POST", "/v2/rooms", headers=headers)
        res = conn.getresponse()
        data = res.read()
        if res.status == 200:
            result = json.loads(data.decode("utf-8"))
            return result.get("roomId")
        return None
    except Exception:
        return None
    finally:
        conn.close()
