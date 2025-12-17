package edu.yorku.sneaker_store_backend.controller;

import edu.yorku.sneaker_store_backend.model.Order;
import edu.yorku.sneaker_store_backend.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Order history endpoints shared by admins (who can retrieve everything) and customers
 * (who can request their own order list).
 */
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * GET /api/orders
     * <p>
     * Optional query parameters:
     * <ul>
     *   <li><code>customerId</code> – limits the response to a single customer's history.</li>
     *   <li><code>status</code> – filters results by {@link Order.OrderStatus} (e.g. PAID, SHIPPED).</li>
     * </ul>
     * When no parameters are supplied, every order is returned which is useful for admin dashboards.
     */
    @GetMapping
    public ResponseEntity<?> listOrders(
            @RequestParam(name = "customerId", required = false) Long customerId,
            @RequestParam(name = "status", required = false) String status
    ) {
        try {
            Order.OrderStatus parsedStatus = parseStatus(status);
            List<Order> orders = orderService.listOrders(customerId, parsedStatus);
            return ResponseEntity.ok(orders);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error(ex.getMessage()));
        }
    }

    /**
     * GET /api/orders/{id}
     * <p>
     * Retrieves a single order (including its items) by id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        Order order = orderService.getOrder(id);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }

    private Order.OrderStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        try {
            return Order.OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid order status: " + status);
        }
    }

    private Map<String, String> error(String message) {
        return Map.of("message", message);
    }
}
