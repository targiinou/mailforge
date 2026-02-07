package com.mailforge.controller;

import com.mailforge.dto.AnalyticsDTOs;
import com.mailforge.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalyticsController {
    
    private final AnalyticsService analyticsService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<AnalyticsDTOs.DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }
    
    @GetMapping("/campaigns/{campaignId}")
    public ResponseEntity<AnalyticsDTOs.CampaignStats> getCampaignStats(@PathVariable Long campaignId) {
        return ResponseEntity.ok(analyticsService.getCampaignStats(campaignId));
    }
    
    @GetMapping("/track/open/{trackingId}")
    public ResponseEntity<Void> trackOpen(@PathVariable String trackingId) {
        analyticsService.trackOpen(trackingId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/track/click/{trackingId}")
    public ResponseEntity<Void> trackClick(@PathVariable String trackingId) {
        analyticsService.trackClick(trackingId);
        return ResponseEntity.ok().build();
    }
}
