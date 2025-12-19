package edu.yorku.sneaker_store_backend.repository;

import edu.yorku.sneaker_store_backend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
