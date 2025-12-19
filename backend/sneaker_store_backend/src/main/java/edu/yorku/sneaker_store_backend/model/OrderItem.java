package edu.yorku.sneaker_store_backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Line item within an order representing a specific product purchase.
 */
@Entity
@Table(name = "order_items")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Associated order aggregate.
     */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;

    /**
     * Product being purchased.
     */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    /**
     * Number of units requested.
     */
    @Column(nullable = false)
    private Integer quantity;

    /**
     * Selected shoe size for this item (e.g., Men's 9.5).
     */
    @Column(length = 10)
    private String size;

    /**
     * Price charged per unit when the order was placed.
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    /**
     * Convenience accessor for total price of the line item.
     */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal lineTotal;
}
