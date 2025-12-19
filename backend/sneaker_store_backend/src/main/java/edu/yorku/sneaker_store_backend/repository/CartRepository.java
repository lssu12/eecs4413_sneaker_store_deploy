package edu.yorku.sneaker_store_backend.repository;

import edu.yorku.sneaker_store_backend.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByCustomerId(Long customerId);
}
