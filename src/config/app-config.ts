export const AppConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  pythonApiUrl: process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8000",
  webrtcSignalingUrl: process.env.NEXT_PUBLIC_WEBRTC_SIGNALING_URL || "ws://localhost:8082/api/v1/webrtc/signaling",
};
