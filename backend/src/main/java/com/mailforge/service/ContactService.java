package com.mailforge.service;

import com.mailforge.dto.ContactDTOs;
import com.mailforge.model.Contact;
import com.mailforge.repository.ContactRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {
    
    private final ContactRepository contactRepository;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
    
    public List<ContactDTOs.Response> getAllContacts() {
        return contactRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public ContactDTOs.Response getContact(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        return toResponse(contact);
    }
    
    public ContactDTOs.Response createContact(ContactDTOs.CreateRequest request) {
        if (contactRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        Contact contact = Contact.builder()
                .name(request.getName())
                .email(request.getEmail())
                .tags(request.getTags() != null ? request.getTags() : new HashSet<>())
                .status(Contact.ContactStatus.ACTIVE)
                .build();
        
        return toResponse(contactRepository.save(contact));
    }
    
    public ContactDTOs.Response updateContact(Long id, ContactDTOs.UpdateRequest request) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        
        if (request.getName() != null) {
            contact.setName(request.getName());
        }
        if (request.getTags() != null) {
            contact.setTags(request.getTags());
        }
        if (request.getStatus() != null) {
            contact.setStatus(Contact.ContactStatus.valueOf(request.getStatus()));
        }
        
        return toResponse(contactRepository.save(contact));
    }
    
    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }
    
    public List<String> getAllTags() {
        return contactRepository.findAllTags();
    }
    
    public ImportResult importFromCsv(MultipartFile file) {
        int imported = 0;
        int failed = 0;
        List<String> errors = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(reader, 
                     CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())) {
            
            for (CSVRecord record : csvParser) {
                try {
                    String name = record.get("name");
                    String email = record.get("email");
                    String tags = record.isMapped("tags") ? record.get("tags") : "";
                    
                    if (contactRepository.existsByEmail(email)) {
                        failed++;
                        errors.add("Email already exists: " + email);
                        continue;
                    }
                    
                    Set<String> tagSet = Arrays.stream(tags.split(","))
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .collect(Collectors.toSet());
                    
                    Contact contact = Contact.builder()
                            .name(name)
                            .email(email)
                            .tags(tagSet)
                            .status(Contact.ContactStatus.ACTIVE)
                            .build();
                    
                    contactRepository.save(contact);
                    imported++;
                } catch (Exception e) {
                    failed++;
                    errors.add("Error importing record: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to import CSV: " + e.getMessage());
        }
        
        return new ImportResult(imported, failed, errors);
    }
    
    private ContactDTOs.Response toResponse(Contact contact) {
        ContactDTOs.Response response = new ContactDTOs.Response();
        response.setId(contact.getId());
        response.setName(contact.getName());
        response.setEmail(contact.getEmail());
        response.setTags(contact.getTags());
        response.setStatus(contact.getStatus().name());
        response.setCreatedAt(contact.getCreatedAt() != null ? 
                contact.getCreatedAt().format(formatter) : null);
        return response;
    }
    
    @Data
    public static class ImportResult {
        private final int imported;
        private final int failed;
        private final List<String> errors;
    }
}
