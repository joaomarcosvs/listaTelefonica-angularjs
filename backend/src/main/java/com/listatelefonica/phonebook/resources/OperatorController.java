package com.listatelefonica.phonebook.resources;

import com.listatelefonica.phonebook.resources.dto.OperatorResponse;
import com.listatelefonica.phonebook.service.OperatorService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/operators")
public class OperatorController {

    private final OperatorService operatorService;

    @Autowired
    public OperatorController(OperatorService operatorService) {
        this.operatorService = operatorService;
    }

    @GetMapping
    public ResponseEntity<List<OperatorResponse>> findAll() {
        return ResponseEntity.ok(operatorService.listAll());
    }
}
