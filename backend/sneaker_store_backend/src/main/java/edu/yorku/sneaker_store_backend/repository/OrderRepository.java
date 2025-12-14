package edu.yorku.sneaker_store_backend.repository;

import edu.yorku.sneaker_store_backend.model.Order;
import edu.yorku.sneaker_store_backend.model.Order.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Order Repository - Data access layer for Order entity
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);
    Optional<Order> findByOrderNumber(String orderNumber);
}

