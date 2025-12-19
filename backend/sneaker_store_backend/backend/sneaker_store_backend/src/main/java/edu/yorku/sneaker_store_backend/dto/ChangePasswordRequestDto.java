package edu.yorku.sneaker_store_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload for customers who want to update their password without editing profile data.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequestDto {

    /** Identifier for the customer changing their password. */
    private Long customerId;

    /** Current password used to validate the request. */
    private String currentPassword;

    /** Newly selected password. */
    private String newPassword;

    /** Optional confirmation supplied by the UI, helps catch typos. */
    private String confirmNewPassword;
}
