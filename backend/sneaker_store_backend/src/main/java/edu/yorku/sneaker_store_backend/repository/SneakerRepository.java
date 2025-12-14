package edu.yorku.sneaker_store_backend.repository;

import edu.yorku.sneaker_store_backend.model.Sneaker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Sneaker Repository - Data access layer for Sneaker entity
 */
@Repository
public interface SneakerRepository extends JpaRepository<Sneaker, Long> {
    // Find by brand
    List<Sneaker> findByBrandId(Long brandId);
    
    // Find by category
    List<Sneaker> findByCategoryId(Long categoryId);
    
    // Find by brand and category
    List<Sneaker> findByBrandIdAndCategoryId(Long brandId, Long categoryId);
    
    // Search by name (case-insensitive)
    List<Sneaker> findByNameContainingIgnoreCase(String name);
    
    // Find by price range
    List<Sneaker> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    // Find in stock sneakers
    @Query("SELECT s FROM Sneaker s WHERE s.stockQuantity > 0")
    List<Sneaker> findInStockSneakers();
    
    // Search by keyword in name or description
    @Query("SELECT s FROM Sneaker s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Sneaker> searchByKeyword(@Param("keyword") String keyword);
}

