package com.listatelefonica.phonebook.resources;

import com.listatelefonica.phonebook.entities.Operator;
import com.listatelefonica.phonebook.resources.dto.OperatorResponse;
import com.listatelefonica.phonebook.service.OperatorService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/operators")
public class OperatorController {

    @Autowired
    private final OperatorService operatorService;

    public OperatorController(OperatorService operatorService) {
        this.operatorService = operatorService;
    }

    @GetMapping
    public ResponseEntity<List<OperatorResponse>> findAll() {
        return ResponseEntity.ok(operatorService.listAll());
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Operator> findById(@PathVariable Long id){
        Operator obj = operatorService.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    @GetMapping(value = "/{id}/logo", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getLogo(@PathVariable Long id) {
        Operator operator = operatorService.findById(id);
        return ResponseEntity.ok(operator.getLogo());
    }
}
