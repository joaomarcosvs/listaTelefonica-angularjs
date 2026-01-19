package com.listatelefonica.phonebook.resources.dto;

public record ContactResponse(Long id, String name, String phoneNumber, String email, OperatorResponse operator) {
}
