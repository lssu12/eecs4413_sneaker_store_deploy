package edu.yorku.sneaker_store_backend.service;

import edu.yorku.sneaker_store_backend.dto.AuthResponseDto;
import edu.yorku.sneaker_store_backend.dto.ChangePasswordRequestDto;
import edu.yorku.sneaker_store_backend.dto.CustomerProfileDto;
import edu.yorku.sneaker_store_backend.dto.LoginRequestDto;
import edu.yorku.sneaker_store_backend.dto.RegisterRequestDto;
import edu.yorku.sneaker_store_backend.dto.UpdateProfileRequestDto;
import edu.yorku.sneaker_store_backend.model.Customer;
import edu.yorku.sneaker_store_backend.repository.CustomerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Contains the primary registration and login workflows for customers.
 */
@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registers a brand-new customer account.
     * <p>
     * Usage: populate {@link RegisterRequestDto} from the signup form and call this method.
     * It validates unique email addresses, hashes the provided password with BCrypt, stores
     * address/phone metadata, then returns {@link AuthResponseDto} describing the created account.
     */
    public AuthResponseDto register(RegisterRequestDto request) {
        if (!hasText(request.getEmail()) || !hasText(request.getPassword())) {
            throw new IllegalArgumentException("Email and password are required");
        }
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        Customer customer = Customer.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .addressLine1(request.getAddressLine1())
                .addressLine2(request.getAddressLine2())
                .city(request.getCity())
                .province(request.getProvince())
                .postalCode(request.getPostalCode())
                .country(request.getCountry())
                .billingAddressLine1(defaultValue(request.getBillingAddressLine1(), request.getAddressLine1()))
                .billingAddressLine2(defaultValue(request.getBillingAddressLine2(), request.getAddressLine2()))
                .billingCity(defaultValue(request.getBillingCity(), request.getCity()))
                .billingProvince(defaultValue(request.getBillingProvince(), request.getProvince()))
                .billingPostalCode(defaultValue(request.getBillingPostalCode(), request.getPostalCode()))
                .billingCountry(defaultValue(request.getBillingCountry(), request.getCountry()))
                .creditCardHolder(request.getCreditCardHolder())
                .creditCardNumber(request.getCreditCardNumber())
                .creditCardExpiry(request.getCreditCardExpiry())
                .creditCardCvv(request.getCreditCardCvv())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("CUSTOMER")
                .build();

        Customer saved = customerRepository.save(customer);
        return successResponse(saved, "Registration successful");
    }

    /**
     * Authenticates an existing customer by email+password combination.
     * <p>
     * Usage: populate {@link LoginRequestDto} from the login form, call this method, and act on the
     * returned {@link AuthResponseDto}. Consumers should handle {@link IllegalArgumentException}
     * to detect invalid credentials and translate them into HTTP 401/400 responses.
     */
    public AuthResponseDto login(LoginRequestDto request) {
        if (!hasText(request.getEmail()) || !hasText(request.getPassword())) {
            throw new IllegalArgumentException("Email and password are required");
        }

        Customer customer = customerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), customer.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return successResponse(customer, "Login successful");
    }

    /**
     * Allows logged in customers to refresh their personal information. We re-check the password to
     * keep the behavior consistent with the lightweight login system used elsewhere in the app.
     */
    public AuthResponseDto updateProfile(UpdateProfileRequestDto request) {
        if (request.getCustomerId() == null) {
            throw new IllegalArgumentException("Customer ID is required");
        }
        if (!hasText(request.getCurrentPassword())) {
            throw new IllegalArgumentException("Current password is required");
        }

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), customer.getPasswordHash())) {
            throw new SecurityException("Invalid email or password");
        }

        if (hasText(request.getFirstName())) {
            customer.setFirstName(request.getFirstName());
        }
        if (hasText(request.getLastName())) {
            customer.setLastName(request.getLastName());
        }
        if (hasText(request.getEmail())) {
            String normalizedEmail = request.getEmail().trim();
            if (!normalizedEmail.equalsIgnoreCase(customer.getEmail())) {
                if (customerRepository.existsByEmail(normalizedEmail)) {
                    throw new IllegalArgumentException("Email already registered");
                }
                customer.setEmail(normalizedEmail);
            }
        }
        if (request.getPhoneNumber() != null) {
            customer.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddressLine1() != null) {
            customer.setAddressLine1(request.getAddressLine1());
        }
        if (request.getAddressLine2() != null) {
            customer.setAddressLine2(request.getAddressLine2());
        }
        if (request.getCity() != null) {
            customer.setCity(request.getCity());
        }
        if (request.getProvince() != null) {
            customer.setProvince(request.getProvince());
        }
        if (request.getPostalCode() != null) {
            customer.setPostalCode(request.getPostalCode());
        }
        if (request.getCountry() != null) {
            customer.setCountry(request.getCountry());
        }
        if (request.getBillingAddressLine1() != null) {
            customer.setBillingAddressLine1(request.getBillingAddressLine1());
        }
        if (request.getBillingAddressLine2() != null) {
            customer.setBillingAddressLine2(request.getBillingAddressLine2());
        }
        if (request.getBillingCity() != null) {
            customer.setBillingCity(request.getBillingCity());
        }
        if (request.getBillingProvince() != null) {
            customer.setBillingProvince(request.getBillingProvince());
        }
        if (request.getBillingPostalCode() != null) {
            customer.setBillingPostalCode(request.getBillingPostalCode());
        }
        if (request.getBillingCountry() != null) {
            customer.setBillingCountry(request.getBillingCountry());
        }
        if (request.getCreditCardHolder() != null) {
            customer.setCreditCardHolder(request.getCreditCardHolder());
        }
        if (request.getCreditCardNumber() != null) {
            customer.setCreditCardNumber(request.getCreditCardNumber());
        }
        if (request.getCreditCardExpiry() != null) {
            customer.setCreditCardExpiry(request.getCreditCardExpiry());
        }
        if (request.getCreditCardCvv() != null) {
            customer.setCreditCardCvv(request.getCreditCardCvv());
        }

        Customer saved = customerRepository.save(customer);
        return successResponse(saved, "Profile updated successfully");
    }

    /**
     * Allows customers to change their password without editing profile fields.
     */
    public AuthResponseDto changePassword(ChangePasswordRequestDto request) {
        if (request.getCustomerId() == null) {
            throw new IllegalArgumentException("Customer ID is required");
        }
        if (!hasText(request.getCurrentPassword()) || !hasText(request.getNewPassword())) {
            throw new IllegalArgumentException("Current and new password are required");
        }
        if (request.getNewPassword().equals(request.getCurrentPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }
        if (hasText(request.getConfirmNewPassword())
                && !request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new IllegalArgumentException("New password and confirmation do not match");
        }

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), customer.getPasswordHash())) {
            throw new SecurityException("Invalid current password");
        }

        customer.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        Customer saved = customerRepository.save(customer);
        return successResponse(saved, "Password updated successfully");
    }

    /**
     * Returns the persisted profile data for the supplied customer id so clients can pre-populate
     * profile forms before sending an update.
     */
    public CustomerProfileDto getProfile(Long customerId) {
        if (customerId == null) {
            throw new IllegalArgumentException("Customer ID is required");
        }

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        return CustomerProfileDto.builder()
                .id(customer.getId())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .email(customer.getEmail())
                .phoneNumber(customer.getPhoneNumber())
                .addressLine1(customer.getAddressLine1())
                .addressLine2(customer.getAddressLine2())
                .city(customer.getCity())
                .province(customer.getProvince())
                .postalCode(customer.getPostalCode())
                .country(customer.getCountry())
                .billingAddressLine1(customer.getBillingAddressLine1())
                .billingAddressLine2(customer.getBillingAddressLine2())
                .billingCity(customer.getBillingCity())
                .billingProvince(customer.getBillingProvince())
                .billingPostalCode(customer.getBillingPostalCode())
                .billingCountry(customer.getBillingCountry())
                .creditCardHolder(customer.getCreditCardHolder())
                .creditCardNumber(customer.getCreditCardNumber())
                .creditCardExpiry(customer.getCreditCardExpiry())
                .creditCardCvv(customer.getCreditCardCvv())
                .build();
    }

    private AuthResponseDto successResponse(Customer customer, String message) {
        return AuthResponseDto.builder()
                .success(true)
                .message(message)
                .customerId(customer.getId())
                .token(generateToken())
                .role(customer.getRole())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .email(customer.getEmail())
                .phoneNumber(customer.getPhoneNumber())
                .addressLine1(customer.getAddressLine1())
                .addressLine2(customer.getAddressLine2())
                .city(customer.getCity())
                .province(customer.getProvince())
                .postalCode(customer.getPostalCode())
                .country(customer.getCountry())
                .billingAddressLine1(customer.getBillingAddressLine1())
                .billingAddressLine2(customer.getBillingAddressLine2())
                .billingCity(customer.getBillingCity())
                .billingProvince(customer.getBillingProvince())
                .billingPostalCode(customer.getBillingPostalCode())
                .billingCountry(customer.getBillingCountry())
                .creditCardHolder(customer.getCreditCardHolder())
                .creditCardNumber(customer.getCreditCardNumber())
                .creditCardExpiry(customer.getCreditCardExpiry())
                .creditCardCvv(customer.getCreditCardCvv())
                .build();
    }

    private String generateToken() {
        return UUID.randomUUID().toString();
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private String defaultValue(String candidate, String fallback) {
        return hasText(candidate) ? candidate : fallback;
    }
}
