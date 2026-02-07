package com.mailforge.controller;

import com.mailforge.dto.EmailDTOs;
import com.mailforge.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emails")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmailController {
    
    private final EmailService emailService;
    
    @PostMapping("/send")
    public ResponseEntity<EmailDTOs.Response> sendEmail(@Valid @RequestBody EmailDTOs.SendRequest request) {
        return ResponseEntity.ok(emailService.sendEmail(request));
    }
    
    @PostMapping("/send-bulk")
    public ResponseEntity<EmailDTOs.Response> sendBulkEmails(@Valid @RequestBody EmailDTOs.BulkSendRequest request) {
        return ResponseEntity.ok(emailService.sendBulkEmails(request));
    }
}
