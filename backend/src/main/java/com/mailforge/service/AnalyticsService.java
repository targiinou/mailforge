package com.mailforge.service;

import com.mailforge.dto.AnalyticsDTOs;
import com.mailforge.model.Campaign;
import com.mailforge.model.EmailLog;
import com.mailforge.repository.CampaignRepository;
import com.mailforge.repository.EmailLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    
    private final EmailLogRepository emailLogRepository;
    private final CampaignRepository campaignRepository;
    
    public AnalyticsDTOs.DashboardStats getDashboardStats() {
        long totalSent = emailLogRepository.countTotalSent();
        long totalOpened = emailLogRepository.countTotalOpened();
        long totalClicked = emailLogRepository.countTotalClicked();
        long totalBounced = emailLogRepository.countTotalBounced();
        
        AnalyticsDTOs.DashboardStats stats = new AnalyticsDTOs.DashboardStats();
        stats.setTotalSent(totalSent);
        stats.setTotalOpened(totalOpened);
        stats.setTotalClicked(totalClicked);
        stats.setTotalBounced(totalBounced);
        stats.setOpenRate(calculateRate(totalOpened, totalSent));
        stats.setClickRate(calculateRate(totalClicked, totalSent));
        stats.setBounceRate(calculateRate(totalBounced, totalSent));
        
        return stats;
    }
    
    public AnalyticsDTOs.CampaignStats getCampaignStats(Long campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
        
        long totalSent = emailLogRepository.countByCampaignId(campaignId);
        long totalOpened = emailLogRepository.countOpenedByCampaignId(campaignId);
        long totalClicked = emailLogRepository.countClickedByCampaignId(campaignId);
        long totalBounced = emailLogRepository.countBouncedByCampaignId(campaignId);
        
        AnalyticsDTOs.CampaignStats stats = new AnalyticsDTOs.CampaignStats();
        stats.setCampaignId(campaignId);
        stats.setCampaignName(campaign.getName());
        stats.setTotalSent(totalSent);
        stats.setTotalOpened(totalOpened);
        stats.setTotalClicked(totalClicked);
        stats.setTotalBounced(totalBounced);
        stats.setOpenRate(calculateRate(totalOpened, totalSent));
        stats.setClickRate(calculateRate(totalClicked, totalSent));
        stats.setBounceRate(calculateRate(totalBounced, totalSent));
        
        return stats;
    }
    
    public void trackOpen(String trackingId) {
        emailLogRepository.findByTrackingId(trackingId).ifPresent(log -> {
            if (log.getOpenedAt() == null) {
                log.setOpenedAt(LocalDateTime.now());
                if (log.getStatus() == EmailLog.EmailStatus.SENT) {
                    log.setStatus(EmailLog.EmailStatus.OPENED);
                }
                emailLogRepository.save(log);
            }
        });
    }
    
    public void trackClick(String trackingId) {
        emailLogRepository.findByTrackingId(trackingId).ifPresent(log -> {
            log.setClickedAt(LocalDateTime.now());
            log.setStatus(EmailLog.EmailStatus.CLICKED);
            emailLogRepository.save(log);
        });
    }
    
    private double calculateRate(long numerator, long denominator) {
        if (denominator == 0) return 0.0;
        return Math.round((double) numerator / denominator * 10000.0) / 100.0;
    }
}
