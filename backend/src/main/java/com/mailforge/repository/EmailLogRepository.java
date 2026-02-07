package com.mailforge.repository;

import com.mailforge.model.EmailLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmailLogRepository extends JpaRepository<EmailLog, Long> {
    
    List<EmailLog> findByCampaignId(Long campaignId);
    
    Optional<EmailLog> findByTrackingId(String trackingId);
    
    @Query("SELECT COUNT(e) FROM EmailLog e WHERE e.campaign.id = :campaignId")
    long countByCampaignId(@Param("campaignId") Long campaignId);
    
    @Query("SELECT COUNT(e) FROM EmailLog e WHERE e.campaign.id = :campaignId AND e.status IN ('OPENED', 'CLICKED')")
    long countOpenedByCampaignId(@Param("campaignId") Long campaignId);
    
    @Query("SELECT COUNT(e) FROM EmailLog e WHERE e.campaign.id = :campaignId AND e.status = 'CLICKED'")
    long countClickedByCampaignId(@Param("campaignId") Long campaignId);
    
    @Query("SELECT COUNT(e) FROM EmailLog e WHERE e.campaign.id = :campaignId AND e.status = 'BOUNCED'")
    long countBouncedByCampaignId(@Param("campaignId") Long campaignId);
    
    @Query("SELECT COUNT(e) FROM EmailLog e WHERE e.status = 'SENT'")
    long countTotalSent();
    
    @Query("SELECT COUNT(e) FROM EmailLog e WHERE e.status IN ('OPENED', 'CLICKED')")
    long countTotalOpened();
    
    @Query("SELECT COUNT(e) FROM EmailLog e WHERE e.status = 'CLICKED'")
    long countTotalClicked();
    
    @Query("SELECT COUNT(e) FROM EmailLog e WHERE e.status = 'BOUNCED'")
    long countTotalBounced();
}
