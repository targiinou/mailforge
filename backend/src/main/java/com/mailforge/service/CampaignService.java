package com.mailforge.service;

import com.mailforge.dto.CampaignDTOs;
import com.mailforge.model.Campaign;
import com.mailforge.model.Contact;
import com.mailforge.repository.CampaignRepository;
import com.mailforge.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CampaignService {
    
    private final CampaignRepository campaignRepository;
    private final ContactRepository contactRepository;
    private final EmailService emailService;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
    
    public List<CampaignDTOs.Response> getAllCampaigns() {
        return campaignRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public CampaignDTOs.Response getCampaign(Long id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
        return toResponse(campaign);
    }
    
    public CampaignDTOs.Response createCampaign(CampaignDTOs.CreateRequest request) {
        Set<Contact> contacts = new HashSet<>();
        
        if (request.getContactIds() != null && !request.getContactIds().isEmpty()) {
            contacts = new HashSet<>(contactRepository.findAllById(request.getContactIds()));
        }
        
        if (request.getTargetTags() != null && !request.getTargetTags().isEmpty()) {
            List<Contact> taggedContacts = contactRepository.findByTags(request.getTargetTags());
            contacts.addAll(taggedContacts);
        }
        
        Campaign campaign = Campaign.builder()
                .name(request.getName())
                .subject(request.getSubject())
                .content(request.getContent())
                .contacts(contacts)
                .targetTags(request.getTargetTags() != null ? request.getTargetTags() : new HashSet<>())
                .status(Campaign.CampaignStatus.DRAFT)
                .scheduledAt(request.getScheduledAt() != null ? 
                        LocalDateTime.parse(request.getScheduledAt()) : null)
                .build();
        
        return toResponse(campaignRepository.save(campaign));
    }
    
    public CampaignDTOs.Response updateCampaign(Long id, CampaignDTOs.UpdateRequest request) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
        
        if (request.getName() != null) campaign.setName(request.getName());
        if (request.getSubject() != null) campaign.setSubject(request.getSubject());
        if (request.getContent() != null) campaign.setContent(request.getContent());
        
        if (request.getContactIds() != null) {
            campaign.setContacts(new HashSet<>(contactRepository.findAllById(request.getContactIds())));
        }
        
        if (request.getTargetTags() != null) {
            campaign.setTargetTags(request.getTargetTags());
        }
        
        if (request.getScheduledAt() != null) {
            campaign.setScheduledAt(LocalDateTime.parse(request.getScheduledAt()));
            campaign.setStatus(Campaign.CampaignStatus.SCHEDULED);
        }
        
        return toResponse(campaignRepository.save(campaign));
    }
    
    public void deleteCampaign(Long id) {
        campaignRepository.deleteById(id);
    }
    
    public void sendCampaign(Long id, boolean test) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
        
        campaign.setStatus(Campaign.CampaignStatus.SENDING);
        campaignRepository.save(campaign);
        
        emailService.sendCampaignEmails(campaign, test);
        
        campaign.setStatus(Campaign.CampaignStatus.SENT);
        campaign.setSentAt(LocalDateTime.now());
        campaignRepository.save(campaign);
    }
    
    private CampaignDTOs.Response toResponse(Campaign campaign) {
        CampaignDTOs.Response response = new CampaignDTOs.Response();
        response.setId(campaign.getId());
        response.setName(campaign.getName());
        response.setSubject(campaign.getSubject());
        response.setContent(campaign.getContent());
        response.setStatus(campaign.getStatus().name());
        response.setContactCount(campaign.getContacts().size());
        response.setScheduledAt(campaign.getScheduledAt() != null ? 
                campaign.getScheduledAt().format(formatter) : null);
        response.setSentAt(campaign.getSentAt() != null ? 
                campaign.getSentAt().format(formatter) : null);
        response.setCreatedAt(campaign.getCreatedAt() != null ? 
                campaign.getCreatedAt().format(formatter) : null);
        return response;
    }
}
