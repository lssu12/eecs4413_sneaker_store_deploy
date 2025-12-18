package edu.yorku.sneaker_store_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO encapsulating the payload required to execute a checkout.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequestDto {

    private Long customerId;

    private List<CheckoutItemDto> items;

    private String shippingAddress;

    private String billingAddress;

    private String paymentMethod;

    private String paymentToken;

    private boolean useSavedInfo;

    private String cardHolder;

    private String cardNumber;

    private String cardExpiry;

    private String cardCvv;

    private boolean savePaymentInfo;
}
