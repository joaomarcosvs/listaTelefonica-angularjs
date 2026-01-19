package com.listatelefonica.phonebook.resources;

import com.listatelefonica.phonebook.resources.dto.ContactResponse;
import com.listatelefonica.phonebook.service.ContactService;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    @Autowired
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    public ResponseEntity<List<ContactResponse>> findAll() {
        return ResponseEntity.ok(contactService.listAll());
    }
}
