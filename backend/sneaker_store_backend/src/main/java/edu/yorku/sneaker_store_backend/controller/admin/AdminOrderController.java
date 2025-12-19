package edu.yorku.sneaker_store_backend.controller.admin;

import edu.yorku.sneaker_store_backend.model.Order;
import edu.yorku.sneaker_store_backend.service.OrderService;
import edu.yorku.sneaker_store_backend.service.dto.OrderQueryParams;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin order endpoints exposing sales history views and status updates.
 */
@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * GET /api/admin/orders
     * <p>
     * Query params: <code>status</code> (optional). Used by admin dashboards to review sales history.
     */
    @GetMapping
    public ResponseEntity<?> listOrders(
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "customerId", required = false) Long customerId,
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
     * GET /api/admin/orders/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        Order order = orderService.getOrder(id);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }

    /**
     * PUT /api/admin/orders/{id}/status
     * <p>
     * Payload: { "status": "SHIPPED" }
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String statusValue = body.get("status");
        if (statusValue == null || statusValue.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error("Status is required"));
        }
        try {
            Order.OrderStatus status = parseStatus(statusValue);
            Order updated = orderService.updateStatus(id, status);
            if (updated == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error(ex.getMessage()));
        }
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
