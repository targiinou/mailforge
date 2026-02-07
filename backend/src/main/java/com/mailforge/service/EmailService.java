package com.mailforge.service;

import com.mailforge.dto.EmailDTOs;
import com.mailforge.model.Campaign;
import com.mailforge.model.Contact;
import com.mailforge.model.EmailLog;
import com.mailforge.repository.CampaignRepository;
import com.mailforge.repository.ContactRepository;
import com.mailforge.repository.EmailLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    private final EmailLogRepository emailLogRepository;
    private final ContactRepository contactRepository;
    private final CampaignRepository campaignRepository;
    
    @Value("${mail.from:noreply@mailforge.com}")
    private String fromEmail;
    
    @Value("${mail.enabled:false}")
    private boolean emailEnabled;
    
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;
    
    public EmailDTOs.Response sendEmail(EmailDTOs.SendRequest request) {
        try {
            String content = processTemplate(request.getContent(), request.getVariables());
            
            if (emailEnabled) {
                if (request.isHtml()) {
                    sendHtmlEmail(request.getTo(), request.getSubject(), content);
                } else {
                    sendTextEmail(request.getTo(), request.getSubject(), content);
                }
            } else {
                log.info("[EMAIL LOG] To: {}, Subject: {}", request.getTo(), request.getSubject());
                log.info("[EMAIL LOG] Content: {}", content);
            }
            
            return EmailDTOs.Response.builder()
                    .success(true)
                    .message("Email sent successfully")
                    .trackingId(UUID.randomUUID().toString())
                    .build();
        } catch (Exception e) {
            log.error("Failed to send email", e);
            return EmailDTOs.Response.builder()
                    .success(false)
                    .message("Failed to send email: " + e.getMessage())
                    .build();
        }
    }
    
    public EmailDTOs.Response sendBulkEmails(EmailDTOs.BulkSendRequest request) {
        int success = 0;
        int failed = 0;
        
        for (String email : request.getTo()) {
            EmailDTOs.SendRequest singleRequest = new EmailDTOs.SendRequest();
            singleRequest.setTo(email);
            singleRequest.setSubject(request.getSubject());
            singleRequest.setContent(request.getContent());
            singleRequest.setVariables(request.getVariables());
            singleRequest.setHtml(request.isHtml());
            
            EmailDTOs.Response response = sendEmail(singleRequest);
            if (response.isSuccess()) {
                success++;
            } else {
                failed++;
            }
        }
        
        return EmailDTOs.Response.builder()
                .success(failed == 0)
                .message(String.format("Sent: %d, Failed: %d", success, failed))
                .build();
    }
    
    public void sendCampaignEmails(Campaign campaign, boolean test) {
        if (test) {
            log.info("[TEST MODE] Would send {} emails for campaign {}", 
                    campaign.getContacts().size(), campaign.getName());
            return;
        }
        
        for (Contact contact : campaign.getContacts()) {
            try {
                String trackingId = UUID.randomUUID().toString();
                
                String personalizedContent = campaign.getContent()
                        .replace("{{name}}", contact.getName())
                        .replace("{{email}}", contact.getEmail());
                
                String trackingPixel = String.format(
                    "<img src=\"%s/api/analytics/track/open/%s\" width=\"1\" height=\"1\" /\u003e",
                    baseUrl, trackingId
                );
                
                String fullContent = personalizedContent + trackingPixel;
                
                if (emailEnabled) {
                    sendHtmlEmail(contact.getEmail(), campaign.getSubject(), fullContent);
                } else {
                    log.info("[CAMPAIGN EMAIL] To: {}, Subject: {}", contact.getEmail(), campaign.getSubject());
                    log.info("[CAMPAIGN EMAIL] Content: {}", fullContent);
                }
                
                EmailLog emailLog = EmailLog.builder()
                        .campaign(campaign)
                        .contact(contact)
                        .subject(campaign.getSubject())
                        .status(EmailLog.EmailStatus.SENT)
                        .trackingId(trackingId)
                        .build();
                
                emailLogRepository.save(emailLog);
                
            } catch (Exception e) {
                log.error("Failed to send email to {}", contact.getEmail(), e);
                
                EmailLog emailLog = EmailLog.builder()
                        .campaign(campaign)
                        .contact(contact)
                        .subject(campaign.getSubject())
                        .status(EmailLog.EmailStatus.FAILED)
                        .build();
                
                emailLogRepository.save(emailLog);
            }
        }
    }
    
    private void sendTextEmail(String to, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);
        mailSender.send(message);
    }
    
    private void sendHtmlEmail(String to, String subject, String content) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(content, true);
        mailSender.send(message);
    }
    
    private String processTemplate(String template, Map<String, String> variables) {
        if (variables == null) return template;
        
        String result = template;
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            result = result.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return result;
    }
}
