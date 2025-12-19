package edu.yorku.sneaker_store_backend.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponseDto {

    private Long itemId;
    private Long productId;
    private String name;
    private String brand;
    private String imageUrl;
    private Integer quantity;
    private String size;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;
}
