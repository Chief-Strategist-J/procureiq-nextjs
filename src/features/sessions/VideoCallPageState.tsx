import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { sessionsActions } from "./sessionsSlice";
import { WebRtcSignalingClient } from "@/lib/webrtc-helper";
import { AppConfig } from "@/config/app-config";

interface LogEntry {
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
  text: string;
}

export class VideoCallPageState {
  // ICE Servers config
  public iceConfiguration: RTCConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ]
  };

  constructor(
    public dispatch: ReturnType<typeof useAppDispatch>,
    public items: any,
    public status: any,
    public error: any,
    public formFields: any,
    public localVideoRef: React.RefObject<HTMLVideoElement | null>,
    public remoteVideoRef: React.RefObject<HTMLVideoElement | null>,
    public localStreamRef: React.MutableRefObject<MediaStream | null>,
    public peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>,
    public signalingClientRef: React.MutableRefObject<WebRtcSignalingClient | null>
  ) {}

  get joined() {
    return !!this.formFields.joined;
  }

  get roomId() {
    return this.formFields.roomId ?? "procureiq-session-1";
  }

  get userId() {
    return this.formFields.userId ?? "";
  }

  get micActive() {
    return this.formFields.micActive ?? true;
  }

  get videoActive() {
    return this.formFields.videoActive ?? true;
  }

  get screenShareActive() {
    return this.formFields.screenShareActive ?? false;
  }

  get logs(): LogEntry[] {
    return this.formFields.logs ?? [];
  }

  get peersInRoom(): string[] {
    return this.formFields.peersInRoom ?? [];
  }

  // System logging utility via Redux
  addLog = (text: string, type: LogEntry["type"] = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    const newLogs = [{ timestamp, type, text }, ...(this.logs || []).slice(0, 49)];
    this.dispatch(sessionsActions.setFormField({ field: "logs", value: newLogs }));
  };

  // Initialize audio/video capture
  startLocalStream = async () => {
    try {
      this.addLog("Requesting access to camera and microphone...", "info");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      this.localStreamRef.current = stream;
      if (this.localVideoRef.current) {
        this.localVideoRef.current.srcObject = stream;
      }
      this.addLog("Successfully captured camera and microphone.", "success");
    } catch (err: any) {
      this.addLog(`Failed to capture local stream: ${err.message}`, "error");
    }
  };

  // Create RTCPeerConnection and bind event hooks
  createPeerConnection = (targetPeerId: string): RTCPeerConnection => {
    this.addLog(`Creating RTCPeerConnection for peer: ${targetPeerId}`, "info");
    const pc = new RTCPeerConnection(this.iceConfiguration);

    if (this.localStreamRef.current) {
      this.localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStreamRef.current!);
      });
      this.addLog("Added local tracks to peer connection.", "info");
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && this.signalingClientRef.current) {
        this.addLog("Local ICE Candidate found, sending to signaling server...", "info");
        this.signalingClientRef.current.sendCandidate(
          targetPeerId,
          event.candidate.candidate,
          event.candidate.sdpMid || "",
          event.candidate.sdpMLineIndex || 0
        );
      }
    };

    pc.ontrack = (event) => {
      this.addLog("Received remote stream track from peer.", "success");
      if (this.remoteVideoRef.current) {
        this.remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      this.addLog(`WebRTC Connection State: ${pc.connectionState}`, 
        pc.connectionState === "connected" ? "success" : "info"
      );
    };

    this.peerConnectionRef.current = pc;
    return pc;
  };

  handleJoinCall = async () => {
    if (!this.roomId.trim() || !this.userId.trim()) return;

    if (!this.localStreamRef.current) {
      await this.startLocalStream();
    }

    this.addLog(`Connecting to WebSocket signaling server...`, "info");
    
    const client = new WebRtcSignalingClient(
      AppConfig.webrtcSignalingUrl,
      this.roomId,
      this.userId,
      async (message) => {
        switch (message.type) {
          case "peer-joined":
            this.addLog(`New peer joined: ${message.userId}. Establishing WebRTC handshake...`, "success");
            this.dispatch(sessionsActions.setFormField({ field: "peersInRoom", value: [...this.peersInRoom, message.userId] }));
            
            const pc = this.createPeerConnection(message.userId);
            try {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              this.addLog(`SDP Offer created, sending to ${message.userId}`, "info");
              client.sendOffer(message.userId, offer.sdp || "");
            } catch (err: any) {
              this.addLog(`Offer creation error: ${err.message}`, "error");
            }
            break;

          case "peer-left":
            this.addLog(`Peer left room: ${message.userId}`, "warning");
            this.dispatch(sessionsActions.setFormField({ field: "peersInRoom", value: this.peersInRoom.filter(id => id !== message.userId) }));
            if (this.remoteVideoRef.current) {
              this.remoteVideoRef.current.srcObject = null;
            }
            if (this.peerConnectionRef.current) {
              this.peerConnectionRef.current.close();
              this.peerConnectionRef.current = null;
            }
            break;

          case "offer":
            this.addLog(`SDP Offer received from ${message.senderId}. Setting remote description...`, "info");
            const offerPc = this.createPeerConnection(message.senderId);
            try {
              await offerPc.setRemoteDescription(new RTCSessionDescription({
                type: "offer",
                sdp: message.sdp
              }));
              
              const answer = await offerPc.createAnswer();
              await offerPc.setLocalDescription(answer);
              this.addLog(`SDP Answer created, sending to ${message.senderId}`, "info");
              client.sendAnswer(message.senderId, answer.sdp || "");
            } catch (err: any) {
              this.addLog(`Answer creation error: ${err.message}`, "error");
            }
            break;

          case "answer":
            this.addLog(`SDP Answer received from ${message.senderId}. Completing connection...`, "success");
            if (this.peerConnectionRef.current) {
              await this.peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({
                type: "answer",
                sdp: message.sdp
              }));
            }
            break;

          case "candidate":
            this.addLog(`Received ICE Candidate from ${message.senderId}. Adding candidate...`, "info");
            if (this.peerConnectionRef.current) {
              try {
                await this.peerConnectionRef.current.addIceCandidate(new RTCIceCandidate({
                  candidate: message.candidate,
                  sdpMid: message.sdpMid,
                  sdpMLineIndex: message.sdpMLineIndex
                }));
              } catch (err: any) {
                this.addLog(`Error adding ICE candidate: ${err.message}`, "error");
              }
            }
            break;
        }
      }
    );

    client.connect();
    this.signalingClientRef.current = client;
    this.dispatch(sessionsActions.setFormField({ field: "joined", value: true }));
    this.addLog(`Joined signaling room: ${this.roomId} as ${this.userId}`, "success");
  };

  handleLeaveCall = () => {
    this.addLog("Leaving the video session...", "warning");
    
    if (this.signalingClientRef.current) {
      this.signalingClientRef.current.disconnect();
      this.signalingClientRef.current = null;
    }

    if (this.peerConnectionRef.current) {
      this.peerConnectionRef.current.close();
      this.peerConnectionRef.current = null;
    }

    if (this.localStreamRef.current) {
      this.localStreamRef.current.getTracks().forEach((track) => track.stop());
      this.localStreamRef.current = null;
    }

    if (this.localVideoRef.current) this.localVideoRef.current.srcObject = null;
    if (this.remoteVideoRef.current) this.remoteVideoRef.current.srcObject = null;

    this.dispatch(sessionsActions.setFormField({ field: "joined", value: false }));
    this.dispatch(sessionsActions.setFormField({ field: "peersInRoom", value: [] }));
    this.dispatch(sessionsActions.setFormField({ field: "screenShareActive", value: false }));
    this.addLog("Successfully left room and released media devices.", "info");
  };

  toggleVideo = () => {
    if (this.localStreamRef.current) {
      const videoTrack = this.localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        this.dispatch(sessionsActions.setFormField({ field: "videoActive", value: videoTrack.enabled }));
        this.addLog(`Camera ${videoTrack.enabled ? "Enabled" : "Disabled"}`, "info");
      }
    }
  };

  toggleAudio = () => {
    if (this.localStreamRef.current) {
      const audioTrack = this.localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        this.dispatch(sessionsActions.setFormField({ field: "micActive", value: audioTrack.enabled }));
        this.addLog(`Microphone ${audioTrack.enabled ? "Muted" : "Unmuted"}`, "info");
      }
    }
  };
}

export function useVideoCallPageState() {
  const dispatch = useAppDispatch();
  const { data: items, status, error } = useAppSelector((state) => state.sessions.items);
  const { formFields } = useAppSelector((state) => state.sessions.ui);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const signalingClientRef = useRef<WebRtcSignalingClient | null>(null);

  const state = new VideoCallPageState(
    dispatch,
    items,
    status,
    error,
    formFields,
    localVideoRef,
    remoteVideoRef,
    localStreamRef,
    peerConnectionRef,
    signalingClientRef
  );

  useEffect(() => {
    state.dispatch(sessionsActions.fetchRequest(undefined as any));
  }, []);

  useEffect(() => {
    // Generate random user ID if not set
    if (!formFields.userId) {
      const randomUserId = `user-${Math.floor(Math.random() * 900) + 100}`;
      dispatch(sessionsActions.setFormField({ field: "userId", value: randomUserId }));
    }
  }, [dispatch, formFields.userId]);

  useEffect(() => {
    state.startLocalStream();
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return state;
}
