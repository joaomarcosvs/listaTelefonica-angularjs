package com.listatelefonica.phonebook.repository;

import com.listatelefonica.phonebook.entities.Operator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OperatorRepository extends JpaRepository<Operator, Long> {
}
