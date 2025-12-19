package edu.yorku.sneaker_store_backend.repository;

import edu.yorku.sneaker_store_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository interface providing CRUD access for Product entities.
 */
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Looks up a product by its SKU.
     */
    Optional<Product> findBySku(String sku);
}
