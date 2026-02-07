package com.mailforge.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Set;

public class ContactDTOs {
    
    @Data
    public static class CreateRequest {
        @NotBlank
        private String name;
        
        @NotBlank
        @Email
        private String email;
        
        private Set<String> tags;
    }
    
    @Data
    public static class UpdateRequest {
        private String name;
        private Set<String> tags;
        private String status;
    }
    
    @Data
    public static class Response {
        private Long id;
        private String name;
        private String email;
        private Set<String> tags;
        private String status;
        private String createdAt;
    }
}
