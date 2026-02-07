package com.mailforge.controller;

import com.mailforge.dto.ContactDTOs;
import com.mailforge.model.Contact;
import com.mailforge.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContactController {
    
    private final ContactService contactService;
    
    @GetMapping
    public ResponseEntity<List<ContactDTOs.Response>> getAllContacts() {
        return ResponseEntity.ok(contactService.getAllContacts());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ContactDTOs.Response> getContact(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.getContact(id));
    }
    
    @PostMapping
    public ResponseEntity<ContactDTOs.Response> createContact(@Valid @RequestBody ContactDTOs.CreateRequest request) {
        return ResponseEntity.ok(contactService.createContact(request));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ContactDTOs.Response> updateContact(
            @PathVariable Long id,
            @RequestBody ContactDTOs.UpdateRequest request) {
        return ResponseEntity.ok(contactService.updateContact(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/tags")
    public ResponseEntity<List<String>> getAllTags() {
        return ResponseEntity.ok(contactService.getAllTags());
    }
    
    @PostMapping("/import")
    public ResponseEntity<ContactService.ImportResult> importContacts(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(contactService.importFromCsv(file));
    }
}
