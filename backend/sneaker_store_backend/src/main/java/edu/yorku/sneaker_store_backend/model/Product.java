package edu.yorku.sneaker_store_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Generic representation of a product sold by the sneaker store.
 */
@Entity
@Table(name = "products")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Stock keeping unit used for inventory tracking.
     */
    @Column(nullable = false, unique = true)
    private String sku;

    /**
     * Display name of the product.
     */
    @Column(nullable = false)
    private String name;

    /**
     * Brand associated with the product.
     */
    private String brand;

    /**
     * Optional long-form description shown on detail pages.
     */
    @Column(length = 1000)
    private String description;

    /**
     * Price per unit stored with currency precision.
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /**
     * In-stock quantity.
     */
    @Column(nullable = false)
    private Integer stockQuantity;

    /**
     * Optional URL to the product image.
     */
    private String imageUrl;
}
