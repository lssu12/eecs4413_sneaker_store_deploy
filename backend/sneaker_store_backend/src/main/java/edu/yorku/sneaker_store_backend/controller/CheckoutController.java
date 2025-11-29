package edu.yorku.sneaker_store_backend.controller;

import edu.yorku.sneaker_store_backend.dto.CheckoutRequestDto;
import edu.yorku.sneaker_store_backend.dto.CheckoutResponseDto;
import edu.yorku.sneaker_store_backend.service.CheckoutService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for handling checkout operations.
 */
@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "http://localhost:5173")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    /**
     * POST /api/checkout
     * <p>
     * Expects a payload shaped like:
     * <pre>
     * {
     *   "customerId": 1,
     *   "items": [
     *     { "productId": 10, "sku": "AJ1-RED", "quantity": 2 }
     *   ],
     *   "shippingAddress": "123 King St, Toronto, ON",
     *   "billingAddress": "",
     *   "paymentMethod": "VISA"
     * }
     * </pre>
     * Sends back {@link CheckoutResponseDto} with the generated order number, status, total and
     * the normalized items list. Validation failures are returned with HTTP 400.
     */
    @PostMapping
    public ResponseEntity<CheckoutResponseDto> checkout(@RequestBody CheckoutRequestDto request) {
        try {
            CheckoutResponseDto response = checkoutService.checkout(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(errorResponse(ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse("Unable to process checkout"));
        }
    }

    private CheckoutResponseDto errorResponse(String message) {
        return CheckoutResponseDto.builder()
                .orderId(null)
                .orderNumber(null)
                .status("ERROR")
                .message(message)
                .build();
    }
}
