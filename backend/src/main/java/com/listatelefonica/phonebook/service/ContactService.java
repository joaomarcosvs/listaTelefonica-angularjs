package com.listatelefonica.phonebook.service;

import com.listatelefonica.phonebook.entities.Contact;
import com.listatelefonica.phonebook.repository.ContactRepository;
import com.listatelefonica.phonebook.resources.dto.ContactResponse;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {

    @Autowired
    private final ContactRepository contactRepository;
    
    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Transactional(readOnly = true)
    public List<ContactResponse> listAll() {
        return contactRepository.findAll()
                .stream()
                .map(ContactService::toResponse)
                .toList();
    }

    public Contact findById(Long id) {

        Optional<Contact> obj = contactRepository.findById(id);
        return obj.get();
    }

    private static ContactResponse toResponse(Contact contact) {
        return new ContactResponse(contact.getId(), contact.getName(), contact.getPhoneNumber(), contact.getEmail());
    }
}
