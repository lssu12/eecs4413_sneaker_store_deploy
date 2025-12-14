package edu.yorku.sneaker_store_backend.repository;

import edu.yorku.sneaker_store_backend.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Brand Repository - Data access layer for Brand entity
 */
@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findByName(String name);
    boolean existsByName(String name);
}

