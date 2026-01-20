package com.listatelefonica.phonebook.config;

import com.listatelefonica.phonebook.entities.Contact;
import com.listatelefonica.phonebook.entities.Operator;
import com.listatelefonica.phonebook.repository.ContactRepository;
import com.listatelefonica.phonebook.repository.OperatorRepository;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner seedDatabase(ContactRepository contactRepository, OperatorRepository operatorRepository) {
        return args -> {
                if (operatorRepository.count() == 0) {
                List<Operator> operators = List.of(
                    new Operator("Oi", 14, "Celular", readLogo("frontend/lib/images/oi.png"), BigDecimal.valueOf(3)),
                    new Operator("Vivo", 15, "Celular", readLogo("frontend/lib/images/vivo.png"), BigDecimal.valueOf(2)),
                    new Operator("Tim", 41, "Celular", readLogo("frontend/lib/images/tim.png"), BigDecimal.valueOf(1)),
                    new Operator("Claro", 21, "Celular", readLogo("frontend/lib/images/claro.png"), BigDecimal.valueOf(2))
                );

                operatorRepository.saveAll(operators);
            }

            if (contactRepository.count() == 0) {
                List<Operator> operators = operatorRepository.findAll();
                if (operators.size() >= 4) {
                    List<Contact> contacts = List.of(
                            new Contact("Ana Souza", "+55 11 98888-0001", "ana.souza@example.com", operators.get(0)),
                            new Contact("Bruno Lima", "+55 21 97777-0002", "bruno.lima@example.com", operators.get(1)),
                            new Contact("Carla Menezes", "+55 31 96666-0003", "carla.menezes@example.com", operators.get(2)),
                            new Contact("Diego Rocha", "+55 41 95555-0004", "diego.rocha@example.com", operators.get(3))
                    );

                    contactRepository.saveAll(contacts);
                }
            }

            List<Contact> contacts = contactRepository.findAll();
            boolean updated = false;
            for (Contact contact : contacts) {
                String normalized = normalizePhoneNumber(contact.getPhoneNumber());
                if (normalized != null && !normalized.equals(contact.getPhoneNumber())) {
                    contact.setPhoneNumber(normalized);
                    updated = true;
                }
            }

            if (updated) {
                contactRepository.saveAll(contacts);
            }
        };
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

    private static byte[] readLogo(String relativePath) {
        String userDir = System.getProperty("user.dir");
        List<Path> candidates = List.of(
                Path.of(userDir, relativePath),
                Path.of(userDir, "backend", relativePath),
                Path.of(userDir, "..", relativePath),
                Path.of(relativePath)
        );

        for (Path path : candidates) {
            if (Files.exists(path)) {
                try {
                    return Files.readAllBytes(path);
                } catch (IOException ex) {
                    return new byte[0];
                }
            }
        }

        return new byte[0];
    }
}
