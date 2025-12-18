package edu.yorku.sneaker_store_backend.repository;

import edu.yorku.sneaker_store_backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository interface for managing Customer persistence operations.
 */
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    /**
     * Finds a customer by their unique email address.
     */
    Optional<Customer> findByEmail(String email);

    /**
     * Checks if a customer already exists for a given email.
     */
    boolean existsByEmail(String email);
}
