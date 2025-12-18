package edu.yorku.sneaker_store_backend.service;

import edu.yorku.sneaker_store_backend.model.Order;
import edu.yorku.sneaker_store_backend.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
     * Retrieves order history. If {@code customerId} is provided the result is scoped to that
     * customer, otherwise all orders are returned (for admin dashboards). Optional status filtering
     * can be applied by passing an {@link Order.OrderStatus} value.
     */
    public List<Order> listOrders(Long customerId, Order.OrderStatus status) {
        List<Order> base = (customerId != null)
                ? orderRepository.findByCustomerId(customerId)
                : orderRepository.findAll();

        if (status == null) {
            return base;
        }

        return base.stream()
                .filter(order -> order.getStatus() == status)
                .collect(Collectors.toList());
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
