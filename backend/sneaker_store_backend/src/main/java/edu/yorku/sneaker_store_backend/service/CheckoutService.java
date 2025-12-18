package edu.yorku.sneaker_store_backend.service;

import edu.yorku.sneaker_store_backend.dto.CheckoutItemDto;
import edu.yorku.sneaker_store_backend.dto.CheckoutRequestDto;
import edu.yorku.sneaker_store_backend.dto.CheckoutResponseDto;
import edu.yorku.sneaker_store_backend.model.Customer;
import edu.yorku.sneaker_store_backend.model.Order;
import edu.yorku.sneaker_store_backend.model.OrderItem;
import edu.yorku.sneaker_store_backend.model.Product;
import edu.yorku.sneaker_store_backend.repository.CustomerRepository;
import edu.yorku.sneaker_store_backend.repository.OrderRepository;
import edu.yorku.sneaker_store_backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service responsible for orchestrating checkout operations.
 */
@Service
public class CheckoutService {

    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final InventoryHistoryService inventoryHistoryService;

    public CheckoutService(ProductRepository productRepository,
                           CustomerRepository customerRepository,
                           OrderRepository orderRepository,
                           InventoryHistoryService inventoryHistoryService) {
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.inventoryHistoryService = inventoryHistoryService;
    }

    /**
     * Processes the incoming checkout request and persists a new Order aggregate.
     * <p>
     * Expected usage:
     * <ol>
     *   <li>Populate a {@link CheckoutRequestDto} with the authenticated customer id, cart items
     *       (each item must reference a product by id or SKU) and optional shipping/billing addresses.</li>
     *   <li>Invoke this method; the service will validate inventory, decrement stock, compose
     *       shipping/billing addresses, and persist {@link Order} / {@link OrderItem} entities.</li>
     *   <li>Read the returned {@link CheckoutResponseDto} for the generated order number, total amount,
     *       persisted status and normalized item list which can be echoed back to the client UI.</li>
     * </ol>
     * Any validation or stock related issues raise {@link IllegalArgumentException} or
     * {@link IllegalStateException} so controllers can translate them into HTTP 400 responses.
     */
    @Transactional
    public CheckoutResponseDto checkout(CheckoutRequestDto request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Checkout request must include items");
        }

        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .customer(customer)
                .orderDate(LocalDateTime.now())
                .status(Order.OrderStatus.PENDING)
                .shippingAddress(resolveAddress(request.getShippingAddress(), customer))
                .billingAddress(resolveBillingAddress(request, customer))
                .totalAmount(BigDecimal.ZERO)
                .build();

        if (order.getItems() == null) {
            order.setItems(new ArrayList<>());
        }

        BigDecimal total = BigDecimal.ZERO;
        List<Product> updatedProducts = new ArrayList<>();
        List<SaleAdjustment> saleAdjustments = new ArrayList<>();

        for (CheckoutItemDto itemDto : request.getItems()) {
            OrderItem orderItem = buildOrderItem(order, itemDto, saleAdjustments);
            updatedProducts.add(orderItem.getProduct());
            total = total.add(orderItem.getLineTotal());
            order.getItems().add(orderItem);
        }

        order.setTotalAmount(total);
        productRepository.saveAll(updatedProducts);
        Order savedOrder = orderRepository.save(order);

        saleAdjustments.forEach(adj ->
                inventoryHistoryService.recordSale(
                        adj.product(),
                        adj.previousStock(),
                        adj.newStock(),
                        adj.quantity(),
                        savedOrder.getId()
                ));

        return CheckoutResponseDto.builder()
                .orderId(savedOrder.getId())
                .orderNumber(savedOrder.getOrderNumber())
                .status(savedOrder.getStatus().name())
                .totalAmount(savedOrder.getTotalAmount())
                .items(mapToDto(savedOrder.getItems()))
                .message("Checkout processed successfully")
                .build();
    }

    private OrderItem buildOrderItem(Order order,
                                    CheckoutItemDto itemDto,
                                    List<SaleAdjustment> saleAdjustments) {
        Product product = resolveProduct(itemDto);
        int quantity = itemDto.getQuantity() != null ? itemDto.getQuantity() : 0;
        if (quantity <= 0) {
            throw new IllegalArgumentException("Item quantity must be greater than zero");
        }

        int currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
        if (currentStock < quantity) {
            throw new IllegalStateException("Insufficient stock for product: " + product.getName());
        }

        int newStock = currentStock - quantity;
        product.setStockQuantity(newStock);
        saleAdjustments.add(new SaleAdjustment(product, currentStock, newStock, quantity));
        BigDecimal unitPrice = product.getPrice();
        BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));

        return OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(quantity)
                .size(normalizeSize(itemDto.getSize()))
                .unitPrice(unitPrice)
                .lineTotal(lineTotal)
                .build();
    }

    private Product resolveProduct(CheckoutItemDto itemDto) {
        if (itemDto.getProductId() != null) {
            return productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        }
        if (hasText(itemDto.getSku())) {
            return productRepository.findBySku(itemDto.getSku())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        }
        throw new IllegalArgumentException("Product reference missing for checkout item");
    }

    private String resolveAddress(String provided, Customer customer) {
        if (hasText(provided)) {
            return provided;
        }
        return formatAddress(customer);
    }

    private String resolveBillingAddress(CheckoutRequestDto request, Customer customer) {
        if (hasText(request.getBillingAddress())) {
            return request.getBillingAddress();
        }
        return resolveAddress(request.getShippingAddress(), customer);
    }

    private String formatAddress(Customer customer) {
        List<String> parts = new ArrayList<>();
        if (hasText(customer.getAddressLine1())) {
            parts.add(customer.getAddressLine1());
        }
        if (hasText(customer.getAddressLine2())) {
            parts.add(customer.getAddressLine2());
        }
        if (hasText(customer.getCity())) {
            parts.add(customer.getCity());
        }
        if (hasText(customer.getProvince())) {
            parts.add(customer.getProvince());
        }
        if (hasText(customer.getPostalCode())) {
            parts.add(customer.getPostalCode());
        }
        if (hasText(customer.getCountry())) {
            parts.add(customer.getCountry());
        }
        return String.join(", ", parts);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID();
    }

    private List<CheckoutItemDto> mapToDto(List<OrderItem> items) {
        return items.stream()
                .map(item -> CheckoutItemDto.builder()
                        .productId(item.getProduct().getId())
                        .sku(item.getProduct().getSku())
                        .name(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .size(item.getSize())
                        .unitPrice(item.getUnitPrice())
                        .build())
                .collect(Collectors.toList());
    }

    private String normalizeSize(String size) {
        return hasText(size) ? size.trim() : null;
    }

    private record SaleAdjustment(Product product, int previousStock, int newStock, int quantity) {
    }
}
