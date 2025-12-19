package edu.yorku.sneaker_store_backend.repository;

import edu.yorku.sneaker_store_backend.model.InventoryEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Persistence operations for {@link InventoryEvent} rows.
 */
public interface InventoryEventRepository extends JpaRepository<InventoryEvent, Long> {

    List<InventoryEvent> findByProductIdOrderByEventTimeDesc(Long productId);
}
