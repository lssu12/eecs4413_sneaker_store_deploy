package edu.yorku.sneaker_store_backend.repository;

import edu.yorku.sneaker_store_backend.model.Sneaker;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SneakerRepository extends JpaRepository<Sneaker, Long> {
    List<Sneaker> findByBrand(String brand);
    List<Sneaker> findByCategory(String category);
    List<Sneaker> findByNameContainingIgnoreCase(String keyword);
}
