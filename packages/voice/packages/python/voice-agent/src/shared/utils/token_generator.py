import jwt
import datetime

def generate_token(api_key: str, secret_key: str) -> str:
    payload = {
        "apikey": api_key,
        "permissions": ["allow_join", "allow_mod"],
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    token = jwt.encode(payload, secret_key, algorithm="HS256")
    return token
