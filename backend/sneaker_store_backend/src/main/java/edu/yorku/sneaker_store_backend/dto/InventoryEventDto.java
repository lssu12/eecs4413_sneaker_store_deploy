package edu.yorku.sneaker_store_backend.dto;

import edu.yorku.sneaker_store_backend.model.InventoryEvent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Simplified projection of {@link InventoryEvent} for API responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryEventDto {

    private InventoryEvent.EventType type;
    private LocalDateTime eventTime;
    private Integer quantityDelta;
    private Integer previousStock;
    private Integer newStock;
    private BigDecimal previousPrice;
    private BigDecimal newPrice;
    private Long orderId;
    private String note;
}
