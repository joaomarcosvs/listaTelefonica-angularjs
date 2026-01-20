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

    @Transactional(readOnly = true)
    public ContactResponse findResponseById(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contato não encontrado"));
        return toResponse(contact);
    }

    @Transactional
    public ContactResponse create(ContactRequest request) {
        Operator operator = operatorRepository.findById(request.operatorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Operadora não encontrada"));

        String phoneNumber = normalizePhoneNumber(request.phoneNumber());
        Contact contact = new Contact(request.name(), phoneNumber, request.email(), operator);
        Contact saved = contactRepository.save(contact);
        return toResponse(saved);
    }

    @Transactional
    public ContactResponse update(Long id, ContactRequest request) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contato não encontrado"));

        Operator operator = operatorRepository.findById(request.operatorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Operadora não encontrada"));

        contact.setName(request.name());
        contact.setPhoneNumber(normalizePhoneNumber(request.phoneNumber()));
        contact.setEmail(request.email());
        contact.setOperator(operator);

        Contact saved = contactRepository.save(contact);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contato não encontrado"));
        contactRepository.delete(contact);
    }

    private static String normalizePhoneNumber(String value) {
        if (value == null || value.isBlank()) {
            return value;
        }

        String digits = value.replaceAll("\\D", "");
        if (digits.startsWith("55") && digits.length() > 11) {
            digits = digits.substring(2);
        }

        if (digits.length() > 11) {
            digits = digits.substring(0, 11);
        }

        if (digits.length() < 10) {
            return value;
        }

        String ddd = digits.substring(0, 2);
        String local = digits.substring(2);

        String prefix;
        String suffix;

        if (local.length() == 9) {
            prefix = local.substring(0, 5);
            suffix = local.substring(5);
        } else {
            prefix = local.substring(0, 4);
            suffix = local.substring(4);
        }

        return "+55 " + ddd + " " + prefix + "-" + suffix;
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
