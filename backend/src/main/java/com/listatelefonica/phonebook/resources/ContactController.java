package com.listatelefonica.phonebook.resources;

import com.listatelefonica.phonebook.entities.Contact;
import com.listatelefonica.phonebook.resources.dto.ContactRequest;
import com.listatelefonica.phonebook.resources.dto.ContactResponse;
import com.listatelefonica.phonebook.service.ContactService;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
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

    @GetMapping(value = "/{id}")
    public ResponseEntity<Contact> findById(@PathVariable Long id){
        Contact obj = contactService.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    @PostMapping
    public ResponseEntity<ContactResponse> create(@RequestBody ContactRequest request) {
        ContactResponse created = contactService.create(request);
        var uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();
        return ResponseEntity.created(uri).body(created);
    }
    
    @PutMapping(value = "/{id}")
    public ResponseEntity<ContactResponse> update(@PathVariable Long id, @RequestBody ContactRequest request) {
        ContactResponse updated = contactService.update(id, request);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contactService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
