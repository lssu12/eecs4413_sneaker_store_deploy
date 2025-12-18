package edu.yorku.sneaker_store_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Captures every inventory-related change for a product so admins can review price, sale,
 * and restock history over time.
 */
@Entity
@Table(name = "inventory_events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private EventType type;

    @Column(nullable = false)
    private LocalDateTime eventTime;

    private Integer quantityDelta;

    private Integer previousStock;

    private Integer newStock;

    @Column(precision = 10, scale = 2)
    private BigDecimal previousPrice;

    @Column(precision = 10, scale = 2)
    private BigDecimal newPrice;

    private Long orderId;

    @Column(length = 255)
    private String note;

    public enum EventType {
        PRICE_CHANGE,
        SALE,
        RESTOCK,
        ADJUSTMENT
    }
}
