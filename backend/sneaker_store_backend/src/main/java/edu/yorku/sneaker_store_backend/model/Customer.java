package edu.yorku.sneaker_store_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Captures essential details about a store customer for order fulfillment.
 */
@Entity
@Table(name = "customers")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Customer's given name.
     */
    @Column(nullable = false)
    private String firstName;

    /**
     * Customer's surname.
     */
    @Column(nullable = false)
    private String lastName;

    /**
     * Email address used for communication and login.
     */
    @Column(nullable = false, unique = true)
    private String email;

    /**
     * Role of the account (e.g., CUSTOMER, ADMIN).
     */
    @Column(nullable = false)
    private String role = "CUSTOMER";

    /**
     * BCrypt-hashed password used for basic identity management.
     */
    @Column(nullable = false)
    private String passwordHash;

    private String phoneNumber;

    private String addressLine1;

    private String addressLine2;

    private String city;

    private String province;

    private String postalCode;

    private String country;

    private String billingAddressLine1;

    private String billingAddressLine2;

    private String billingCity;

    private String billingProvince;

    private String billingPostalCode;

    private String billingCountry;

    private String creditCardHolder;

    private String creditCardNumber;

    private String creditCardExpiry;

    private String creditCardCvv;
}
