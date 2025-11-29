package edu.yorku.sneaker_store_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO returned after processing a checkout request.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponseDto {

    private Long orderId;

    private String orderNumber;

    private BigDecimal totalAmount;

    private String status;

    private List<CheckoutItemDto> items;

    private String message;
}
