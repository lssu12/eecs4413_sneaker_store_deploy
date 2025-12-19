package edu.yorku.sneaker_store_backend.repository;

import edu.yorku.sneaker_store_backend.model.Sneaker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Sneaker entities.
 * Extends JpaRepository to provide CRUD database operations.
 */
public interface SneakerRepository extends JpaRepository<Sneaker, Long>, JpaSpecificationExecutor<Sneaker> {

    /**
     * Finds sneakers by brand name (case-insensitive).
     */
    List<Sneaker> findByBrandIgnoreCase(String brand);

    /**
     * Searches sneakers whose names contain a keyword (case-insensitive).
     */
    List<Sneaker> findByNameContainingIgnoreCase(String keyword);

    Optional<Sneaker> findFirstByNameIgnoreCase(String name);
}
