package edu.yorku.sneaker_store_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Aggregated view of a product's inventory history grouped by event type.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryHistoryResponseDto {

    private Long productId;
    private String productName;

    @Builder.Default
    private List<InventoryEventDto> priceChanges = List.of();

    @Builder.Default
    private List<InventoryEventDto> transactions = List.of();

    @Builder.Default
    private List<InventoryEventDto> restocks = List.of();
}
