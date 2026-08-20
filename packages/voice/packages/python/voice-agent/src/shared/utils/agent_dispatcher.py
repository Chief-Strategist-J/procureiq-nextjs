import http.client
import json
from typing import Optional, Dict, Any

def dispatch_videosdk_agent(
    token: str,
    meeting_id: str,
    agent_id: str,
    metadata: Optional[Dict[str, Any]] = None
) -> Optional[Dict[str, Any]]:
    conn = http.client.HTTPSConnection("api.videosdk.live")
    headers = {
        "Authorization": token,
        "Content-Type": "application/json"
    }
    payload = {
        "meetingId": meeting_id,
        "agentId": agent_id
    }
    if metadata:
        payload["metadata"] = metadata
        
    try:
        conn.request("POST", "/v2/agent/dispatch", body=json.dumps(payload), headers=headers)
        res = conn.getresponse()
        data = res.read()
        if res.status in (200, 201):
            return json.loads(data.decode("utf-8"))
        return {"error": res.status, "message": data.decode("utf-8")}
    except Exception as e:
        return {"error": "connection_error", "message": str(e)}
    finally:
        conn.close()
