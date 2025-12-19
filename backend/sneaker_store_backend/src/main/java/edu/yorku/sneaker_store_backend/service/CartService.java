package edu.yorku.sneaker_store_backend.service;

import edu.yorku.sneaker_store_backend.dto.cart.CartItemRequestDto;
import edu.yorku.sneaker_store_backend.dto.cart.CartItemResponseDto;
import edu.yorku.sneaker_store_backend.dto.cart.CartResponseDto;
import edu.yorku.sneaker_store_backend.model.Cart;
import edu.yorku.sneaker_store_backend.model.CartItem;
import edu.yorku.sneaker_store_backend.model.Customer;
import edu.yorku.sneaker_store_backend.model.Product;
import edu.yorku.sneaker_store_backend.repository.CartRepository;
import edu.yorku.sneaker_store_backend.repository.CustomerRepository;
import edu.yorku.sneaker_store_backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository,
                       CustomerRepository customerRepository,
                       ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public CartResponseDto getCart(Long customerId) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> cartRepository.save(newCart(customerId)));
        return toDto(cart);
    }

    @Transactional
    public CartResponseDto addItem(Long customerId, CartItemRequestDto request) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> cartRepository.save(newCart(customerId)));

        Product product = resolveProduct(request.getProductId());
        int quantity = normalizeQuantity(request.getQuantity());
        String size = normalizeSize(request.getSize());

        CartItem existing = cart.getItems().stream()
                .filter(item -> Objects.equals(item.getProduct().getId(), product.getId())
                        && Objects.equals(item.getSize(), size))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .size(size)
                    .build();
            cart.getItems().add(item);
        }

        Cart saved = cartRepository.save(cart);
        return toDto(saved);
    }

    @Transactional
    public CartResponseDto updateItem(Long customerId, Long itemId, CartItemRequestDto request) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        CartItem target = cart.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        int quantity = normalizeQuantity(request.getQuantity());
        if (quantity <= 0) {
            cart.getItems().remove(target);
        } else {
            target.setQuantity(quantity);
            if (request.getSize() != null) {
                target.setSize(normalizeSize(request.getSize()));
            }
        }

        Cart saved = cartRepository.save(cart);
        return toDto(saved);
    }

    @Transactional
    public CartResponseDto removeItem(Long customerId, Long itemId) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        boolean removed = cart.getItems().removeIf(item -> item.getId().equals(itemId));
        if (!removed) {
            throw new IllegalArgumentException("Cart item not found");
        }
        Cart saved = cartRepository.save(cart);
        return toDto(saved);
    }

    @Transactional
    public void clearCart(Long customerId) {
        cartRepository.findByCustomerId(customerId).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
    }

    private Customer loadCustomer(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
    }

    private Cart newCart(Long customerId) {
        return Cart.builder()
                .customer(loadCustomer(customerId))
                .items(new ArrayList<>())
                .build();
    }

    private Product resolveProduct(Long productId) {
        if (productId == null) {
            throw new IllegalArgumentException("Product id is required");
        }
        return productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    private int normalizeQuantity(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }
        return quantity;
    }

    private String normalizeSize(String size) {
        return size != null && !size.isBlank() ? size.trim() : null;
    }

    private CartResponseDto toDto(Cart cart) {
        List<CartItemResponseDto> itemDtos = cart.getItems().stream()
                .map(this::toItemDto)
                .toList();

        int totalItems = itemDtos.stream().mapToInt(CartItemResponseDto::getQuantity).sum();
        BigDecimal totalAmount = itemDtos.stream()
                .map(CartItemResponseDto::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponseDto.builder()
                .cartId(cart.getId())
                .customerId(cart.getCustomer() != null ? cart.getCustomer().getId() : null)
                .totalItems(totalItems)
                .totalAmount(totalAmount)
                .items(itemDtos)
                .build();
    }

    private CartItemResponseDto toItemDto(CartItem item) {
        Product product = item.getProduct();
        BigDecimal unitPrice = product.getPrice();
        BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

        return CartItemResponseDto.builder()
                .itemId(item.getId())
                .productId(product.getId())
                .name(product.getName())
                .brand(product.getBrand())
                .imageUrl(product.getImageUrl())
                .quantity(item.getQuantity())
                .size(item.getSize())
                .unitPrice(unitPrice)
                .lineTotal(lineTotal)
                .build();
    }
}
