package edu.yorku.sneaker_store_backend.controller;

import edu.yorku.sneaker_store_backend.dto.AuthResponseDto;
import edu.yorku.sneaker_store_backend.dto.CustomerProfileDto;
import edu.yorku.sneaker_store_backend.dto.LoginRequestDto;
import edu.yorku.sneaker_store_backend.dto.RegisterRequestDto;
import edu.yorku.sneaker_store_backend.dto.UpdateProfileRequestDto;
import edu.yorku.sneaker_store_backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints for managing simple signup/login flows.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * POST /api/auth/register
     * <p>
     * Example payload:
     * <pre>
     * {
     *   "firstName": "Maria",
     *   "lastName": "Lopez",
     *   "email": "maria@example.com",
     *   "password": "s3cret!",
     *   "addressLine1": "123 Queen St"
     * }
     * </pre>
     * Returns {@link AuthResponseDto} describing the persisted customer.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody RegisterRequestDto request) {
        try {
            return ResponseEntity.ok(authService.register(request));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(failure(ex.getMessage()));
        }
    }

    /**
     * POST /api/auth/login
     * <p>
     * Example payload:
     * <pre>
     * {
     *   "email": "maria@example.com",
     *   "password": "s3cret!"
     * }
     * </pre>
     * Returns {@link AuthResponseDto} with a simple session token placeholder.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(failure(ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(failure("Unable to process login"));
        }
    }

    /**
     * PUT /api/auth/profile
     * <p>
     * Accepts {@link UpdateProfileRequestDto} where the caller specifies their id, current password,
     * and any personal info they wish to refresh (names, phone, address, etc.). Returns
     * {@link AuthResponseDto} just like login/register so the client can keep reusing the helper.
     */
    @PutMapping("/profile")
    public ResponseEntity<AuthResponseDto> updateProfile(@RequestBody UpdateProfileRequestDto request) {
        try {
            return ResponseEntity.ok(authService.updateProfile(request));
        } catch (SecurityException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(failure(ex.getMessage()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(failure(ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(failure("Unable to update profile"));
        }
    }

    /**
     * GET /api/auth/profile/{id}
     * <p>
     * Allows clients to fetch their persisted profile before editing so forms can show current data.
     */
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(@PathVariable("id") Long customerId) {
        try {
            CustomerProfileDto profile = authService.getProfile(customerId);
            return ResponseEntity.ok(profile);
        } catch (IllegalArgumentException ex) {
            HttpStatus status = "Customer not found".equalsIgnoreCase(ex.getMessage())
                    ? HttpStatus.NOT_FOUND
                    : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status).body(failure(ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(failure("Unable to fetch profile"));
        }
    }

    private AuthResponseDto failure(String message) {
        return AuthResponseDto.builder()
                .success(false)
                .message(message)
                .build();
    }
}
