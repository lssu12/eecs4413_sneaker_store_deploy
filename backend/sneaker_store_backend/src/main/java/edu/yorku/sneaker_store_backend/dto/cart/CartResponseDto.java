package edu.yorku.sneaker_store_backend.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponseDto {

    private Long cartId;
    private Long customerId;
    private int totalItems;
    private BigDecimal totalAmount;
    private List<CartItemResponseDto> items;
}
