package com.mailforge.dto;

import lombok.Data;
import java.util.Map;

public class AnalyticsDTOs {
    
    @Data
    public static class DashboardStats {
        private long totalSent;
        private long totalOpened;
        private long totalClicked;
        private long totalBounced;
        private double openRate;
        private double clickRate;
        private double bounceRate;
    }
    
    @Data
    public static class CampaignStats {
        private Long campaignId;
        private String campaignName;
        private long totalSent;
        private long totalOpened;
        private long totalClicked;
        private long totalBounced;
        private double openRate;
        private double clickRate;
        private double bounceRate;
    }
    
    @Data
    public static class TrackingEvent {
        private String event;
        private String email;
        private String timestamp;
        private Map<String, String> metadata;
    }
}
