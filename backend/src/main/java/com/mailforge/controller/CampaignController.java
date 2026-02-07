package com.mailforge.controller;

import com.mailforge.dto.CampaignDTOs;
import com.mailforge.service.CampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CampaignController {
    
    private final CampaignService campaignService;
    
    @GetMapping
    public ResponseEntity<List<CampaignDTOs.Response>> getAllCampaigns() {
        return ResponseEntity.ok(campaignService.getAllCampaigns());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CampaignDTOs.Response> getCampaign(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.getCampaign(id));
    }
    
    @PostMapping
    public ResponseEntity<CampaignDTOs.Response> createCampaign(@Valid @RequestBody CampaignDTOs.CreateRequest request) {
        return ResponseEntity.ok(campaignService.createCampaign(request));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CampaignDTOs.Response> updateCampaign(
            @PathVariable Long id,
            @RequestBody CampaignDTOs.UpdateRequest request) {
        return ResponseEntity.ok(campaignService.updateCampaign(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{id}/send")
    public ResponseEntity<String> sendCampaign(
            @PathVariable Long id,
            @RequestBody(required = false) CampaignDTOs.SendRequest request) {
        boolean isTest = request != null && request.isTest();
        campaignService.sendCampaign(id, isTest);
        return ResponseEntity.ok("Campaign sent successfully");
    }
}
