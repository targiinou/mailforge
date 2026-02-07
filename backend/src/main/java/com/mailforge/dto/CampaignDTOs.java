package com.mailforge.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Set;

public class CampaignDTOs {
    
    @Data
    public static class CreateRequest {
        @NotBlank
        private String name;
        
        @NotBlank
        private String subject;
        
        @NotBlank
        private String content;
        
        private Set<Long> contactIds;
        private Set<String> targetTags;
        private String scheduledAt;
    }
    
    @Data
    public static class UpdateRequest {
        private String name;
        private String subject;
        private String content;
        private Set<Long> contactIds;
        private Set<String> targetTags;
        private String scheduledAt;
    }
    
    @Data
    public static class Response {
        private Long id;
        private String name;
        private String subject;
        private String content;
        private String status;
        private int contactCount;
        private String scheduledAt;
        private String sentAt;
        private String createdAt;
    }
    
    @Data
    public static class SendRequest {
        private boolean test;
    }
}
