package edu.yorku.sneaker_store_backend.repository;

import edu.yorku.sneaker_store_backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Order aggregates.
 */
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    /**
     * Retrieves an order by its human readable order number.
     */
    Optional<Order> findByOrderNumber(String orderNumber);

    /**
     * Lists all orders placed by a specific customer.
     */
    List<Order> findByCustomerId(Long customerId);
}
