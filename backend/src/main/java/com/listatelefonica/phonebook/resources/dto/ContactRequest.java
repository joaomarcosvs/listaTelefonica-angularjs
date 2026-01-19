package com.listatelefonica.phonebook.resources.dto;

public record ContactRequest(String name, String phoneNumber, String email, Long operatorId) {
}
