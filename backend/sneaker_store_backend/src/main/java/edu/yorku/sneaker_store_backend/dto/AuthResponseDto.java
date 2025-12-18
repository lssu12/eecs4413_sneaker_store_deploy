package edu.yorku.sneaker_store_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Outgoing payload describing the result of register/login flows.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto {

    private boolean success;

    private String message;

    private Long customerId;

    private String token;

    private String role;

    private String firstName;

    private String lastName;

    private String email;

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
