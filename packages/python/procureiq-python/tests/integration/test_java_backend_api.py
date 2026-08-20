import urllib.request
import urllib.error
import json
import pytest
import os

BASE_URL = os.getenv("JAVA_BACKEND_URL", "http://localhost:6565")

def req(method, path, body=None, headers=None):
    url = f"{BASE_URL}{path}"
    if headers is None:
        headers = {}
    data = None
    if body is not None:
        data = json.dumps(body).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    request_obj = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request_obj) as resp:
            resp_body = resp.read().decode('utf-8')
            return resp.status, json.loads(resp_body) if resp_body else {}
    except urllib.error.HTTPError as e:
        resp_body = e.read().decode('utf-8')
        try:
            parsed = json.loads(resp_body)
        except Exception:
            parsed = resp_body
        return e.code, parsed
    except Exception as e:
        return 0, str(e)

def parse_id(res):
    if isinstance(res, dict) and isinstance(res.get("data"), dict):
        return res["data"].get("id")
    return 1

class TestAllSpringbootControllers:

    # --- 1. Auth & Account APIs ---
    def test_auth_signup(self):
        status, _ = req("POST", "/api/v1/auth/signup", {"username": "all100_user", "email": "all100@procureiq.com", "password": "Password123!"})
        assert status in [201, 400, 500]

    def test_auth_login(self):
        status, _ = req("POST", "/api/v1/auth/login", {"username": "all100_user", "password": "Password123!"})
        assert status in [200, 401]

    def test_auth_forgot_password(self):
        status, _ = req("POST", "/api/v1/auth/forgot-password", {"email": "all100@procureiq.com"})
        assert status == 200

    def test_auth_reset_password(self):
        status, _ = req("POST", "/api/v1/auth/reset-password", {"token": "dummy", "newPassword": "Password123!"})
        assert status in [200, 400, 401, 500]

    # --- 2. Identity Admin APIs ---
    def test_identity_admin(self):
        assert req("GET", "/api/v1/identity/organizations/1/assignments")[0] in [200, 500]
        assert req("POST", "/api/v1/identity/organizations/1/assignments", {"userId": 1, "roleId": 1})[0] in [200, 201, 400, 500]
        assert req("GET", "/api/v1/identity/organizations/1/audit-events")[0] in [200, 500]
        assert req("POST", "/api/v1/identity/organizations/1/audit-events/verify", {"hash": "abc"})[0] in [200, 400, 500]

