package com.listatelefonica.phonebook.resources.dto;

import java.math.BigDecimal;

public record OperatorResponse(Long id, String name, Integer code, String category, BigDecimal price, String logoUrl) {
}
