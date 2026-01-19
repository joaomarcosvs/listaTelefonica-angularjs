package com.listatelefonica.phonebook.service;

import com.listatelefonica.phonebook.entities.Contact;
import com.listatelefonica.phonebook.entities.Operator;
import com.listatelefonica.phonebook.repository.ContactRepository;
import com.listatelefonica.phonebook.resources.dto.ContactResponse;
import com.listatelefonica.phonebook.resources.dto.OperatorResponse;

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
        OperatorResponse operator = toOperatorResponse(contact.getOperator());
        return new ContactResponse(
            contact.getId(),
            contact.getName(),
            contact.getPhoneNumber(),
            contact.getEmail(),
            operator
        );
    }

    private static OperatorResponse toOperatorResponse(Operator operator) {
        return new OperatorResponse(
            operator.getId(),
            operator.getName(),
            operator.getCode(),
            operator.getCategory(),
            operator.getPrice(),
            "/api/operators/" + operator.getId() + "/logo"
        );
    }
}
