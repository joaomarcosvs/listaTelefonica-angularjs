package com.listatelefonica.phonebook.service;

import com.listatelefonica.phonebook.entities.Contact;
import com.listatelefonica.phonebook.entities.Operator;
import com.listatelefonica.phonebook.repository.ContactRepository;
import com.listatelefonica.phonebook.repository.OperatorRepository;
import com.listatelefonica.phonebook.resources.dto.ContactRequest;
import com.listatelefonica.phonebook.resources.dto.ContactResponse;
import com.listatelefonica.phonebook.resources.dto.OperatorResponse;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ContactService {

    @Autowired
    private final ContactRepository contactRepository;

    private final OperatorRepository operatorRepository;
    
    public ContactService(ContactRepository contactRepository, OperatorRepository operatorRepository) {
        this.contactRepository = contactRepository;
        this.operatorRepository = operatorRepository;
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

    @Transactional
    public ContactResponse create(ContactRequest request) {
        Operator operator = operatorRepository.findById(request.operatorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Operadora não encontrada"));

        Contact contact = new Contact(request.name(), request.phoneNumber(), request.email(), operator);
        Contact saved = contactRepository.save(contact);
        return toResponse(saved);
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
