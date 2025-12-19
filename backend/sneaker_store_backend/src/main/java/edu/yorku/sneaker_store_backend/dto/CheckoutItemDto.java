package edu.yorku.sneaker_store_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO describing a single item submitted during checkout.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutItemDto {

    private Long productId;

    private String sku;

    private String name;

    private Integer quantity;

    private String size;

    private BigDecimal unitPrice;
}
