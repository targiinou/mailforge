package com.mailforge.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Map;

public class EmailDTOs {
    
    @Data
    public static class SendRequest {
        @NotBlank
        @Email
        private String to;
        
        @NotBlank
        private String subject;
        
        @NotBlank
        private String content;
        
        private Map<String, String> variables;
        private boolean isHtml;
    }
    
    @Data
    public static class BulkSendRequest {
        @NotBlank
        private String subject;
        
        @NotBlank
        private String content;
        
        private String[] to;
        private Map<String, String> variables;
        private boolean isHtml;
    }
    
    @Data
    public static class Response {
        private boolean success;
        private String message;
        private String trackingId;
    }
}
