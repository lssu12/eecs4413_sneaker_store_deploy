package edu.yorku.sneaker_store_backend.controller;

import edu.yorku.sneaker_store_backend.dto.cart.CartItemRequestDto;
import edu.yorku.sneaker_store_backend.dto.cart.CartResponseDto;
import edu.yorku.sneaker_store_backend.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<?> getCart(@PathVariable Long customerId) {
        try {
            return ResponseEntity.ok(cartService.getCart(customerId));
        } catch (IllegalArgumentException ex) {
            return badRequest(ex.getMessage());
        }
    }

    @PostMapping("/{customerId}/items")
    public ResponseEntity<?> addItem(@PathVariable Long customerId,
                                     @RequestBody CartItemRequestDto request) {
        try {
            CartResponseDto response = cartService.addItem(customerId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException ex) {
            return badRequest(ex.getMessage());
        }
    }

    @PutMapping("/{customerId}/items/{itemId}")
    public ResponseEntity<?> updateItem(@PathVariable Long customerId,
                                        @PathVariable Long itemId,
                                        @RequestBody CartItemRequestDto request) {
        try {
            return ResponseEntity.ok(cartService.updateItem(customerId, itemId, request));
        } catch (IllegalArgumentException ex) {
            return badRequest(ex.getMessage());
        }
    }

    @DeleteMapping("/{customerId}/items/{itemId}")
    public ResponseEntity<?> removeItem(@PathVariable Long customerId,
                                        @PathVariable Long itemId) {
        try {
            return ResponseEntity.ok(cartService.removeItem(customerId, itemId));
        } catch (IllegalArgumentException ex) {
            return badRequest(ex.getMessage());
        }
    }

    private ResponseEntity<?> badRequest(String message) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(java.util.Map.of("message", message));
    }
}
