package edu.yorku.sneaker_store_backend.controller;

import edu.yorku.sneaker_store_backend.model.Order;
import edu.yorku.sneaker_store_backend.service.OrderService;
import edu.yorku.sneaker_store_backend.service.dto.OrderQueryParams;
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
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "productId", required = false) Long productId,
            @RequestParam(name = "dateFrom", required = false) String dateFrom,
            @RequestParam(name = "dateTo", required = false) String dateTo
    ) {
        try {
            OrderQueryParams params = toParams(customerId, status, productId, dateFrom, dateTo);
            List<Order> orders = orderService.listOrders(params);
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

    private OrderQueryParams toParams(Long customerId,
                                      String status,
                                      Long productId,
                                      String dateFrom,
                                      String dateTo) {
        OrderQueryParams.OrderStatus parsedStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                parsedStatus = OrderQueryParams.OrderStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException("Invalid order status: " + status);
            }
        }

        return OrderQueryParams.builder()
                .customerId(customerId)
                .status(parsedStatus)
                .productId(productId)
                .dateFrom(parseDate(dateFrom))
                .dateTo(parseDate(dateTo))
                .build();
    }

    private java.time.LocalDate parseDate(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return java.time.LocalDate.parse(value);
        } catch (java.time.format.DateTimeParseException ex) {
            throw new IllegalArgumentException("Invalid date format (expected yyyy-MM-dd): " + value);
        }
    }

    private Map<String, String> error(String message) {
        return Map.of("message", message);
    }
}
