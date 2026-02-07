package com.mailforge.repository;

import com.mailforge.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    
    Optional<Contact> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT c FROM Contact c JOIN c.tags t WHERE t IN :tags AND c.status = 'ACTIVE'")
    List<Contact> findByTags(@Param("tags") Set<String> tags);
    
    List<Contact> findByStatus(Contact.ContactStatus status);
    
    @Query("SELECT DISTINCT t FROM Contact c JOIN c.tags t")
    List<String> findAllTags();
}
