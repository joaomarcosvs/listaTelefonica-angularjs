package com.listatelefonica.phonebook.service;

import com.listatelefonica.phonebook.entities.Operator;
import com.listatelefonica.phonebook.repository.OperatorRepository;
import com.listatelefonica.phonebook.resources.dto.OperatorResponse;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OperatorService {

    @Autowired
    private final OperatorRepository operatorRepository;

    public OperatorService(OperatorRepository operatorRepository) {
        this.operatorRepository = operatorRepository;
    }

    @Transactional(readOnly = true)
    public List<OperatorResponse> listAll() {
        return operatorRepository.findAll()
                .stream()
                .map(OperatorService::toResponse)
                .toList();
    }

    public Operator findById(Long id) {
        Optional<Operator> obj = operatorRepository.findById(id);
        return obj.get();
    }

    private static OperatorResponse toResponse(Operator operator) {
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
