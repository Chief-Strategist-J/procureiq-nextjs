"use client";

import React, { useEffect, useRef } from "react";
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, 
  Terminal, ShieldAlert, Wifi, Users, Copy, Sparkles, Monitor
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { sessionsActions } from "@/features/sessions/sessionsSlice";
import { WebRtcSignalingClient } from "@/lib/webrtc-helper";
import { AppConfig } from "@/config/app-config";

import { useVideoCallPageState } from "@/features/sessions/VideoCallPageState";

export default function VideoCallPage() {
  const state = useVideoCallPageState();

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 oklch-emerald-500 animate-ping"></span>
            <h1 className="text-lg font-light tracking-wider flex items-center gap-2">
              ProcureIQ <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">Custom WebRTC SFU</span>
            </h1>
          </div>
          <p className="text-xs text-zinc-505 mt-1">100% Self-Hosted & Peer-to-Peer encrypted video call channel</p>
        </div>

        {state.joined && (
          <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 px-4 py-1.5 rounded-full text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {state.peersInRoom.length + 1} Active</span>
            <span className="h-4 w-[1px] bg-zinc-800"></span>
            <span className="flex items-center gap-1.5"><Wifi className="h-3.5 w-3.5 text-emerald-500" /> WSS Signal</span>
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[450px]">
            <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden flex items-center justify-center group shadow-2xl">
              <video 
                ref={state.localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-zinc-800 px-3 py-1 rounded-full text-xs font-mono">
                {state.userId} (You)
              </div>
              {!state.videoActive && (
                <div className="absolute inset-0 bg-zinc-955 flex flex-col items-center justify-center text-zinc-500">
                  <VideoOff className="h-12 w-12 mb-2 stroke-[1]" />
                  <span className="text-xs font-light tracking-widest">CAMERA INACTIVE</span>
                </div>
              )}
            </div>

            <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden flex items-center justify-center shadow-2xl">
              <video 
                ref={state.remoteVideoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-zinc-800 px-3 py-1 rounded-full text-xs font-mono">
                {state.peersInRoom.length > 0 ? state.peersInRoom[0] : "Waiting for peer..."}
              </div>
              {state.peersInRoom.length === 0 && (
                <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-zinc-500">
                  <div className="h-10 w-10 rounded-full border-t border-r border-zinc-600 animate-spin mb-4"></div>
                  <span className="text-xs font-light tracking-widest text-zinc-400">WAITING FOR OTHER SIDE</span>
                  <span className="text-[10px] text-zinc-600 mt-1 uppercase">Share Room ID: {state.roomId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-zinc-955/60 backdrop-blur-md border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex gap-2">
              <button 
                onClick={state.toggleAudio}
                className={`h-11 w-11 rounded-lg border transition-all flex items-center justify-center ${
                  state.micActive 
                    ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800" 
                    : "bg-red-955/40 border-red-800 text-red-500"
                }`}
              >
                {state.micActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>

              <button 
                onClick={state.toggleVideo}
                className={`h-11 w-11 rounded-lg border transition-all flex items-center justify-center ${
                  state.videoActive 
                    ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800" 
                    : "bg-red-955/40 border-red-800 text-red-500"
                }`}
              >
                {state.videoActive ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </button>
            </div>

            {state.joined ? (
              <button 
                onClick={state.handleLeaveCall}
                className="bg-red-600 hover:bg-red-500 text-white font-medium text-xs px-6 py-2.5 rounded-lg flex items-center gap-2 tracking-wider transition-colors shadow-lg shadow-red-900/30"
              >
                <PhoneOff className="h-4 w-4" /> DISCONNECT
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={state.roomId} 
                  onChange={(e) => state.dispatch(sessionsActions.setFormField({ field: "roomId", value: e.target.value }))} 
                  placeholder="Room ID"
                  className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg text-xs font-mono text-zinc-305 w-44 focus:outline-none focus:border-zinc-600"
                />
                <button 
                  onClick={state.handleJoinCall}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-6 py-2.5 rounded-lg flex items-center gap-2 tracking-wider transition-colors"
                >
                  <Sparkles className="h-4 w-4" /> START CALL
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden max-h-[570px] shadow-2xl">
          <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
            <span className="text-xs font-medium tracking-wide flex items-center gap-1.5 text-zinc-300">
              <Terminal className="h-4 w-4 text-zinc-500" /> LOG CONSOLE
            </span>
            <button 
              onClick={() => state.dispatch(sessionsActions.setFormField({ field: "logs", value: [] }))}
              className="text-[10px] text-zinc-500 hover:text-white transition-colors uppercase cursor-pointer"
            >
              Clear
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto font-mono text-[10px] space-y-2.5 scrollbar-thin scrollbar-thumb-zinc-800">
            {state.logs.length === 0 ? (
              <div className="text-zinc-600 text-center mt-12 italic uppercase">Console idle. Join a room to see WebRTC event loops.</div>
            ) : (
              state.logs.map((log, index) => (
                <div key={index} className="leading-relaxed border-b border-zinc-900/50 pb-1.5">
                  <div className="flex justify-between text-zinc-655 mb-0.5">
                    <span>{log.timestamp}</span>
                    <span className={`text-[8px] px-1 rounded uppercase font-semibold ${
                      log.type === "success" ? "bg-emerald-950 text-emerald-400" :
                      log.type === "error" ? "bg-red-955 text-red-400" :
                      log.type === "warning" ? "bg-amber-955 text-amber-400" : "bg-zinc-900 text-zinc-500"
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