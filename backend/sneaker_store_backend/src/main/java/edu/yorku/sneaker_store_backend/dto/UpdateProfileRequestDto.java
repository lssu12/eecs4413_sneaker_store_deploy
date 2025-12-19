package edu.yorku.sneaker_store_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload submitted by customers that want to refresh their own profile details.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequestDto {

    /**
     * Identifier for the customer that is being updated. The id is emitted as part of the
     * original login/register response so clients can keep it in memory.
     */
    private Long customerId;

    /**
     * Customers must prove they are logged in by supplying their current password.
     */
    private String currentPassword;

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
