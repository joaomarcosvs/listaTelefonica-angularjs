package com.listatelefonica.phonebook.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "tb_operators")
public class Operator implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer code;

    @Column(nullable = false)
    private String category;

    @Lob
    @Column(nullable = false)
    private byte[] logo;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @OneToMany(mappedBy = "operator")
    private List<Contact> contacts;

    protected Operator() {
        // For JPA
    }

    public Operator(String name, Integer code, String category, byte[] logo, BigDecimal price) {
        this.name = name;
        this.code = code;
        this.category = category;
        this.logo = logo;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Integer getCode() {
        return code;
    }

    public String getCategory() {
        return category;
    }

    public byte[] getLogo() {
        return logo;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public List<Contact> getContacts() {
        return contacts;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setContacts(List<Contact> contacts) {
        this.contacts = contacts;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Operator operator)) return false;
        return Objects.equals(id, operator.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
