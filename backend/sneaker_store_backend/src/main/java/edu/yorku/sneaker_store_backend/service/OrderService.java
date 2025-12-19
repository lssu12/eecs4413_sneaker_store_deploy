package edu.yorku.sneaker_store_backend.service;

import edu.yorku.sneaker_store_backend.model.Order;
import edu.yorku.sneaker_store_backend.repository.OrderRepository;
import edu.yorku.sneaker_store_backend.service.dto.OrderQueryParams;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * Provides read-only access to order history for both customers and administrators.
 */
@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * Retrieves order history with optional filtering by customer, status, product, and date range.
     */
    public List<Order> listOrders(OrderQueryParams params) {
        Specification<Order> spec = (root, query, cb) -> cb.conjunction();

        if (params.getCustomerId() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("customer").get("id"), params.getCustomerId()));
        }
        if (params.getStatus() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), Order.OrderStatus.valueOf(params.getStatus().name())));
        }
        if (params.getProductId() != null) {
            spec = spec.and((root, query, cb) -> {
                var join = root.join("items");
                return cb.equal(join.get("product").get("id"), params.getProductId());
            });
        }
        if (params.getDateFrom() != null) {
            LocalDateTime start = params.getDateFrom().atStartOfDay();
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("orderDate"), start));
        }
        if (params.getDateTo() != null) {
            LocalDateTime end = params.getDateTo().atTime(LocalTime.MAX);
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("orderDate"), end));
        }

        return orderRepository.findAll(spec);
    }

    /**
     * Fetches a single order by its database identifier.
     */
    public Order getOrder(Long orderId) {
        return orderRepository.findById(orderId).orElse(null);
    }

    /**
     * Allows administrators to change the status of an order.
     */
    public Order updateStatus(Long orderId, Order.OrderStatus status) {
        Order order = getOrder(orderId);
        if (order == null) {
            return null;
        }
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
