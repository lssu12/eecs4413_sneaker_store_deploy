package edu.yorku.sneaker_store_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Read-only view of the customer's profile that omits the password hash but exposes
 * all editable contact/address fields so the frontend can pre-fill the form.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerProfileDto {

    private Long id;
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
