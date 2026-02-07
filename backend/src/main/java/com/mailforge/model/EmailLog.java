package com.mailforge.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;
    
    @ManyToOne
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact;
    
    @Column(nullable = false)
    private String subject;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EmailStatus status = EmailStatus.PENDING;
    
    private String trackingId;
    
    private LocalDateTime sentAt;
    
    private LocalDateTime openedAt;
    
    private LocalDateTime clickedAt;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    public enum EmailStatus {
        PENDING, SENT, DELIVERED, OPENED, CLICKED, BOUNCED, FAILED
    }
}
