package com.listatelefonica.phonebook.config;

import com.listatelefonica.phonebook.entities.Contact;
import com.listatelefonica.phonebook.repository.ContactRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner seedDatabase(ContactRepository contactRepository) {
        return args -> {
            if (contactRepository.count() > 0) {
                return;
            }

            List<Contact> contacts = List.of(
                    new Contact("Ana Souza", "+55 11 98888-0001", "ana.souza@example.com"),
                    new Contact("Bruno Lima", "+55 21 97777-0002", "bruno.lima@example.com"),
                    new Contact("Carla Menezes", "+55 31 96666-0003", "carla.menezes@example.com"),
                    new Contact("Diego Rocha", "+55 41 95555-0004", "diego.rocha@example.com")
            );

            contactRepository.saveAll(contacts);
        };
    }
}
