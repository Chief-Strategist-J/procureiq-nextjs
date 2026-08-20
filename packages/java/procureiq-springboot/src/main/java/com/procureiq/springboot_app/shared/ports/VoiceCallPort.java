package com.procureiq.springboot_app.shared.ports;


public interface VoiceCallPort {
    
    void call(String phoneNumber, String instructions) throws Exception;
}
