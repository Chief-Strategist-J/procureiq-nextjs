"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, 
  Terminal, ShieldAlert, Wifi, Users, Copy, Sparkles, Monitor
} from "lucide-react";
import { WebRtcSignalingClient } from "@/lib/webrtc-helper";

interface LogEntry {
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
  text: string;
}

export default function VideoCallPage() {
  // Connection states
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("procureiq-session-1");
  const [userId, setUserId] = useState(() => `user-${Math.floor(Math.random() * 900) + 100}`);
  
  // Media controls
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [screenShareActive, setScreenShareActive] = useState(false);

  // Status & Logs
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [peersInRoom, setPeersInRoom] = useState<string[]>([]);
  
  // WebRTC refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const signalingClientRef = useRef<WebRtcSignalingClient | null>(null);

  // Add system logging utility
  const addLog = (text: string, type: LogEntry["type"] = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [{ timestamp, type, text }, ...prev.slice(0, 49)]);
  };

  // ICE Servers config (Public STUN servers for NAT traversal)
  const iceConfiguration: RTCConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ]
  };

  // Initialize audio/video capture
  const startLocalStream = async () => {
    try {
      addLog("Requesting access to camera and microphone...", "info");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      addLog("Successfully captured camera and microphone.", "success");
    } catch (err: any) {
      addLog(`Failed to capture local stream: ${err.message}`, "error");
    }
  };

  // Create RTCPeerConnection and bind event hooks
  const createPeerConnection = (targetPeerId: string): RTCPeerConnection => {
    addLog(`Creating RTCPeerConnection for peer: ${targetPeerId}`, "info");
    const pc = new RTCPeerConnection(iceConfiguration);

    // 1. Add local tracks to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
      addLog("Added local tracks to peer connection.", "info");
    }

    // 2. Handle candidate generation from our browser
    pc.onicecandidate = (event) => {
      if (event.candidate && signalingClientRef.current) {
        addLog("Local ICE Candidate found, sending to signaling server...", "info");
        signalingClientRef.current.sendCandidate(
          targetPeerId,
          event.candidate.candidate,
          event.candidate.sdpMid || "",
          event.candidate.sdpMLineIndex || 0
        );
      }
    };

    // 3. Receive remote stream tracks
    pc.ontrack = (event) => {
      addLog("Received remote stream track from peer.", "success");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      addLog(`WebRTC Connection State: ${pc.connectionState}`, 
        pc.connectionState === "connected" ? "success" : "info"
      );
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  // Initialize WebSocket Signaling Client
  const handleJoinCall = async () => {
    if (!roomId.trim() || !userId.trim()) return;

    // First ensure we have local camera active
    if (!localStreamRef.current) {
      await startLocalStream();
    }

    addLog(`Connecting to WebSocket signaling server...`, "info");
    
    // Connect to WebRTC signaling server we built
    const client = new WebRtcSignalingClient(
      "ws://localhost:8082/api/v1/webrtc/signaling",
      roomId,
      userId,
      async (message) => {
        switch (message.type) {
          case "peer-joined":
            addLog(`New peer joined: ${message.userId}. Establishing WebRTC handshake...`, "success");
            setPeersInRoom((prev) => [...prev, message.userId]);
            
            // Create PeerConnection and initiate SDP Offer
            const pc = createPeerConnection(message.userId);
            try {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              addLog(`SDP Offer created, sending to ${message.userId}`, "info");
              client.sendOffer(message.userId, offer.sdp || "");
            } catch (err: any) {
              addLog(`Offer creation error: ${err.message}`, "error");
            }
            break;

          case "peer-left":
            addLog(`Peer left room: ${message.userId}`, "warning");
            setPeersInRoom((prev) => prev.filter(id => id !== message.userId));
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = null;
            }
            if (peerConnectionRef.current) {
              peerConnectionRef.current.close();
              peerConnectionRef.current = null;
            }
            break;

          case "offer":
            addLog(`SDP Offer received from ${message.senderId}. Setting remote description...`, "info");
            const offerPc = createPeerConnection(message.senderId);
            try {
              await offerPc.setRemoteDescription(new RTCSessionDescription({
                type: "offer",
                sdp: message.sdp
              }));
              
              const answer = await offerPc.createAnswer();
              await offerPc.setLocalDescription(answer);
              addLog(`SDP Answer created, sending to ${message.senderId}`, "info");
              client.sendAnswer(message.senderId, answer.sdp || "");
            } catch (err: any) {
              addLog(`Answer creation error: ${err.message}`, "error");
            }
            break;

          case "answer":
            addLog(`SDP Answer received from ${message.senderId}. Completing connection...`, "success");
            if (peerConnectionRef.current) {
              await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({
                type: "answer",
                sdp: message.sdp
              }));
            }
            break;

          case "candidate":
            addLog(`Received ICE Candidate from ${message.senderId}. Adding candidate...`, "info");
            if (peerConnectionRef.current) {
              try {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate({
                  candidate: message.candidate,
                  sdpMid: message.sdpMid,
                  sdpMLineIndex: message.sdpMLineIndex
                }));
              } catch (err: any) {
                addLog(`Error adding ICE candidate: ${err.message}`, "error");
              }
            }
            break;
        }
      }
    );

    client.connect();
    signalingClientRef.current = client;
    setJoined(true);
    addLog(`Joined signaling room: ${roomId} as ${userId}`, "success");
  };

  // Gracefully close WebRTC and WebSocket connection
  const handleLeaveCall = () => {
    addLog("Leaving the video session...", "warning");
    
    if (signalingClientRef.current) {
      signalingClientRef.current.disconnect();
      signalingClientRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setJoined(false);
    setPeersInRoom([]);
    setScreenShareActive(false);
    addLog("Successfully left room and released media devices.", "info");
  };

  // Toggle Video track
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoActive(videoTrack.enabled);
        addLog(`Camera ${videoTrack.enabled ? "Enabled" : "Disabled"}`, "info");
      }
    }
  };

  // Toggle Audio track
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicActive(audioTrack.enabled);
        addLog(`Microphone ${audioTrack.enabled ? "Muted" : "Unmuted"}`, "info");
      }
    }
  };

  // Handle local camera pre-warm on load
  useEffect(() => {
    startLocalStream();
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <h1 className="text-lg font-light tracking-wider flex items-center gap-2">
              ProcureIQ <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">Custom WebRTC SFU</span>
            </h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1">100% Self-Hosted & Peer-to-Peer encrypted video call channel</p>
        </div>

        {joined && (
          <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 px-4 py-1.5 rounded-full text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {peersInRoom.length + 1} Active</span>
            <span className="h-4 w-[1px] bg-zinc-800"></span>
            <span className="flex items-center gap-1.5"><Wifi className="h-3.5 w-3.5 text-emerald-500" /> WSS Signal</span>
          </div>
        )}
      </div>

      {/* Main Grid split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Videos Area */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[450px]">
            
            {/* Local Video Stream */}
            <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden flex items-center justify-center group shadow-2xl">
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-zinc-800 px-3 py-1 rounded-full text-xs font-mono">
                {userId} (You)
              </div>
              {!videoActive && (
                <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center text-zinc-500">
                  <VideoOff className="h-12 w-12 mb-2 stroke-[1]" />
                  <span className="text-xs font-light tracking-widest">CAMERA INACTIVE</span>
                </div>
              )}
            </div>

            {/* Remote Video Stream */}
            <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden flex items-center justify-center shadow-2xl">
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-zinc-800 px-3 py-1 rounded-full text-xs font-mono">
                {peersInRoom.length > 0 ? peersInRoom[0] : "Waiting for peer..."}
              </div>
              {peersInRoom.length === 0 && (
                <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-zinc-500">
                  <div className="h-10 w-10 rounded-full border-t border-r border-zinc-600 animate-spin mb-4"></div>
                  <span className="text-xs font-light tracking-widest text-zinc-400">WAITING FOR OTHER SIDE</span>
                  <span className="text-[10px] text-zinc-600 mt-1 uppercase">Share Room ID: {roomId}</span>
                </div>
              )}
            </div>

          </div>

          {/* Controls Bar */}
          <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex gap-2">
              <button 
                onClick={toggleAudio}
                className={`h-11 w-11 rounded-lg border transition-all flex items-center justify-center ${
                  micActive 
                    ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800" 
                    : "bg-red-950/40 border-red-800 text-red-500"
                }`}
              >
                {micActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>

              <button 
                onClick={toggleVideo}
                className={`h-11 w-11 rounded-lg border transition-all flex items-center justify-center ${
                  videoActive 
                    ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800" 
                    : "bg-red-950/40 border-red-800 text-red-500"
                }`}
              >
                {videoActive ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </button>
            </div>

            {joined ? (
              <button 
                onClick={handleLeaveCall}
                className="bg-red-600 hover:bg-red-500 text-white font-medium text-xs px-6 py-2.5 rounded-lg flex items-center gap-2 tracking-wider transition-colors shadow-lg shadow-red-900/30"
              >
                <PhoneOff className="h-4 w-4" /> DISCONNECT
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={roomId} 
                  onChange={(e) => setRoomId(e.target.value)} 
                  placeholder="Room ID"
                  className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg text-xs font-mono text-zinc-300 w-44 focus:outline-none focus:border-zinc-600"
                />
                <button 
                  onClick={handleJoinCall}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-6 py-2.5 rounded-lg flex items-center gap-2 tracking-wider transition-colors"
                >
                  <Sparkles className="h-4 w-4" /> START CALL
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Real-time WebRTC Logging Console */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden max-h-[570px] shadow-2xl">
          <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
            <span className="text-xs font-medium tracking-wide flex items-center gap-1.5 text-zinc-300">
              <Terminal className="h-4 w-4 text-zinc-500" /> LOG CONSOLE
            </span>
            <button 
              onClick={() => setLogs([])}
              className="text-[10px] text-zinc-500 hover:text-white transition-colors uppercase"
            >
              Clear
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto font-mono text-[10px] space-y-2.5 scrollbar-thin scrollbar-thumb-zinc-800">
            {logs.length === 0 ? (
              <div className="text-zinc-600 text-center mt-12 italic uppercase">Console idle. Join a room to see WebRTC event loops.</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="leading-relaxed border-b border-zinc-900/50 pb-1.5">
                  <div className="flex justify-between text-zinc-600 mb-0.5">
                    <span>{log.timestamp}</span>
                    <span className={`text-[8px] px-1 rounded uppercase ${
                      log.type === "success" ? "bg-emerald-950 text-emerald-400" :
                      log.type === "error" ? "bg-red-950 text-red-400" :
                      log.type === "warning" ? "bg-amber-950 text-amber-400" : "bg-zinc-900 text-zinc-500"
                    }`}>{log.type}</span>
                  </div>
                  <div className={`${
                    log.type === "success" ? "text-emerald-400" :
                    log.type === "error" ? "text-red-400" :
                    log.type === "warning" ? "text-amber-400" : "text-zinc-300"
                  }`}>{log.text}</div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}